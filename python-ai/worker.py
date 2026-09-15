import os
import json
import time
import logging
from services.whisper_service import whisper_service
from services.llm_service import llm_service
from services.rag_service import rag_service
from services.skill_gap_service import skill_gap_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ai_worker")

REDIS_HOST = os.getenv("REDIS_HOST", "127.0.0.1")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

def process_job(queue_name: str, payload: dict) -> dict:
    """
    Process incoming job based on queue name
    """
    logger.info(f"Processing job from queue '{queue_name}'...")

    if queue_name == "voice-transcription":
        audio_path = payload.get("audioPath")
        language = payload.get("language", "hi")
        if not audio_path or not os.path.exists(audio_path):
            return {"error": "Audio file path does not exist", "audioPath": audio_path}
        return whisper_service.transcribe(audio_path, language=language)

    elif queue_name == "profile-extraction":
        text = payload.get("transcriptText", "")
        language = payload.get("language", "hi")
        return llm_service.extract_profile_entities(text=text, language=language)

    elif queue_name == "rag-query":
        query = payload.get("queryText", "")
        top_k = payload.get("topK", 3)
        return {"documents": rag_service.retrieve(query=query, top_k=top_k)}

    elif queue_name == "skill-gap-analysis":
        profile = payload.get("profileData", {})
        skills = profile.get("skills", [])
        role = payload.get("targetJobRoleId", "Solar PV Installer")
        exp = profile.get("work_experience", "")
        return skill_gap_service.compute_skill_gap(skills, role, exp)

    return {"status": "unrecognized_queue", "queue": queue_name}

def start_worker():
    logger.info("==================================================")
    logger.info("🚀 JeevanVani Python AI Worker Starting")
    logger.info(f"Connecting to Redis at {REDIS_HOST}:{REDIS_PORT}...")
    logger.info("==================================================")

    try:
        import redis
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, socket_timeout=3)
        r.ping()
        logger.info("Connected to Redis queue successfully. Waiting for jobs...")
    except Exception as e:
        logger.warning(f"Redis is not available ({e}). Worker operating in local demonstration mode.")
        logger.info("Worker is ready to be invoked directly by HTTP or subprocess.")
        return

    queues = [
        "bull:voice-transcription:wait",
        "bull:profile-extraction:wait",
        "bull:rag-query:wait",
        "bull:skill-gap-analysis:wait"
    ]

    while True:
        try:
            item = r.blpop(queues, timeout=5)
            if item:
                q_name, job_id = item
                q_str = q_name.decode("utf-8").split(":")[1]
                logger.info(f"Received job {job_id} from {q_str}")
                # BullMQ stores job data under bull:{q}:id
                job_data_raw = r.hget(f"bull:{q_str}:{job_id.decode('utf-8')}", "data")
                if job_data_raw:
                    payload = json.loads(job_data_raw.decode("utf-8"))
                    result = process_job(q_str, payload)
                    logger.info(f"Completed job {job_id}: {result}")
        except KeyboardInterrupt:
            logger.info("Worker stopped by user.")
            break
        except Exception as e:
            logger.error(f"Worker iteration exception: {e}")
            time.sleep(2)

if __name__ == "__main__":
    start_worker()
