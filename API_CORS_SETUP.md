# 🔌 API & CORS Configuration Guide

## المشاكل التي تم حلها

### 1️⃣ مشكلة API URL
**المشكلة**: Frontend كان يحاول يضرب `/api` بدل Railway URL الحقيقي  
**الحل**: إنشاء `.env.local` و `.env.production` مع URLs صحيحة

### 2️⃣ مشكلة CORS
**المشكلة**: `FRONTEND_URL` كان فارغ في البيئة  
**الحل**: تصحيح الـ main.ts ليتعامل مع الـ empty URLs بشكل صحيح

### 3️⃣ مشكلة Vercel Build Cache
**المشكلة**: Vercel كان بينسخ البيانات القديمة  
**الحل**: إنشاء `vercel.json` مع تحديد البيئة بوضوح

---

## 🚀 Setup Instructions

### Development (Local)

#### Backend
```bash
cd tuhfa-backend
npm install
# تأكد من أن MongoDB يعمل
npm run start:dev
```

سيعمل على: `http://localhost:3001/api`

#### Frontend
```bash
cd tuhfa-frontend
npm install
npm run dev
```

سيعمل على: `http://localhost:5173`

**ملاحظة**: الـ Vite proxy في `vite.config.ts` يعيد توجيه `/api` إلى backend تلقائياً

---

### Production (Railway + Vercel)

#### Backend (Railway)
Environment variables:
```
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=7d
ADMIN_SECRET_CODE=<admin-code>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email@gmail.com>
SMTP_PASS=<app-password>
FRONTEND_URL=https://tuhfa-by-nona.vercel.app
PORT=3001
NODE_ENV=production
```

#### Frontend (Vercel)
Environment variables:
```
VITE_API_URL=https://tuhfa-by-nona-production.up.railway.app/api
```

---

## 📁 File Structure

```
tuhfa-frontend/
├── .env.example          ← Template for all environments
├── .env.local            ← Development (use /api proxy)
├── .env.production       ← Production build (full Railway URL)
├── vercel.json           ← Vercel deployment config
└── vite.config.ts        ← Proxy configuration

tuhfa-backend/
├── .env.example          ← Template
├── .env                  ← Current environment
└── src/main.ts           ← CORS configuration
```

---

## ✅ Testing

### 1. Test Health Endpoint
```bash
curl https://tuhfa-by-nona-production.up.railway.app/api/health
```

### 2. Test Login (from browser console)
```javascript
fetch("https://tuhfa-by-nona-production.up.railway.app/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@test.com", password: "123456" })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Success Response** ✅:
- `{ "message": "بيانات الدخول غير صحيحة" }` → يعني backend + CORS شغالين

**Failure** ❌:
- CORS error → تحقق من `FRONTEND_URL` في الـ backend
- Network error → تحقق من Railway deployment
- Auth error → تحقق من credentials

---

## 🔧 Vercel Deployment

### To force rebuild (bypass cache):
```bash
vercel deploy --prod --no-cache
```

### Or from Vercel dashboard:
1. Project Settings → Deployments
2. Click "Redeploy" on latest deployment
3. Choose "Redeploy without using cache"

---

## 🧪 Development Workflow

1. **Start Backend**:
   ```bash
   cd tuhfa-backend && npm run start:dev
   ```

2. **Start Frontend**:
   ```bash
   cd tuhfa-frontend && npm run dev
   ```

3. **Open Browser**:
   ```
   http://localhost:5173
   ```

4. **Check API Connection**:
   - Open DevTools → Console
   - All `/api` calls should proxy to `http://localhost:3001/api`

---

## 🐛 Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| CORS error on Vercel | `FRONTEND_URL` mismatch | Update Railway env vars |
| Cannot reach backend | Frontend using wrong URL | Check `.env.production` |
| Old version deployed | Build cache | Use `--no-cache` flag |
| Auth always fails | Wrong MongoDB | Check Atlas connection |
| Email not sending | SMTP credentials | Verify Gmail app password |

---

## 📝 Notes

- **Development**: Uses Vite proxy (`/api` → `http://localhost:3001/api`)
- **Production**: Uses full Railway URL in environment variables
- **CORS**: Configured to accept requests from Vercel frontend + localhost:5173
- **JWT**: 7-day expiry, stored in localStorage

---

Last updated: 2024
