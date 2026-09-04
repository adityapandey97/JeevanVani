# JeevanVani (जीवनवाणी)
## AI-Driven Voice Assistant for Livelihood Mapping & NSQF-Aligned Skilling Recommendations
### Specialized for Scheduled Caste (SC) Beneficiaries under the Grant-in-Aid (GIA) component of PM-AJAY

---

## 🏛️ Project Overview

**JeevanVani** is a full-stack, multilingual, voice-first web platform developed for the **Ministry of Social Justice and Empowerment, Government of India**. It empowers Scheduled Caste (SC) youth, artisans, and women to discover certified vocational skilling pathways benchmarked against the **National Skills Qualification Framework (NSQF)** under the **PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana)** Grant-in-Aid (GIA) component.

The platform provides a conversational AI voice counselor in **Hindi** and **English**, asks 11 guided questions to assess the beneficiary's education, employment status, prior work, existing skills, and interests, progressively extracts a structured profile, and matches it through a transparent, explainable **5-factor deterministic recommendation engine**.

---

## ✨ Key Features

1. **Voice-First & Multilingual Interaction**:
   - Web Speech API integration (`SpeechRecognition` & `webkitSpeechRecognition`) for hands-free voice input.
   - Text-to-speech audio playback (`SpeechSynthesis`) for both **Hindi** (`hi-IN`) and **English** (`en-IN`).
   - Animated audio waveform visualizer and large accessible microphone button.
   - Live Hindi/English language toggle across the entire application.

2. **11-Step Conversational AI Counseling Assessment**:
   - Collects: Age, Education, Employment Status, Work Experience, Skills, Interests, Preferred Sector, Job Preference (Job / Self-Employment / Both), Preferred Location, Willingness to Relocate, and Preferred Language.
   - Progressive saving: updates the beneficiary profile in the database after every answer.
   - Quick-reply chips for low-literacy users alongside full voice and text inputs.

3. **Transparent 5-Factor Recommendation Engine**:
   $$\text{Final Score} = (0.30 \times \text{Interest}) + (0.25 \times \text{Skill}) + (0.20 \times \text{Eligibility}) + (0.15 \times \text{Experience}) + (0.10 \times \text{Location})$$
   - Computes exact match score, reasons why recommended, matched skills, and identified **Skill Gaps** (skills to learn).
   - Recommends the Top 3 NSQF pathways.

4. **Multi-Tier Visual Career Ladder (`/career-path`)**:
   - Progressive stages from Trainee / Helper $\rightarrow$ Certified Technician $\rightarrow$ Senior Specialist $\rightarrow$ Supervisor $\rightarrow$ Self-Employed Enterprise Owner.
   - Shows expected monthly wage ranges and experience requirements at each stage.
   - Links to PM-AJAY GIA tool-kit subsidies and NSFDC / PMMY Mudra credit linkages.

5. **Beneficiary & State Admin Portals**:
   - **Beneficiary Dashboard**: Profile completion ring, identified skills, top recommendation card, skill gap breakdown, and assessment restart option.
   - **State Admin Portal**: Executive KPIs, sector demand distributions, education analytics, beneficiary registry, and complete NSQF Job Role CRUD management.

6. **Zero-Configuration Database Engine**:
   - Built for **PostgreSQL** with schema prepared for future `pgvector` semantic search.
   - Includes automatic, seamless fallback to embedded **SQLite** so the application runs immediately without requiring local PostgreSQL setup or manual database installation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React, Web Speech API |
| **Backend** | Node.js (v22+), Express.js (ES Modules), JWT Authentication, bcryptjs, Multer |
| **Database** | PostgreSQL (`pg` pool) with automatic zero-config fallback to SQLite (`better-sqlite3`) |
| **Styling** | Government / Social-Impact design system (Ashoka Navy `#0A2540`, Saffron/Marigold `#F59E0B`, Emerald `#10B981`) |

---

## 📂 Project Structure

```
jeevanVani/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                     # Unified PostgreSQL / SQLite auto-fallback connector
│   │   │   └── schema.sql                # PostgreSQL DDL schema (pgvector ready)
│   │   ├── controllers/
│   │   │   ├── authController.js         # Register, Login, Me
│   │   │   ├── assessmentController.js   # 11-step assessment handler & progressive updates
│   │   │   ├── profileController.js      # Livelihood profile & skills
│   │   │   ├── recommendationController.js # 5-factor scoring engine dispatch
│   │   │   ├── jobRoleController.js      # NSQF job role catalog
│   │   │   └── adminController.js        # Admin metrics, analytics & role CRUD
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js         # JWT verification & admin guard
│   │   │   └── errorMiddleware.js        # Centralized error handler
│   │   ├── services/
│   │   │   ├── aiService.js              # Conversational questions & acknowledgements
│   │   │   ├── voiceService.js           # Audio handling & speech config
│   │   │   ├── profileExtractionService.js # Natural language entity extraction
│   │   │   └── recommendationService.js  # Deterministic 5-factor scoring engine
│   │   ├── data/
│   │   │   └── seedData.js               # 11 NSQF job roles, 37 skills, demo accounts
│   │   ├── utils/
│   │   │   └── seedRunner.js             # Seed execution utility
│   │   └── server.js                     # Express server entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/                   # Navbar, Footer, AudioWaveform, ProtectedRoute
    │   │   ├── VoiceAssistant/           # VoiceControls, TextToSpeechPlayer
    │   │   ├── Chat/                     # AssessmentChat, ProgressBar
    │   │   ├── Recommendation/           # RecommendationCard, SkillGapList
    │   │   └── Dashboard/                # MetricCard, CareerTimeline
    │   ├── context/
    │   │   ├── AuthContext.jsx           # User state & JWT persistence
    │   │   └── LanguageContext.jsx       # Bilingual dictionary & SpeechSynthesis
    │   ├── pages/
    │   │   ├── LandingPage.jsx           # Hero, workflow & voice demo
    │   │   ├── Login.jsx                 # Quick demo credential sign-in
    │   │   ├── Register.jsx              # Beneficiary registration
    │   │   ├── Assessment.jsx            # Conversational voice counselor
    │   │   ├── Recommendations.jsx       # Top 3 NSQF recommendation cards
    │   │   ├── CareerPath.jsx            # Multi-stage career progression ladder
    │   │   ├── Dashboard.jsx             # Beneficiary dashboard
    │   │   └── AdminDashboard.jsx        # Admin metrics & NSQF catalog CRUD
    │   ├── services/                     # Axios API clients
    │   ├── App.jsx                       # Routes configuration
    │   └── main.jsx
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or higher (v22+ tested)
- **NPM**: v9 or higher

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # (Optional: seeds automatically on first server start)
npm run dev      # Starts backend on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

Open your browser at: **`http://localhost:5173/`**

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email / Username | Password | Access / Portal |
|---|---|---|---|
| **Beneficiary** | `rahul.kumar@gmail.com` | `User@123` | Beneficiary Portal, Voice Assessment, Dashboard |
| **State Admin** | `admin@pmajay.gov.in` | `Admin@123` | State Admin Portal, Analytics, NSQF Catalog CRUD |

> 💡 **Tip**: On the `/login` page, you can simply click the **"Beneficiary Demo"** or **"State Admin Demo"** buttons to automatically fill credentials and sign in instantly!

---

## 📊 Seeded NSQF Job Roles Catalog (11 Roles Across 10 Sectors)

1. **Assistant Electrician** (Construction & Electrical, NSQF Level 3)
2. **Solar PV Installer (Suryamitra)** (Solar / Green Jobs, NSQF Level 4)
3. **General Duty Assistant (Healthcare GDA)** (Healthcare, NSQF Level 4)
4. **Domestic Data Entry Operator (DDEO)** (IT / ITeS, NSQF Level 4)
5. **Retail Sales Associate** (Retail, NSQF Level 4)
6. **Automotive Service Technician (2 & 3 Wheeler)** (Automotive, NSQF Level 4)
7. **Mason General** (Construction, NSQF Level 3)
8. **Micro Irrigation Technician** (Agriculture, NSQF Level 4)
9. **Assistant Beauty Therapist** (Beauty & Wellness, NSQF Level 3)
10. **Field Technician - Home Appliances** (Electronics, NSQF Level 4)
11. **Handicraft Artisan & Garment Tailor** (Apparel & Handicrafts / Self-Employment, NSQF Level 4)

---

## 🛡️ License & Compliance
This project was constructed in alignment with the official **National Skills Qualification Framework (NSQF)** and the guidelines of the **Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)** Grant-in-Aid component.
