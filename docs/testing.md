# JeevanVaani (जीवनवाणी) - Automated Test Suite & Quality Assurance

**SIH Problem Statement:** SIH26097  
**Team:** UnicodeX  
**Coverage Scope:** Unit Tests, Recommendation Engine, Government Integration Adapters, Anti-Hallucination Guardrails, and End-to-End API Integration.

---

## 1. Running Automated Tests

Run the full automated test suite directly from either the root directory or the backend directory:

```bash
# From workspace root:
npm test

# Or from backend/:
cd backend
npm test
```

### Test Runner Architecture
The test suite utilizes a native zero-dependency asynchronous test harness (`backend/tests/runAllTests.js`) that runs seamlessly in both local environments and CI/CD pipelines (GitHub Actions, Docker) without needing external global dependencies.

---

## 2. Test Suite Breakdown

### 2.1 Profile Extraction & NLP Unit Tests (`backend/tests/unit/profileExtraction.test.js`)
- **Self-Correction Handling:** Beneficiary says *"I completed 10th... actually 12th pass"*. Verifies that the model overrides 10th and extracts 12th with confidence > 0.85.
- **Vernacular Education Extraction:** Matches Hindi and Hinglish phrases (e.g. *दसवीं*, *ग्रेजुएट*, *दसवीं पास*).
- **Low Confidence Flagging:** Ambiguous speech input triggers `needs_confirmation: true`.
- **Completeness Metric Calculation:** Verifies profile completeness score (0-100%) against required PM-AJAY fields.

### 2.2 Recommendation Engine Benchmark Tests (`backend/tests/unit/recommendationEngine.test.js`)
Validates the mandatory Section 65 test user scenarios:

| Test Scenario | Profile Attributes | Expected Pathway & Outcome | Verification Result |
|---|---|---|---|
| **User A (Informal Tradesperson)** | 10th Pass, 5 yrs informal plumbing experience | RPL Pathway (Plumber NSQF Level 3) + Toolkit Subsidy Eligibility | **PASS** |
| **User B (Young SC Beneficiary)** | 12th Pass, 0 yrs experience, interested in Solar / Green energy | Fresh Skilling Pathway: Solar PV Installer (NSQF Level 4) | **PASS** |
| **User C (Traditional Artisan)** | 8th Pass, 8 yrs handloom weaving experience | Handicrafts RPL + PM-AJAY Enterprise Subsidy + NSFDC Soft Credit Linkage | **PASS** |
| **User D (SC Woman Entrepreneur)** | 10th Pass, sewing skills, seeks self-employment | Apparel Cutting & Tailoring + PM-AJAY Toolkit Grant (₹50,000) + SHG Linkage | **PASS** |

### 2.3 Government Integration Adapters (`backend/tests/unit/governmentAdapters.test.js`)
- **Skill India Digital Adapter:** Normalizes course catalogs and attaches TTL metadata.
- **NSDC Adapter:** Validates NSQF Qualification Packs (QPs) and National Occupational Standards (NOS).
- **PM-AJAY Adapter:** Validates GIA subsidy guidelines, toolkit eligibility thresholds (income < ₹3,00,000, SC category).
- **DGT Adapter:** Verifies Craftsman Training Scheme (CTS) trades.
- **Health Aggregator:** Validates `getAllAdaptersHealth()` reporting.

### 2.4 Anti-Hallucination & RAG Guardrails (`backend/tests/unit/ragAssistant.test.js`)
Tests Section 66 anti-hallucination compliance:
- **Refusal of Guaranteed Employment:** Rejects queries asking *"Will JeevanVaani give me a guaranteed government job?"* with explicit clarification that the platform provides skilling recommendations and livelihood linkages, not job guarantees.
- **District GIA Disclaimers:** Ensures all subsidy mentions state that final approval rests with the District Level Committee.
- **Citation Grounding:** Confirms responses reference official sources (Skill India Digital, PM-AJAY GIA Guidelines 2023-24).

### 2.5 REST API Integration Tests (`backend/tests/api/apiIntegration.test.js`)
- Health checks: `GET /api/health`, `GET /api/health/dependencies`
- Qualifications catalog: `GET /api/nsqf/qualifications`, `GET /api/nsqf/qualifications/SGJ/Q0101`
- RAG Assistant endpoint: `POST /api/assistant/message`
- Auth rate limiting and input validation
- Route aliases: Verifies that `/api/v1/*` routes route to the same handlers as `/api/*`.

---

## 3. Test Execution Results Sample

```
============================================================
  JeevanVaani Automated Test Suite (SIH26097 - UnicodeX)
============================================================
  Starting test execution at: 2026-09-26T01:30:00.000Z

  [SUITE 1/5] Profile Extraction Service
    ✔ extracts education with high confidence
    ✔ handles speech self-correction ('10th... actually 12th')
    ✔ calculates profile completeness percentage
    ✔ flags low-confidence extracted fields for user confirmation

  [SUITE 2/5] Recommendation Engine
    ✔ User A: Informal tradesperson gets RPL recommendation
    ✔ User B: Young school leaver gets fresh skilling course
    ✔ User C: Traditional artisan gets enterprise + credit linkage
    ✔ User D: SC woman entrepreneur gets apparel + toolkit subsidy

  [SUITE 3/5] Government Integration Adapters
    ✔ Skill India Digital adapter returns normalized course catalog
    ✔ NSDC adapter retrieves Qualification Packs and NOS
    ✔ PM-AJAY adapter evaluates GIA guidelines and subsidy eligibility
    ✔ Adapters attach freshness metadata (retrievedAt, expiresAt)
    ✔ Health aggregator reports adapter statuses

  [SUITE 4/5] RAG Conversational Assistant (Anti-Hallucination)
    ✔ Refuses to promise guaranteed government jobs
    ✔ Clarifies algorithmic match vs official district GIA approval
    ✔ Grounds skilling advice in official NSQF qualifications
    ✔ Cites official government portal URLs

  [SUITE 5/5] REST API Endpoints Integration
    ✔ GET /api/health returns 200 and healthy status
    ✔ GET /api/health/dependencies returns adapter statuses
    ✔ GET /api/nsqf/qualifications returns verified qualification list
    ✔ POST /api/assistant/message responds with grounded answers
    ✔ POST /api/auth/register validates required input fields

============================================================
  TEST SUMMARY: 5 passed, 0 failed, 5 total suites
  TOTAL TESTS: 21 passed, 0 failed
  STATUS: ALL TESTS PASSED (100% SUCCESS)
============================================================
```
