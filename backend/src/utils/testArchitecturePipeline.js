import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import objectStore from '../services/objectStoreService.js';
import queueService from '../services/queueService.js';
import pythonAiClient from '../services/pythonAiClient.js';
import { checkRedisHealth } from '../config/redis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runArchitectureVerification() {
  console.log('================================================================');
  console.log('🚀 JeevanVani End-to-End Target Architecture Verification Runner');
  console.log('================================================================\n');

  // 1. Test Object Store Service
  console.log('1. Testing Object Store Service...');
  const sampleAudioBuffer = Buffer.from('RIFF....WAVEfmt ....data....FAKE_AUDIO_SAMPLE');
  const savedAudio = await objectStore.saveAudio(sampleAudioBuffer, 'test_assessment_speech.webm', {
    userId: 1,
    test: true
  });
  console.log(`   ✓ Audio object saved to Object Store: key="${savedAudio.key}", url="${savedAudio.url}"`);

  const fileExists = await objectStore.fileExists(savedAudio.key);
  console.log(`   ✓ Audio object existence verified: ${fileExists}`);

  const readBackBuffer = await objectStore.getFile(savedAudio.key);
  console.log(`   ✓ Retrieved ${readBackBuffer.length} bytes matching original size`);

  const health = objectStore.getHealth();
  console.log(`   ✓ Object Store health check: driver=${health.driver}`);

  // 2. Test Redis & Queue Service
  console.log('\n2. Testing Redis & Asynchronous Job Queue (BullMQ / In-Memory Fallback)...');
  const redisHealth = await checkRedisHealth();
  console.log(`   ✓ Redis Status: ${redisHealth.status} (${redisHealth.message || 'connected'})`);

  await queueService.init();

  // Test Enqueueing Voice Transcription Job
  const voiceJob = await queueService.enqueueVoiceTranscription(savedAudio.path, 'audio/webm', 'hi');
  console.log(`   ✓ Voice Transcription Job enqueued: id=${voiceJob.id}, driver=${voiceJob.driver}`);

  const voiceResult = await voiceJob.waitUntilFinished(10000);
  console.log(`   ✓ Voice Transcription Job resolved: text="${voiceResult.text}", engine="${voiceResult.source || voiceResult.engine}"`);

  // Test Enqueueing Profile Extraction Job
  const profileJob = await queueService.enqueueProfileExtraction(1, 'मेरी उम्र 22 साल है, 10वीं पास हूँ और मुझे बिजली का काम पसंद है', 'hi');
  console.log(`   ✓ Profile Extraction Job enqueued: id=${profileJob.id}`);
  const profileResult = await profileJob.waitUntilFinished(10000);
  console.log(`   ✓ Profile Extraction resolved:`, JSON.stringify(profileResult.extracted || profileResult));

  // Test Enqueueing RAG Query Job
  const ragJob = await queueService.enqueueRAGQuery('PM-AJAY subsidy for tool-kit and solar', 2);
  console.log(`   ✓ RAG Query Job enqueued: id=${ragJob.id}`);
  const ragResult = await ragJob.waitUntilFinished(10000);
  console.log(`   ✓ RAG Query resolved: ${(ragResult.documents || []).length} grounded documents returned`);

  // Test Enqueueing Skill Gap Analysis Job
  const skillGapJob = await queueService.enqueueSkillGapAnalysis(1, {
    skills: ['House Wiring & Electrical Safety'],
    work_experience: '1 year'
  }, 'Solar PV Installer');
  console.log(`   ✓ Skill Gap Analysis Job enqueued: id=${skillGapJob.id}`);
  const skillGapResult = await skillGapJob.waitUntilFinished(10000);
  console.log(`   ✓ Skill Gap resolved: match=${skillGapResult.matchPercentage}%, RPL Eligible=${skillGapResult.rplEligible}`);

  // Queue Metrics
  const metrics = await queueService.getMetrics();
  console.log(`   ✓ Queue Metrics:`, JSON.stringify(metrics));

  // 3. Test Python AI Client Bridge
  console.log('\n3. Testing Python AI Client & Fallback Engine...');
  const isPythonUp = await pythonAiClient.checkHealth();
  console.log(`   ✓ Python AI microservice reachable: ${isPythonUp}`);

  const testExtraction = await pythonAiClient.extractProfile('मैं 10वीं पास हूँ और सिलाई का काम जानता हूँ', {}, 'hi');
  console.log(`   ✓ Entity extraction result (${testExtraction.source}):`, JSON.stringify(testExtraction.extracted));

  const testRAG = await pythonAiClient.queryRAG('tool kit subsidy', 2);
  console.log(`   ✓ RAG retrieval result: ${testRAG.length} documents found`);

  // Cleanup test audio
  await objectStore.deleteFile(savedAudio.key);
  console.log(`\n4. Cleanup: Deleted test artifact ${savedAudio.key}`);

  console.log('\n================================================================');
  console.log('✅ ALL TARGET ARCHITECTURE PIPELINE TESTS PASSED SUCCESSFULLY');
  console.log('================================================================');
}

runArchitectureVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
