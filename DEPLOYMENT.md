# Voice Order App - Deployment Guide

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

4. Fill in your environment variables in `.env`:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key
   DATABASE_URL=your_actual_neon_database_url
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

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

4. Set your backend URL in `.env`:
   ```
   VITE_BACKEND_URL=https://your-backend-domain.com
   ```

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

### Option 1: Vercel (Recommended)

#### Backend Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to backend: `cd backend`
3. Deploy: `vercel`
4. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `DATABASE_URL`
   - `ALLOWED_ORIGINS` (your frontend URL)

#### Frontend Deployment
1. Navigate to frontend: `cd frontend`
2. Update `.env` with your deployed backend URL
3. Build: `npm run build`
4. Deploy: `vercel`

### Option 2: Other Platforms

#### Backend Options:
- Railway
- Render
- Heroku
- AWS Elastic Beanstalk

#### Frontend Options:
- Netlify
- Vercel
- Cloudflare Pages
- AWS Amplify

## Post-Deployment Checklist

- [ ] Backend health check responds: `GET /api/health`
- [ ] Environment variables set correctly
- [ ] CORS configured with frontend URL
- [ ] Database connection working
- [ ] Frontend can fetch ephemeral tokens
- [ ] Voice ordering works end-to-end
- [ ] Orders save to database

## Security Notes

- ✅ API keys are stored server-side only
- ✅ Ephemeral tokens expire after 30 minutes
- ✅ CORS restricts API access to allowed origins
- ✅ Environment files are git-ignored
- ⚠️ Consider adding rate limiting for production
- ⚠️ Consider adding authentication for order history

## Troubleshooting

### "API key not configured"
- Check `GEMINI_API_KEY` is set in backend environment

### "Database connection failed"
- Verify `DATABASE_URL` is correct in backend environment
- Ensure Neon database is running and accessible

### "CORS error"
- Add your frontend URL to `ALLOWED_ORIGINS` in backend environment
- Format: `https://your-domain.com` (no trailing slash)

### "Token generation failed"
- Ensure you're using @google/genai v1.34.0+
- Check Gemini API quota/limits

## Support

For issues, check:
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Project Repository](https://github.com/NashwahK/voice-order-app)
