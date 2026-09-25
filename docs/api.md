# JeevanVaani (जीवनवाणी) - REST API Documentation

**SIH Problem Statement:** SIH26097  
**System:** AI-Driven Voice Assistant for Livelihood Mapping & NSQF-Aligned Skilling Recommendations under PM-AJAY (GIA Component)  
**Team:** UnicodeX  
**API Base URL:** `/api` (or `/api/v1`)  
**Authentication Scheme:** Bearer Token (JWT in `Authorization: Bearer <token>`)

---

## Table of Contents
1. [Authentication Endpoints](#1-authentication-endpoints)
2. [Beneficiary Profile Endpoints](#2-beneficiary-profile-endpoints)
3. [Voice & Speech Endpoints](#3-voice--speech-endpoints)
4. [Conversational AI Assistant Endpoints](#4-conversational-ai-assistant-endpoints)
5. [NSQF Qualifications & Job Roles Endpoints](#5-nsqf-qualifications--job-roles-endpoints)
6. [Recommendations & Livelihood Mapping Endpoints](#6-recommendations--livelihood-mapping-endpoints)
7. [Applications & Enrollments Endpoints](#7-applications--enrollments-endpoints)
8. [Career Roadmap & Skill Gap Endpoints](#8-career-roadmap--skill-gap-endpoints)
9. [System Health & Government Source Status](#9-system-health--government-source-status)

---

## 1. Authentication Endpoints

### 1.1 Register Beneficiary
- **Method:** `POST`
- **Path:** `/api/auth/register` (also `/api/v1/auth/register`)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "full_name": "Ramesh Kumar",
    "phone": "9876543210",
    "password": "Password123",
    "category": "SC",
    "gender": "male",
    "language_preference": "hi"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "usr_9876543210",
      "full_name": "Ramesh Kumar",
      "phone": "9876543210",
      "category": "SC",
      "language_preference": "hi"
    }
  }
  ```

### 1.2 Login Beneficiary
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "phone": "9876543210",
    "password": "Password123"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": { ... }
  }
  ```

### 1.3 Logout
- **Method:** `POST`
- **Path:** `/api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  ```json
  { "success": true, "message": "Logged out successfully" }
  ```

---

## 2. Beneficiary Profile Endpoints

### 2.1 Get Current Beneficiary Profile
- **Method:** `GET`
- **Path:** `/api/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  ```json
  {
    "id": "usr_101",
    "full_name": "Sunita Devi",
    "phone": "9876543211",
    "education": "12th Pass",
    "experience_years": 2,
    "current_occupation": "Tailor / Seamstress",
    "skills": ["Sewing", "Cutting", "Garment Stitching"],
    "interests": ["Apparel Designing", "Boutique Management"],
    "location": "Lucknow",
    "category": "SC",
    "annual_income": 95000,
    "completeness": 85,
    "confidence_scores": {
      "education": 0.95,
      "experience_years": 0.88,
      "location": 0.92
    },
    "needs_confirmation": []
  }
  ```

### 2.2 Update Profile
- **Method:** `PUT`
- **Path:** `/api/profile`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "education": "Graduate",
    "location": "Kanpur",
    "skills": ["Sewing", "Pattern Making", "Quality Inspection"]
  }
  ```
- **Response:** `200 OK` with updated profile.

### 2.3 Extract Profile from Spoken Text
- **Method:** `POST`
- **Path:** `/api/profile/extract`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "text": "Mera naam Sunita hai, main 12th pass hoon aur Lucknow mein rehti hoon.",
    "language": "hi"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "extracted": {
      "full_name": "Sunita",
      "education": "12th Pass",
      "location": "Lucknow"
    },
    "confidence": {
      "education": 0.95,
      "location": 0.92
    },
    "completeness": 60,
    "needs_confirmation": []
  }
  ```

### 2.4 Delete Account & Privacy Erasure
- **Method:** `DELETE`
- **Path:** `/api/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  ```json
  { "success": true, "message": "Account and all associated beneficiary data permanently deleted" }
  ```

---

## 3. Voice & Speech Endpoints

### 3.1 Transcribe Audio
- **Method:** `POST`
- **Path:** `/api/voice/transcribe`
- **Headers:** `Content-Type: multipart/form-data` or `application/json`
- **Payload:** Binary audio recording (`audio/webm` or `audio/wav`)
- **Response:** `200 OK`
  ```json
  {
    "text": "मुझे सिलाई का काम सीखना है और सरकारी सहायता चाहिए",
    "detected_language": "hi",
    "confidence": 0.94
  }
  ```

### 3.2 Voice-Guided Interactive Onboarding
- **Method:** `POST`
- **Path:** `/api/voice/onboarding`
- **Request Body:**
  ```json
  {
    "step": 2,
    "user_response": "Main 10th pass hoon aur Bijli ka kaam jaanta hoon",
    "language": "hi"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "next_step": 3,
    "extracted_entities": {
      "education": "10th Pass",
      "skills": ["Electrical Wiring", "Circuit Repair"]
    },
    "prompt_text": "बहुत बढ़िया! क्या आपके पास इलेक्ट्रीशियन के काम का कोई पिछला अनुभव या प्रमाणपत्र है?",
    "prompt_audio_url": null
  }
  ```

---

## 4. Conversational AI Assistant Endpoints

### 4.1 Grounded RAG Assistant Conversation
- **Method:** `POST`
- **Path:** `/api/assistant/message`
- **Headers:** `Authorization: Bearer <token>` (optional for public inquiries)
- **Request Body:**
  ```json
  {
    "message": "मुझे सोलर पैनल इंस्टॉलेशन सीखना है, क्या पीएम-अजय में सहायता मिलेगी?",
    "language": "hi",
    "conversation_id": "conv_12345"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "reply": "हाँ, PM-AJAY (GIA घटक) के अंतर्गत अनुसूचित जाति (SC) के पात्र युवाओं को निःशुल्क कौशल प्रशिक्षण और टूलकिट सब्सिडी (₹50,000 तक) का प्रावधान है। सोलर पीवी इंस्टॉलर (NSQF लेवल 4) एक प्रमाणित कोर्स है। कृपया ध्यान दें कि अंतिम स्वीकृति जिला स्तर पर सत्यापन के अधीन है।",
    "citations": [
      {
        "source": "PM-AJAY GIA Guidelines 2023-24",
        "section": "Section 4.2 - Skill Development & Toolkit Subsidies",
        "url": "https://pmajay.dosje.gov.in"
      },
      {
        "source": "Skill India Digital",
        "course_id": "SGJ/Q0101",
        "qp_name": "Solar PV Installer (Suryamitra)",
        "nsqf_level": 4
      }
    ],
    "disclaimer": "यह सहायता केवल मार्गदर्शन के लिए है। किसी भी सरकारी योजना में चयन जिला स्तरीय अनुमोदन और पात्रता नियमों के अधीन है।"
  }
  ```

---

## 5. NSQF Qualifications & Job Roles Endpoints

### 5.1 Query Qualifications & Courses
- **Method:** `GET`
- **Path:** `/api/nsqf/qualifications`
- **Query Parameters:**
  - `sector`: e.g. `Healthcare`, `Renewable Energy`, `Apparel`, `Automotive`
  - `level`: NSQF level `1` to `8`
  - `q`: Search keyword (e.g. `Electrician`, `Solar`, `Tailor`)
  - `rpl_eligible`: `true` or `false`
- **Response:** `200 OK`
  ```json
  {
    "count": 12,
    "qualifications": [
      {
        "qp_code": "SGJ/Q0101",
        "title": "Solar PV Installer (Suryamitra)",
        "nsqf_level": 4,
        "sector": "Green Jobs",
        "entry_requirements": "10th pass + ITI or 12th pass",
        "rpl_eligible": true,
        "typical_wages": "₹15,000 - ₹25,000",
        "verified_source": "Skill India Digital"
      }
    ]
  }
  ```

### 5.2 Get Qualification Details by Code
- **Method:** `GET`
- **Path:** `/api/nsqf/qualifications/:id`
- **Response:** `200 OK` with full NOS breakdown, prerequisites, and RPL path.

---

## 6. Recommendations & Livelihood Mapping Endpoints

### 6.1 Personalized 6-Factor Multi-Pathway Recommendations
- **Method:** `GET`
- **Path:** `/api/recommendations`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  ```json
  {
    "profile_summary": {
      "education": "10th Pass",
      "experience_years": 3,
      "location": "Varanasi"
    },
    "recommendations": {
      "rpl_pathways": [
        {
          "role_name": "Domestic Electrician",
          "qp_code": "ELE/Q6001",
          "nsqf_level": 3,
          "match_score": 92,
          "reasoning": "3 years informal wiring experience matches RPL entry requirements",
          "subsidy_eligible": true,
          "max_toolkit_subsidy": 50000
        }
      ],
      "upskilling_pathways": [
        {
          "role_name": "Solar PV Installer (Suryamitra)",
          "qp_code": "SGJ/Q0101",
          "nsqf_level": 4,
          "match_score": 86,
          "duration_hours": 300
        }
      ],
      "wage_employment": [
        {
          "title": "Electrical Maintenance Technician",
          "employer": "UP State Industrial Development",
          "location": "Varanasi",
          "wage": "₹16,500/month",
          "match_score": 88
        }
      ],
      "self_employment_microenterprise": [
        {
          "business_idea": "Solar & Inverter Service Center",
          "credit_scheme": "NSFDC Soft Credit Linkage",
          "toolkit_subsidy": "₹50,000 under PM-AJAY GIA"
        }
      ]
    }
  }
  ```

---

## 7. Applications & Enrollments Endpoints

### 7.1 Track Beneficiary Applications & Enrollments
- **Method:** `GET`
- **Path:** `/api/applications`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  ```json
  {
    "applications": [
      {
        "id": "app_901",
        "type": "job",
        "title": "Solar Installation Assistant",
        "organization": "Suryamitra Kendra",
        "applied_at": "2026-09-20T10:30:00Z",
        "status": "under_review",
        "official_url": "https://www.skillindiadigital.gov.in"
      }
    ],
    "enrollments": [
      {
        "id": "enr_402",
        "course_title": "Solar PV Installer - PMKVY 4.0",
        "center_name": "PMKK Skill Hub Varanasi",
        "progress_percent": 35,
        "status": "in_training"
      }
    ]
  }
  ```

### 7.2 Submit Application or Enrollment
- **Method:** `POST`
- **Path:** `/api/applications`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "item_id": "SGJ/Q0101",
    "type": "course",
    "title": "Solar PV Installer",
    "organization": "Skill India Digital PMKK",
    "center_location": "Varanasi"
  }
  ```
- **Response:** `201 Created`

---

## 8. Career Roadmap & Skill Gap Endpoints

### 8.1 Get Progressive Step-by-Step Roadmap
- **Method:** `GET`
- **Path:** `/api/roadmap`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  ```json
  {
    "current_level": "Uncertified Tradesperson",
    "target_role": "Solar PV System Specialist",
    "steps": [
      {
        "step_number": 1,
        "action": "RPL Assessment for Basic Electrical Work",
        "duration": "1 week",
        "outcome": "NSQF Level 3 Certification"
      },
      {
        "step_number": 2,
        "action": "Suryamitra 300-hour Bridge Training",
        "duration": "2 months",
        "outcome": "NSQF Level 4 Qualification Pack"
      },
      {
        "step_number": 3,
        "action": "PM-AJAY GIA Toolkit Subsidy Application",
        "duration": "3 weeks",
        "outcome": "₹50,000 Equipment Kit & Enterprise Linkage"
      }
    ]
  }
  ```

### 8.2 Analyze Skill Gaps for Specific Role
- **Method:** `GET`
- **Path:** `/api/roadmap/gaps?target_role=SGJ/Q0101`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` with possessed skills vs missing competencies.

---

## 9. System Health & Government Source Status

### 9.1 Core System Health
- **Method:** `GET`
- **Path:** `/api/health`
- **Response:** `200 OK`
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-09-26T01:30:00.000Z",
    "uptime_seconds": 3600,
    "database": "connected"
  }
  ```

### 9.2 Upstream Government Integration Health
- **Method:** `GET`
- **Path:** `/api/health/dependencies`
- **Response:** `200 OK`
  ```json
  {
    "status": "healthy",
    "adapters": {
      "SkillIndiaAdapter": { "status": "healthy", "mode": "cached_verified_catalog", "total_records": 105 },
      "NSDCAdapter": { "status": "healthy", "mode": "qp_nos_registry", "total_qps": 48 },
      "PMAJAYAdapter": { "status": "healthy", "mode": "guidelines_and_subsidies", "subsidies_active": true },
      "DGTAdapter": { "status": "healthy", "mode": "cts_trades", "total_trades": 62 }
    }
  }
  ```
