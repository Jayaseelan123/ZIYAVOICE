# 🔐 LOGIN & AUTH URL CONFIGURATION

## 📍 **URLs to Update for Login/Authentication**

When your frontend URL changes, you need to update these authentication-related URLs:

---

## 1️⃣ **CORS Configuration (Already Updated ✅)**

**File:** `server/server.js` (Line 161)

```javascript
const FRONTEND_URL = "https://ziyavoice1.netlify.app";  // ✅ Already updated
```

This controls which frontend domains can make API requests to your backend.

---

## 2️⃣ **Google OAuth Callback URL**

**File:** `server/config/googleAuth.js` (Line 15)

```javascript
callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
```

### **How to Configure:**

**Option A: Using Environment Variable (Recommended)**

Add to your `.env` file (or Railway environment variables):

```env
GOOGLE_CALLBACK_URL=https://ziyavoice-production-1854.up.railway.app/api/auth/google/callback
```

**Option B: Hardcode in Config**

Edit `server/config/googleAuth.js` line 15:

```javascript
callbackURL: 'https://your-backend-url.railway.app/api/auth/google/callback'
```

### **⚠️ Important:**
This URL must also be added to your **Google Cloud Console**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   ```
   https://ziyavoice-production-1854.up.railway.app/api/auth/google/callback
   ```

---

## 3️⃣ **Google OAuth Client Credentials**

**File:** `.env` (or Railway environment variables)

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.railway.app/api/auth/google/callback
```

These are configured in `server/config/googleAuth.js` (lines 13-15).

---

## 📋 **Complete Login URL Checklist**

When deploying or changing URLs, update:

### **Backend:**
- [ ] `server/server.js` line 161: `FRONTEND_URL`
- [ ] `.env`: `GOOGLE_CALLBACK_URL` (or set in Railway)
- [ ] `.env`: `GOOGLE_CLIENT_ID` (from Google Cloud Console)
- [ ] `.env`: `GOOGLE_CLIENT_SECRET` (from Google Cloud Console)

### **Frontend:**
- [ ] `src/utils/api.ts` line 6: Backend API URL

### **Google Cloud Console:**
- [ ] Add authorized redirect URI: `https://your-backend.railway.app/api/auth/google/callback`
- [ ] Add authorized JavaScript origin: `https://your-frontend.netlify.app`

---

## 🔄 **Current Configuration**

### **Frontend:**
```
URL: https://ziyavoice1.netlify.app
Backend API: https://ziyavoice-production-1854.up.railway.app
```

### **Backend:**
```
URL: https://ziyavoice-production-1854.up.railway.app
Allowed Frontend: https://ziyavoice1.netlify.app
Google Callback: https://ziyavoice-production-1854.up.railway.app/api/auth/google/callback
```

---

## 🚨 **Common Issues**

### **"Redirect URI Mismatch" Error:**
- Make sure the callback URL in your code matches exactly what's in Google Cloud Console
- Check that you're using HTTPS (not HTTP) in production
- Verify the domain is correct (no typos)

### **CORS Errors:**
- Update `FRONTEND_URL` in `server/server.js`
- Restart your backend server
- Clear browser cache

### **Login Redirects to Wrong URL:**
- Check `GOOGLE_CALLBACK_URL` environment variable
- Verify Google Cloud Console redirect URIs
- Ensure backend URL is correct

---

## 📝 **Quick Reference**

| Component | File | Line | Current Value |
|-----------|------|------|---------------|
| Frontend URL (CORS) | `server/server.js` | 161 | `https://ziyavoice1.netlify.app` |
| Backend URL | `src/utils/api.ts` | 6 | `https://ziyavoice-production-1854.up.railway.app` |
| Google Callback | `.env` or `googleAuth.js` | 15 | Set via `GOOGLE_CALLBACK_URL` |
