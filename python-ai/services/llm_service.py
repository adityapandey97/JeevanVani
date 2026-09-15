import re
import os
import logging
from typing import Dict, Any, List

logger = logging.getLogger("llm_service")

class LLMService:
    """
    Entity Extraction and Conversational Counseling Engine for JeevanVani.
    Extracts structured beneficiary attributes from conversational Hindi & English speech.
    """
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")

    def extract_profile_entities(self, text: str, current_profile: Dict[str, Any] = None, language: str = "hi") -> Dict[str, Any]:
        """
        Extract structured fields from transcript text.
        """
        if not text:
            return {}

        clean = text.strip()
        updates: Dict[str, Any] = {}

        # 1. Age extraction
        age_match = re.search(r'\b(1[6-9]|[2-5][0-9]|60)\b', clean)
        if age_match:
            updates["age"] = int(age_match.group(1))

        # 2. Education extraction
        lower = clean.lower()
        if any(w in lower for w in ["8वीं", "8th", "आठवीं"]):
            updates["education"] = "8th Pass"
        elif any(w in lower for w in ["10वीं", "10th", "दसवीं", "metric", "matric", "high school"]):
            updates["education"] = "10th Pass"
        elif any(w in lower for w in ["12वीं", "12th", "बारहवीं", "inter", "intermediate"]):
            updates["education"] = "12th Pass"
        elif any(w in lower for w in ["iti", "diploma", "polytechnic", "आईटीआई"]):
            updates["education"] = "ITI / Diploma"
        elif any(w in lower for w in ["graduate", "b.a", "b.sc", "b.com", "btech", "स्नातक"]):
            updates["education"] = "Graduate"

        # 3. Employment Status
        if any(w in lower for w in ["बेरोजगार", "unemployed", "खाली", "no job", "jobless"]):
            updates["employment_status"] = "Currently Unemployed"
        elif any(w in lower for w in ["दिहाड़ी", "मजदूरी", "daily wage", "helper", "मजदूर"]):
            updates["employment_status"] = "Daily Wage / Helper"
        elif any(w in lower for w in ["दुकान", "स्वरोजगार", "self-employed", "own work", "business"]):
            updates["employment_status"] = "Self-Employed / Small Shop"
        elif any(w in lower for w in ["छात्र", "विद्यार्थी", "student", "study", "पढ़ रहा"]):
            updates["employment_status"] = "Student"

        # 4. Work Experience
        if any(w in lower for w in ["कोई अनुभव नहीं", "fresher", "no experience", "शुरुआत"]):
            updates["work_experience"] = "No prior experience (Fresher)"
        elif any(w in lower for w in ["1 साल से कम", "कम अनुभव", "helper", "less than 1"]):
            updates["work_experience"] = "Less than 1 year (Helper)"
        elif any(w in lower for w in ["1 से 2", "1-2", "2 साल", "2 years", "1 year"]):
            updates["work_experience"] = "1 - 2 years work"
        elif any(w in lower for w in ["2 साल से अधिक", "3 साल", "4 साल", "5 साल", "more than 2"]):
            updates["work_experience"] = "More than 2 years"

        # 5. Skills extraction
        extracted_skills: List[Dict[str, str]] = []
        skill_patterns = {
            "House Wiring & Electrical Safety": ["wiring", "वायरिंग", "तार", "electric", "बिजली", "switchboard", "current"],
            "Solar Panel Assembly": ["solar", "सोलर", "panel", "धूप", "photovoltaic", "battery"],
            "Patient Care & Hygiene": ["patient", "मरीज", "hospital", "अस्पताल", "nurse", "gda", "दवा"],
            "Data Entry & Typing": ["typing", "टाइपिंग", "computer", "कंप्यूटर", "data entry", "excel", "office"],
            "Two Wheeler Maintenance": ["bike", "बाइक", "motorcycle", "गाड़ी", "mechanic", "सर्विसिंग", "ऑटोमोबाइल"],
            "Garment Stitching & Tailoring": ["सिलाई", "कढ़ाई", "tailor", "sewing", "कपड़े", "garment"],
            "Brick Masonry & Plastering": ["चिनाई", "पलस्तर", "mason", "rajmistri", "राजमिस्त्री", "सीमेंट"],
            "Drip & Sprinkler Setup": ["खेती", "सिंचाई", "irrigation", "ड्रिप", "farming", "agriculture"],
            "Customer Sales & Billing": ["sales", "सेल्स", "retail", "दुकान", "billing", "customer"]
        }

        for skill_name, keywords in skill_patterns.items():
            if any(k in lower for k in keywords):
                extracted_skills.append({"name": skill_name, "proficiency_level": "Intermediate" if "अनुभव" in lower or "साल" in lower else "Beginner"})

        if extracted_skills:
            updates["skills"] = extracted_skills

        # 6. Interests extraction
        extracted_interests: List[str] = []
        interest_patterns = {
            "Electrical & Solar Energy": ["solar", "सोलर", "बिजली", "electric", "energy"],
            "Healthcare & Patient Care": ["health", "अस्पताल", "दवा", "care", "नर्सिंग"],
            "Computers & Digital Work": ["computer", "डिजिटल", "आईटी", "software", "typing"],
            "Automobiles & Mechanics": ["गाड़ी", "बाइक", "गाड़ियां", "auto", "vehicle"],
            "Apparel & Handicrafts": ["सिलाई", "शिल्प", "handicraft", "fashion", "कपड़े"],
            "Retail & Customer Service": ["दुकान", "retail", "sales", "ग्राहकों", "business"]
        }

        for interest_name, keywords in interest_patterns.items():
            if any(k in lower for k in keywords):
                extracted_interests.append(interest_name)

        if extracted_interests:
            updates["interests"] = extracted_interests

        # 7. Employment Preference
        if any(w in lower for w in ["स्वरोजगार", "खुद का काम", "दुकान", "business", "self-employed"]):
            updates["employment_preference"] = "Self-Employment"
        elif any(w in lower for w in ["नौकरी", "job", "private company", "काम करना"]):
            updates["employment_preference"] = "Job"
        elif any(w in lower for w in ["दोनों", "both", "चाहे नौकरी या स्वरोजगार"]):
            updates["employment_preference"] = "Both"

        # 8. Relocation willingness
        if any(w in lower for w in ["जा सकता हूँ", "बाहर", "willing to relocate", "हाँ", "yes"]):
            updates["willing_to_relocate"] = True
        elif any(w in lower for w in ["यहीं", "गृह जिला", "no relocate", "नहीं जा सकता", "home district"]):
            updates["willing_to_relocate"] = False

        return {
            "extracted": updates,
            "confidence": 0.90 if len(updates) > 0 else 0.70,
            "engine": "jeevanvani-vernacular-nlu-v2"
        }

llm_service = LLMService()
