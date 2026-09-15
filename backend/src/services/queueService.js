import { Queue, Worker } from 'bullmq';
import EventEmitter from 'events';
import { getRedisConfig, isRedisAvailable } from '../config/redis.js';

// Fallback in-memory event bus when Redis is unavailable
class InMemoryJobQueue extends EventEmitter {
  constructor() {
    super();
    this.jobs = new Map();
    this.handlers = new Map();
    this.jobCounter = 1;
  }

  registerHandler(queueName, handler) {
    this.handlers.set(queueName, handler);
  }

  async add(queueName, jobName, data, options = {}) {
    const jobId = `mem-job-${this.jobCounter++}-${Date.now()}`;
    const jobRecord = {
      id: jobId,
      name: jobName,
      queueName,
      data,
      opts: options,
      timestamp: Date.now(),
      status: 'pending',
      returnvalue: null,
      failedReason: null
    };

    this.jobs.set(jobId, jobRecord);

    // Asynchronously dispatch to registered worker
    setImmediate(async () => {
      const handler = this.handlers.get(queueName);
      if (handler) {
        jobRecord.status = 'active';
        try {
          const result = await handler({ id: jobId, name: jobName, data });
          jobRecord.status = 'completed';
          jobRecord.returnvalue = result;
          this.emit(`completed:${jobId}`, result);
        } catch (err) {
          jobRecord.status = 'failed';
          jobRecord.failedReason = err.message;
          this.emit(`failed:${jobId}`, err);
        }
      } else {
        jobRecord.status = 'completed';
        jobRecord.returnvalue = { success: true, processedBy: 'in-memory-passthrough' };
        this.emit(`completed:${jobId}`, jobRecord.returnvalue);
      }
    });

    return {
      id: jobId,
      name: jobName,
      data,
      waitUntilFinished: async (timeoutMs = 15000) => {
        if (jobRecord.status === 'completed') return jobRecord.returnvalue;
        if (jobRecord.status === 'failed') throw new Error(jobRecord.failedReason);

        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error(`In-memory job ${jobId} timed out after ${timeoutMs}ms`));
          }, timeoutMs);

          this.once(`completed:${jobId}`, (res) => {
            clearTimeout(timer);
            resolve(res);
          });

          this.once(`failed:${jobId}`, (err) => {
            clearTimeout(timer);
            reject(err);
          });
        });
      }
    };
  }

  getMetrics() {
    const counts = { total: this.jobs.size, completed: 0, pending: 0, active: 0, failed: 0 };
    for (const job of this.jobs.values()) {
      counts[job.status] = (counts[job.status] || 0) + 1;
    }
    return counts;
  }
}

export class QueueService {
  constructor() {
    this.queues = {};
    this.workers = {};
    this.handlers = {};
    this.inMemoryQueue = new InMemoryJobQueue();
    this.useRedis = false;

    this.queueNames = [
      'voice-transcription',
      'profile-extraction',
      'rag-query',
      'skill-gap-analysis'
    ];
  }

  /**
   * Initialize queues and attach worker handlers
   */
  async init() {
    this.useRedis = isRedisAvailable();

    if (this.useRedis) {
      const redisConfig = getRedisConfig();
      try {
        for (const name of this.queueNames) {
          this.queues[name] = new Queue(name, {
            connection: redisConfig,
            defaultJobOptions: {
              removeOnComplete: 100,
              removeOnFail: 50,
              attempts: 2,
              backoff: { type: 'exponential', delay: 1000 }
            }
          });
        }
        console.log('[QueueService] Initialized BullMQ queues backed by Redis');
      } catch (err) {
        console.warn('[QueueService] Failed to initialize Redis BullMQ queues, switching to in-memory fallback:', err.message);
        this.useRedis = false;
      }
    } else {
      console.log('[QueueService] Operating with zero-config in-memory asynchronous worker queue');
    }

    this.registerDefaultWorkers();
  }

  /**
   * Register default workers connected to Python AI / Node fallback
   */
  registerDefaultWorkers() {
    this.registerWorker('voice-transcription', async (job) => {
      const { pythonAiClient } = await import('./pythonAiClient.js');
      return await pythonAiClient.transcribeAudio(job.data.audioPath, job.data.language);
    });

    this.registerWorker('profile-extraction', async (job) => {
      const { pythonAiClient } = await import('./pythonAiClient.js');
      return await pythonAiClient.extractProfile(job.data.transcriptText, {}, job.data.language);
    });

    this.registerWorker('rag-query', async (job) => {
      const { pythonAiClient } = await import('./pythonAiClient.js');
      return await pythonAiClient.queryRAG(job.data.queryText, job.data.topK);
    });

    this.registerWorker('skill-gap-analysis', async (job) => {
      const { pythonAiClient } = await import('./pythonAiClient.js');
      return await pythonAiClient.computeSkillGap(
        job.data.profileData?.skills || [],
        job.data.targetJobRoleId,
        job.data.profileData?.work_experience
      );
    });
  }

  /**
   * Register a processor/handler for a specific queue
   */
  registerWorker(queueName, processorFn) {
    this.handlers[queueName] = processorFn;
    this.inMemoryQueue.registerHandler(queueName, processorFn);

    if (this.useRedis && this.queues[queueName]) {
      try {
        const redisConfig = getRedisConfig();
        this.workers[queueName] = new Worker(queueName, processorFn, {
          connection: redisConfig,
          concurrency: 4
        });

        this.workers[queueName].on('completed', (job) => {
          console.log(`[BullMQ Worker:${queueName}] Job ${job.id} completed`);
        });

        this.workers[queueName].on('failed', (job, err) => {
          console.error(`[BullMQ Worker:${queueName}] Job ${job?.id} failed:`, err.message);
        });
      } catch (err) {
        console.warn(`[BullMQ Worker:${queueName}] Worker registration failed, relying on fallback:`, err.message);
      }
    }
  }

  /**
   * Add a job to a named queue and optionally await result
   */
  async addJob(queueName, jobName, payload, options = {}) {
    if (this.useRedis && this.queues[queueName]) {
      try {
        const job = await this.queues[queueName].add(jobName, payload, options);
        return {
          id: job.id,
          name: jobName,
          queueName,
          driver: 'bullmq-redis',
          waitUntilFinished: async (timeoutMs = 20000) => {
            return await job.waitUntilFinished(this.workers[queueName]?.queueEvents, timeoutMs);
          }
        };
      } catch (err) {
        console.warn(`[QueueService] BullMQ push failed, executing via in-memory queue:`, err.message);
      }
    }

    // In-memory fallback
    const job = await this.inMemoryQueue.add(queueName, jobName, payload, options);
    return {
      id: job.id,
      name: jobName,
      queueName,
      driver: 'in-memory-fallback',
      waitUntilFinished: job.waitUntilFinished
    };
  }

  /**
   * Convenience helpers for specific diagram pipeline steps
   */
  async enqueueVoiceTranscription(audioPath, mimeType, language = 'hi') {
    return this.addJob('voice-transcription', 'transcribe-audio', {
      audioPath,
      mimeType,
      language,
      timestamp: Date.now()
    });
  }

  async enqueueProfileExtraction(userId, transcriptText, language = 'hi') {
    return this.addJob('profile-extraction', 'extract-profile-entities', {
      userId,
      transcriptText,
      language,
      timestamp: Date.now()
    });
  }

  async enqueueRAGQuery(queryText, topK = 3) {
    return this.addJob('rag-query', 'retrieve-nsqf-context', {
      queryText,
      topK,
      timestamp: Date.now()
    });
  }

  async enqueueSkillGapAnalysis(userId, profileData, targetJobRoleId) {
    return this.addJob('skill-gap-analysis', 'compute-skill-gaps', {
      userId,
      profileData,
      targetJobRoleId,
      timestamp: Date.now()
    });
  }

  /**
   * Queue health metrics for Admin portal & analytics
   */
  async getMetrics() {
    if (this.useRedis) {
      const metrics = {};
      for (const name of this.queueNames) {
        const q = this.queues[name];
        if (q) {
          const [waiting, active, completed, failed] = await Promise.all([
            q.getWaitingCount(),
            q.getActiveCount(),
            q.getCompletedCount(),
            q.getFailedCount()
          ]);
          metrics[name] = { waiting, active, completed, failed };
        }
      }
      return {
        driver: 'bullmq-redis',
        queues: metrics
      };
    }

    return {
      driver: 'in-memory-fallback',
      summary: this.inMemoryQueue.getMetrics(),
      queues: this.queueNames.reduce((acc, q) => {
        acc[q] = { status: 'ready', handlerRegistered: !!this.handlers[q] };
        return acc;
      }, {})
    };
  }
}

export const queueService = new QueueService();
export default queueService;
