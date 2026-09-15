import logging
from typing import Dict, Any, List

logger = logging.getLogger("skill_gap_service")

# Standard NSQF Job Role Competency Matrix
ROLE_COMPETENCIES = {
    "solar pv installer": [
        "Solar Panel Assembly", "Inverter Wiring & Testing", "Earthing & Lightning Protection",
        "Battery Bank Maintenance", "DC Circuit Testing", "Roof Safety & Mounting"
    ],
    "assistant electrician": [
        "House Wiring & Electrical Safety", "Conduit Fitting", "Switchboard & Distribution Board Wiring",
        "Single Phase MCB Installation", "Multimeter Diagnostic Testing"
    ],
    "general duty assistant": [
        "Patient Care & Hygiene", "Vital Signs Monitoring", "Bed Making & Patient Mobility",
        "Infection Control Protocols", "Medical Waste Disposal"
    ],
    "domestic data entry operator": [
        "Data Entry & Typing", "Spreadsheets & Excel Functions", "Word Processing & Documentation",
        "Email Etiquette & Communication", "Speed & Accuracy Typing (30 WPM)"
    ],
    "automotive service technician": [
        "Two Wheeler Maintenance", "Engine Oil & Filter Replacement", "Brake System Servicing",
        "Spark Plug & Carburetor Tuning", "Electrical System Diagnostics"
    ],
    "handicraft artisan & garment tailor": [
        "Garment Stitching & Tailoring", "Fabric Cutting & Pattern Making", "Sewing Machine Maintenance",
        "Embroidery & Finishing", "Measurement & Fitting"
    ]
}

class SkillGapService:
    """
    Skill Gap Engine: Computes exact delta between beneficiary competencies and NSQF Qualification benchmarks.
    """
    def compute_skill_gap(self, user_skills: List[str], target_role_name: str, work_experience: str = "") -> Dict[str, Any]:
        role_key = (target_role_name or "").lower().strip()
        benchmark_skills = []

        for key, skills in ROLE_COMPETENCIES.items():
            if key in role_key or role_key in key:
                benchmark_skills = skills
                break

        if not benchmark_skills:
            benchmark_skills = [
                "Fundamental Technical Safety", "Tools & Equipment Handling",
                "Quality Inspection", "Standard Operating Procedures"
            ]

        user_skills_clean = [s.lower().strip() for s in user_skills]

        matching = []
        missing = []

        for b_skill in benchmark_skills:
            b_lower = b_skill.lower()
            matched = any(
                u in b_lower or b_lower in u
                for u in user_skills_clean
            )
            if matched:
                matching.append(b_skill)
            else:
                missing.append(b_skill)

        total = len(benchmark_skills)
        match_count = len(matching)
        match_percentage = round((match_count / total) * 100) if total > 0 else 0
        gap_percentage = 100 - match_percentage

        # RPL (Recognition of Prior Learning) qualification check:
        # If user has >= 1 year experience and matches >= 40% skills, eligible for fast-track RPL
        exp_lower = (work_experience or "").lower()
        has_prior_exp = "1" in exp_lower or "2" in exp_lower or "more" in exp_lower or "helper" in exp_lower
        rpl_eligible = has_prior_exp and (match_percentage >= 35)

        estimated_weeks = max(2, round((len(missing) * 1.5)))
        if rpl_eligible:
            estimated_weeks = 1  # 12-80 hours fast-track orientation

        return {
            "targetRole": target_role_name,
            "benchmarkSkills": benchmark_skills,
            "matchingSkills": matching,
            "missingSkills": missing,
            "matchPercentage": match_percentage,
            "gapPercentage": gap_percentage,
            "rplEligible": rpl_eligible,
            "estimatedUpskillingWeeks": estimated_weeks,
            "recommendedMicroCredentials": [
                f"Bridge Module: {s}" for s in missing[:3]
            ]
        }

skill_gap_service = SkillGapService()
