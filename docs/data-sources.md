# JeevanVaani (जीवनवाणी) - Government Integration & Data Sources Architecture

**SIH Problem Statement:** SIH26097  
**Component:** Government Integration Layer (Section 25-29, 36-39)  
**System:** JeevanVaani  

---

## 1. Overview & Strategy

JeevanVaani aggregates data from four official government skilling and welfare platforms:
1. **Skill India Digital (SIDH)** — Courses, PMKK training centers, certifications
2. **National Skill Development Corporation (NSDC)** — NSQF Qualification Packs (QPs), National Occupational Standards (NOS)
3. **PM-AJAY (GIA Component)** — Ministry of Social Justice & Empowerment scheme guidelines, toolkit subsidies (up to ₹50,000), NSFDC soft credit linkages
4. **Directorate General of Training (DGT)** — CTS/CATS trade apprenticeships and ITI courses

Because public government portals frequently experience downtime, latency spikes, or schema shifts, JeevanVaani implements a **Zero-Failure Stale-While-Revalidate (SWR) Integration Architecture**:
- Requests always serve from local validated snapshot caches within TTL.
- Expired entries are re-validated in the background.
- If upstream APIs are offline, stale snapshots are served alongside explicit freshness metadata flags (`freshnessStatus: "stale"`, `lastVerifiedAt`).
- The application **never crashes or returns empty responses** due to upstream outages.

---

## 2. Adapter Architecture (`backend/src/integrations/`)

All government adapters inherit from `OfficialSourceAdapter.js`, ensuring standardized logging, caching, metrics, and freshness metadata.

```
       OfficialSourceAdapter (Base Class)
       ├── TTL Caching (Redis / In-Memory Map)
       ├── Stale-While-Revalidate (SWR) Engine
       ├── Deduplication & Normalization
       └── Freshness Metadata Injector
           │
  ┌────────┼───────────────┬────────────────┐
  ▼        ▼               ▼                ▼
SkillIndia NSDC          PM-AJAY          DGT
Adapter   Adapter        Adapter          Adapter
(SIDH)    (QPs/NOS)      (GIA Subsidies)  (Trades)
```

### Freshness Metadata Schema
Every government entity served to beneficiaries or the recommendation engine includes:
```json
{
  "source": "Skill India Digital",
  "sourceUrl": "https://www.skillindiadigital.gov.in",
  "retrievedAt": "2026-09-26T01:00:00.000Z",
  "lastVerifiedAt": "2026-09-26T01:00:00.000Z",
  "expiresAt": "2026-09-27T01:00:00.000Z",
  "dataVersion": "2026.1",
  "freshnessStatus": "fresh"
}
```

---

## 3. Data Source Specifications

### 3.1 Skill India Digital Adapter (`SkillIndiaAdapter.js`)
- **Primary Source:** [skillindiadigital.gov.in](https://www.skillindiadigital.gov.in)
- **TTL:** 86,400 seconds (24 Hours)
- **Key Schemas:**
  - `course_id`: SIDH unique identifier (e.g., `SIDH_CR_001`)
  - `title`: Standardized course title
  - `sector`: Sector Skill Council alignment
  - `nsqf_level`: Official NSQF level (1 through 8)
  - `mode`: `offline`, `hybrid`, or `online`
  - `center_name`: Authorized Pradhan Mantri Kaushal Kendra (PMKK) or training provider
  - `district` & `state`: Geographic location for proximity matching

### 3.2 NSDC Qualification Pack Adapter (`NSDCAdapter.js`)
- **Primary Source:** [nsdcindia.org](https://www.nsdcindia.org)
- **TTL:** 604,800 seconds (7 Days)
- **Key Schemas:**
  - `qp_code`: Standard QP identifier (e.g., `SGJ/Q0101`, `CON/Q0601`)
  - `role_name`: Job role title
  - `sector_skill_council`: Governing SSC (e.g., Skill Council for Green Jobs, Apparel SSC)
  - `nsqf_level`: Official competency level
  - `nos_list`: Associated National Occupational Standards
  - `min_education`: Minimum educational entry criteria
  - `min_experience`: Minimum informal experience required for RPL entry

### 3.3 PM-AJAY GIA Component Adapter (`PMAJAYAdapter.js`)
- **Primary Source:** [pmajay.dosje.gov.in](https://pmajay.dosje.gov.in) (Ministry of Social Justice & Empowerment)
- **TTL:** 86,400 seconds (24 Hours)
- **Guidelines & Subsidies Encoded:**
  - **Beneficiary Target:** 100% Scheduled Caste (SC) individuals and SC-majority clusters
  - **Skill Development Component:** Free NSQF-aligned training with stipend linkage
  - **Toolkit Assistance:** Up to ₹50,000 subsidy per beneficiary post-certification
  - **Credit Linkages:** Concessional loans through National Scheduled Castes Finance and Development Corporation (NSFDC)
  - **Income Criterion:** Annual household income under ₹3,00,000 for top-tier subsidy preference
  - **Notice Requirement:** All recommendations explicitly disclose that **final selection and subsidy disbursement are subject to District Level Committee (DLC) approval**.

### 3.4 DGT Trades Adapter (`DGTAdapter.js`)
- **Primary Source:** [dgt.gov.in](https://dgt.gov.in)
- **TTL:** 604,800 seconds (7 Days)
- **Key Schemas:**
  - Craftsman Training Scheme (CTS) trades (Electrician, Fitter, Welder, Draughtsman, Sewing Technology)
  - Apprenticeship opportunities under the National Apprenticeship Promotion Scheme (NAPS)

---

## 4. Cache Management & Rate Limiting

1. **Storage Tiering:**
   - Tier 1: Redis cache (if configured via `REDIS_HOST`).
   - Tier 2: Process memory LRU cache (automatic fallback when Redis is absent).
2. **Rate Limiting:**
   - Upstream calls honor max 2 requests/sec to prevent IP blacklisting.
   - Outgoing HTTP timeouts configured at 6,000 ms with exponential backoff.

---

## 5. Fallback & Offline Resilience Testing

If all external network connections fail:
1. Adapters fall back to pre-packaged verified JSON snapshots in `backend/src/data/` or bundled schemas.
2. The health check endpoint (`GET /api/health/dependencies`) reports `"mode": "fallback_snapshot"`.
3. The recommendation engine and voice assistant continue operating uninterrupted with full RAG capability.
