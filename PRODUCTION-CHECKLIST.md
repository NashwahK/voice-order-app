# Production Deployment Checklist

## Pre-Deployment

### Environment Variables
- [ ] Backend `.env` has real `GEMINI_API_KEY`
- [ ] Backend `.env` has real `DATABASE_URL`
- [ ] Backend `.env` has production `ALLOWED_ORIGINS`
- [ ] Frontend `.env` has production `VITE_BACKEND_URL`
- [ ] All `.env` files are git-ignored ✅

### Database
- [ ] Neon database is created
- [ ] Run `backend/schema.sql` in Neon console
- [ ] Test database connection works
- [ ] Verify indexes are created

### Code Quality
- [ ] No console.logs with sensitive data
- [ ] Error handling in place ✅
- [ ] CORS properly configured ✅
- [ ] Environment validation working ✅
- [ ] Error boundary implemented ✅

### Testing
- [ ] Backend health check responds: `curl YOUR_BACKEND/api/health`
- [ ] Token generation works
- [ ] Voice ordering end-to-end test
- [ ] Order saves to database
- [ ] Modal displays correctly
- [ ] Mobile responsive check

## Deployment

### Backend (Vercel/Railway/Render)
- [ ] Deploy backend to hosting platform
- [ ] Set environment variables in platform dashboard:
  - `GEMINI_API_KEY`
  - `DATABASE_URL`
  - `ALLOWED_ORIGINS`
  - `PORT` (if needed)
- [ ] Test health endpoint: `https://your-backend.com/api/health`
- [ ] Test token endpoint (should require POST)
- [ ] Verify logs show no errors

### Frontend (Vercel/Netlify)
- [ ] Update `VITE_BACKEND_URL` to production backend
- [ ] Run `npm run build` locally to test
- [ ] Deploy to hosting platform
- [ ] Verify build succeeds
- [ ] Check browser console for errors

### Post-Deployment
- [ ] Update `ALLOWED_ORIGINS` on backend with frontend URL
- [ ] Test complete flow:
  - [ ] Landing page loads
  - [ ] "Start Ordering" button works
  - [ ] Microphone permission granted
  - [ ] Voice connection established
  - [ ] Can order items by voice
  - [ ] Waveform animates
  - [ ] Order displays in UI
  - [ ] "Complete Order" works
  - [ ] Modal shows receipt
  - [ ] Order saved in database (check Neon console)
- [ ] Test on mobile device
- [ ] Test on different browsers (Chrome, Safari, Firefox, Edge)

## Security Review

- [ ] API keys not exposed in frontend ✅
- [ ] Ephemeral tokens expire correctly (30min) ✅
- [ ] CORS only allows your frontend domain ✅
- [ ] No sensitive data in error messages ✅
- [ ] Input validation on all endpoints ✅
- [ ] HTTPS enabled on production domains

## Performance

- [ ] Frontend build size reasonable (<500KB)
- [ ] Backend responds quickly (<200ms health check)
- [ ] Database queries optimized with indexes ✅
- [ ] Audio streaming has minimal latency
- [ ] No memory leaks (test with long session)

## Monitoring (Optional but Recommended)

- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor backend uptime
- [ ] Track API usage/costs
- [ ] Set up alerts for errors
- [ ] Log aggregation service

## Documentation

- [ ] README.md complete ✅
- [ ] DEPLOYMENT.md accurate ✅
- [ ] .env.example files present ✅
- [ ] Database schema documented ✅
- [ ] API endpoints documented

## Optional Enhancements

- [ ] Add rate limiting to token endpoint
- [ ] Implement user authentication
- [ ] Add order history view
- [ ] Create admin dashboard
- [ ] Add payment integration
- [ ] Implement WebSocket fallback
- [ ] Add analytics tracking
- [ ] SEO optimization
- [ ] PWA capabilities
- [ ] Automated testing

## Rollback Plan

If something goes wrong:

1. **Frontend issues**: Revert to previous deployment in hosting dashboard
2. **Backend issues**: Check logs, verify env vars, redeploy previous version
3. **Database issues**: Check Neon status, verify connection string
4. **API issues**: Check Gemini API status, verify quota

## Support Resources

- Vercel Logs: Dashboard → Your Project → Logs
- Neon Console: https://console.neon.tech
- Gemini API Status: https://status.cloud.google.com
- GitHub Issues: https://github.com/NashwahK/voice-order-app/issues

---

Last Updated: December 18, 2025
