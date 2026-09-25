# JeevanVaani (जीवनवाणी) - Deployment & Operations Guide

**SIH Problem Statement:** SIH26097  
**Team:** UnicodeX  
**Stack:** React 19 (Vite), Node.js (Express), MongoDB / PostgreSQL / SQLite, Docker  

---

## 1. Quick Start: Local Production Mode

To run JeevanVaani locally in production mode without external services:

```bash
# 1. Clone repository
git clone https://github.com/adityapandey97/JeevanVani.git
cd JeevanVani

# 2. Install all dependencies
npm run install:all

# 3. Build frontend
npm run build

# 4. Start backend (defaults to zero-config SQLite if MongoDB/Postgres are not set)
cd backend
npm start
```

Open `http://localhost:5000` in your web browser.

---

## 2. Docker & Containerized Deployment

Using `docker-compose` to run the entire stack with frontend reverse proxy and Redis cache:

```bash
# Build and start all containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Verify service health
curl http://localhost:5000/api/health
curl http://localhost:5000/api/health/dependencies
```

Services exposed:
- **Frontend (Nginx):** `http://localhost:80`
- **Backend API:** `http://localhost:5000`
- **Redis Cache:** `localhost:6379`

---

## 3. Cloud Deployment: Render / Railway (Backend) & Vercel (Frontend)

### 3.1 Backend Deployment (Render or Railway)
1. **Create Web Service:** Connect your GitHub repository.
2. **Root Directory:** `backend`
3. **Build Command:** `npm ci`
4. **Start Command:** `node src/server.js`
5. **Environment Variables:**
   ```ini
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<generate_a_random_64_character_string>
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jeevanvani?retryWrites=true&w=majority
   # Optional:
   REDIS_HOST=<redis_host>
   REDIS_PORT=6379
   REDIS_PASSWORD=<redis_password>
   ```
6. **Health Check Path:** `/api/health`

### 3.2 Frontend Deployment (Vercel)
1. **Import Git Repository:** Select the `JeevanVani` repository.
2. **Root Directory:** `frontend`
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables:**
   ```ini
   VITE_API_BASE_URL=https://<your-render-backend-url>.onrender.com/api
   ```
7. **SPA Rewrites (`vercel.json`):**
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 4. Database Configuration Strategies

JeevanVaani is architected with a resilient **Triple-Engine Database Fallback**:

1. **MongoDB Atlas (Recommended for cloud):**
   - Provide `MONGODB_URI`. Mongoose connects seamlessly with connection pooling.
2. **PostgreSQL (Optional Enterprise / Relational):**
   - Provide `DATABASE_URL` or `PGHOST`, `PGUSER`, `PGPASSWORD`. Relational schema migrations apply automatically.
3. **Zero-Config SQLite (Embedded Local / Development):**
   - If neither MongoDB nor Postgres is configured, the system automatically writes to `backend/jeevanvani.sqlite` without requiring any external database server.

---

## 5. Security Checklist Before Going Live

- [x] Change `JWT_SECRET` to a high-entropy secret (at least 32 characters).
- [x] Ensure `NODE_ENV=production` is set so detailed stack traces are suppressed from error payloads.
- [x] Ensure rate limiters are active on `/api/auth/*` (configured to 5 requests per 15-minute window for login).
- [x] Verify CORS configuration restricts origins to authorized client domains.
- [x] Check that `.env` files are not checked into Git (verified by root and nested `.gitignore`).
- [x] Anti-hallucination guardrails active in conversational assistant.
