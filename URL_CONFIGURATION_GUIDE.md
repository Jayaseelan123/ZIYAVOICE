# 🔄 CENTRALIZED URL CONFIGURATION GUIDE

## 📍 **Single Source of Truth for URLs**

All URLs are now centralized! Change them in ONE place only.

---

## **Frontend URLs**

### **Backend API URL**
**File:** `src/utils/api.ts` (Line 6)

```typescript
export const getApiBaseUrl = () => {
  return "https://ziyavoice-production-1854.up.railway.app";
  //      ↑ Change this to update backend URL everywhere in frontend
};
```

**Used by:** All frontend API calls (auth, agents, campaigns, calls, etc.)

---

## **Backend URLs**

### **1. Frontend URL (for CORS)**
**File:** `server/server.js` (Line 161)

```javascript
const FRONTEND_URL = "https://ziyavoice1.netlify.app";
//                    ↑ Change this when frontend URL changes
```

**Used by:** CORS configuration to allow frontend requests

### **2. Backend URL (for Twilio callbacks)**
**File:** `server/config/backendUrl.js` (Line 7)

```javascript
const getBackendUrl = () => {
  return process.env.BASE_URL || 'https://ziyavoice-production-1854.up.railway.app';
  //                              ↑ Change this when backend URL changes
};
```

**Used by:** Campaign service for Twilio webhook URLs

**Alternative:** Set `BASE_URL` environment variable in Railway

---

## 🎯 **Quick Reference Table**

| What | File | Line | Current Value |
|------|------|------|---------------|
| **Frontend → Backend** | `src/utils/api.ts` | 6 | `https://ziyavoice-production-1854.up.railway.app` |
| **Backend → Frontend (CORS)** | `server/server.js` | 161 | `https://ziyavoice1.netlify.app` |
| **Backend Self-URL** | `server/config/backendUrl.js` | 7 | `https://ziyavoice-production-1854.up.railway.app` |
| **Google OAuth Callback** | `.env` or Railway | - | Set `GOOGLE_CALLBACK_URL` |

---

## 📝 **When to Update What**

### **Scenario 1: Frontend URL Changes**
✅ Update `server/server.js` line 161 (CORS)  
✅ Update Google Cloud Console (OAuth redirect URIs)

### **Scenario 2: Backend URL Changes**
✅ Update `src/utils/api.ts` line 6 (Frontend)  
✅ Update `server/config/backendUrl.js` line 7 (Backend)  
✅ Update `.env` or Railway: `BASE_URL`  
✅ Update `.env` or Railway: `GOOGLE_CALLBACK_URL`  
✅ Rebuild frontend: `npm run build`

### **Scenario 3: Both URLs Change**
✅ Do all of the above

---

## 🚀 **Deployment Checklist**

### **Frontend Deployment (Netlify)**
- [ ] Update `src/utils/api.ts` with correct backend URL
- [ ] Run `npm run build`
- [ ] Deploy `dist` folder to Netlify
- [ ] Note the new Netlify URL

### **Backend Deployment (Railway)**
- [ ] Update `server/server.js` with correct frontend URL
- [ ] Update `server/config/backendUrl.js` with correct backend URL
- [ ] Set environment variables in Railway:
  - `BASE_URL=https://your-backend.railway.app`
  - `GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/auth/google/callback`
- [ ] Deploy to Railway
- [ ] Note the new Railway URL

### **Google Cloud Console**
- [ ] Update Authorized JavaScript origins: `https://your-frontend.netlify.app`
- [ ] Update Authorized redirect URIs: `https://your-backend.railway.app/api/auth/google/callback`

---

## ⚡ **Environment Variables**

Add these to your `.env` file or Railway environment:

```env
# Backend URL (for Twilio callbacks)
BASE_URL=https://ziyavoice-production-1854.up.railway.app

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://ziyavoice-production-1854.up.railway.app/api/auth/google/callback
```

---

## ✅ **Benefits of Centralization**

✅ **Single Point of Change** - Update URL in one place  
✅ **Environment-Aware** - Use environment variables for different deployments  
✅ **Type-Safe** - TypeScript/JavaScript ensures correct usage  
✅ **Consistent** - All parts of the app use the same URL  
✅ **Easy Debugging** - Know exactly where to look when URLs are wrong

---

## 🔍 **Files That Use These URLs**

### **Frontend (via `getApiBaseUrl()`)**
- `src/services/agentService.ts`
- `src/services/authService.ts`
- `src/services/callService.ts`
- `src/services/campaignService.ts` (via `src/utils/api.ts`)
- `src/services/documentService.ts`
- `src/services/phoneNumberService.ts`
- `src/services/twilioBasicService.ts`
- `src/services/twilioNumberService.ts`
- `src/utils/adminApi.ts`
- `src/pages/CampaignsPage.tsx`
- `src/pages/CreditsPage.tsx`
- `src/components/Sidebar.tsx`

### **Backend (via `getBackendUrl()`)**
- `server/services/campaignService.js` (Twilio callbacks)

### **Backend (CORS)**
- `server/server.js` (FRONTEND_URL constant)

---

**Now all your URLs are centralized and easy to manage!** 🎉
