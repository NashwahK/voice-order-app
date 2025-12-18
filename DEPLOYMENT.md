# Voice Order App (KoreaLand) - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Neon PostgreSQL database from [Neon Console](https://console.neon.tech)

## Environment Setup

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables in `.env`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Set your backend URL in `.env`

## Database Setup

Run this SQL in your Neon database console:

```sql
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    order_details JSONB NOT NULL,
    order_total DECIMAL(10, 2) NOT NULL,
    order_owner TEXT DEFAULT 'Anonymous',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Local Development

### Start Backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3001`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## Production Deployment

### Vercel (Recommended)

#### Backend Deployment
1. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `DATABASE_URL`
   - `ALLOWED_ORIGINS` (your frontend URL)

#### Frontend Deployment
1. Update `.env` with your deployed backend URL

## Post-Deployment Checklist

- Backend health check responds: `GET /api/health`
- Environment variables set correctly
- CORS configured with frontend URL
- Database connection working
- Frontend can fetch ephemeral tokens
- Voice ordering works end-to-end
- Orders save to database


## Support

For issues, check:
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Project Repository](https://github.com/NashwahK/voice-order-app)
