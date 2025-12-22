# ✅ ALL URLs NOW CENTRALIZED

## 🎉 **Complete Centralization Summary**

All hardcoded URLs have been replaced with centralized configuration functions!

---

## 📍 **Centralized URL Locations**

### **Frontend (Single Source)**
**File:** `src/utils/api.ts` (Line 6)

```typescript
export const getApiBaseUrl = () => {
  return "https://ziyavoice-production-1854.up.railway.app";
  //      ↑ CHANGE THIS ONE LINE TO UPDATE ALL FRONTEND API CALLS
};
```

**Used by ALL frontend files:**
- ✅ `src/services/agentService.ts`
- ✅ `src/services/authService.ts`
- ✅ `src/services/callService.ts`
- ✅ `src/services/documentService.ts`
- ✅ `src/services/googleSheetsService.ts`
- ✅ `src/services/phoneNumberService.ts`
- ✅ `src/services/twilioBasicService.ts`
- ✅ `src/services/twilioNumberService.ts`
- ✅ `src/utils/adminApi.ts`
- ✅ `src/pages/AgentDetailPage.tsx` (4 instances)
- ✅ `src/pages/AdminUserDetailPage.tsx`
- ✅ `src/pages/CampaignsPage.tsx`
- ✅ `src/pages/CreditsPage.tsx`
- ✅ `src/components/Sidebar.tsx`
- ✅ `src/constants.tsx`

---

### **Backend URLs**

#### **1. Frontend URL (CORS)**
**File:** `server/server.js` (Line 161)

```javascript
const FRONTEND_URL = "https://ziyavoice1.netlify.app";
//                    ↑ CHANGE THIS FOR CORS CONFIGURATION
```

#### **2. Backend Self-URL (Twilio Callbacks)**
**File:** `server/config/backendUrl.js` (Line 7)

```javascript
const getBackendUrl = () => {
  return process.env.BASE_URL || 'https://ziyavoice-production-1854.up.railway.app';
  //                              ↑ CHANGE THIS FOR TWILIO WEBHOOKS
};
```

**Used by:**
- ✅ `server/services/campaignService.js` (2 instances)

---

## 🔄 **How to Change URLs**

### **Scenario 1: Frontend URL Changes**
1. Update `server/server.js` line 161 (CORS)
2. Update Google Cloud Console (OAuth redirect URIs)
3. Restart backend

### **Scenario 2: Backend URL Changes**
1. Update `src/utils/api.ts` line 6 (Frontend)
2. Update `server/config/backendUrl.js` line 7 (Backend)
3. Update `.env` or Railway: `BASE_URL=https://new-backend.railway.app`
4. Update `.env` or Railway: `GOOGLE_CALLBACK_URL=https://new-backend.railway.app/api/auth/google/callback`
5. Run `npm run build` (Frontend)
6. Deploy both frontend and backend

---

## ✅ **Files Fixed in This Session**

### **Frontend:**
- ✅ `src/pages/AgentDetailPage.tsx` - Replaced 4 hardcoded URLs
- ✅ `src/constants.tsx` - Replaced 1 hardcoded URL
- ✅ `src/pages/AdminUserDetailPage.tsx` - Already fixed by user
- ✅ `src/components/Sidebar.tsx` - Already fixed by user

### **Backend:**
- ✅ `server/config/backendUrl.js` - Created new centralized config
- ✅ `server/services/campaignService.js` - Replaced 2 hardcoded URLs

---

## 📊 **Before vs After**

### **Before:**
- ❌ 15+ files with hardcoded URLs
- ❌ Multiple different URL formats
- ❌ Easy to miss updates
- ❌ Deployment errors common

### **After:**
- ✅ 3 centralized locations
- ✅ Consistent URL usage
- ✅ Single point of change
- ✅ Deployment-ready

---

## 🎯 **Quick Reference**

| What Changed | Where to Update |
|--------------|-----------------|
| **Backend API URL** | `src/utils/api.ts` line 6 |
| **Frontend URL (CORS)** | `server/server.js` line 161 |
| **Backend Self-URL** | `server/config/backendUrl.js` line 7 |

---

## 🚀 **Next Steps**

1. ✅ **Build completed** - Frontend rebuilt with centralized URLs
2. 📤 **Deploy to Netlify** - Upload the `dist` folder
3. 🔄 **Clear browser cache** - Hard refresh with `Ctrl + F5`
4. ✅ **Test registration** - Should now work correctly!

---

## 🎉 **Result**

**ALL URLs are now centralized!** You can change the backend URL in ONE place (`src/utils/api.ts`) and it will update everywhere in the frontend. Same for backend URLs!

**No more hunting through multiple files!** 🚀
