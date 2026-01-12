# 🚀 DEPLOYMENT QUICK START

## Your Full-Stack Project is Ready to Deploy

### 📦 Stack
- **Frontend**: Next.js 16 + React 19 (Vercel)
- **Backend**: Express.js 5 + Node.js 20 (Render)
- **AI**: Python Flask + Hugging Face (Railway)
- **Database**: MongoDB M0 Free (MongoDB Atlas)
- **Code**: GitHub - `kajoot/the-hollow-library`

---

## ⏱️ Deployment Timeline: ~40 Minutes

| Step | Task | Time | Platform |
|------|------|------|----------|
| 1 | Create MongoDB database | 5 min | MongoDB Atlas |
| 2 | Deploy backend API | 10 min | Render |
| 3 | Deploy AI service | 10 min | Railway |
| 4 | Deploy frontend app | 5 min | Vercel |
| 5 | Connect all services | 3 min | Env vars |
| 6 | Test deployment | 5 min | Browser |
| **Total** | **Live production app!** | **38 min** | ✅ |

---

## 🎯 Quick Links

1. **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Render**: https://render.com
3. **Railway**: https://railway.app
4. **Vercel**: https://vercel.com
5. **Your GitHub**: https://github.com/kajoot/the-hollow-library

---

## 📋 MongoDB Setup (5 min)

```
1. Sign up at MongoDB Atlas
2. Create M0 (free) cluster in Frankfurt region
3. Create user: hollow_user / [strong_password]
4. Whitelist IP: 0.0.0.0/0
5. Copy connection string:
   mongodb+srv://hollow_user:PASSWORD@cluster0.xxxxx.mongodb.net/the-hollow-library?retryWrites=true&w=majority
```

---

## 🔧 Render Backend Setup (10 min)

```
1. Sign up with GitHub
2. New Web Service
3. Select: kajoot/the-hollow-library
4. Root Directory: backend
5. Runtime: Node
6. Build: npm install
7. Start: node server.js
8. Add Environment Variables:
   - MONGODB_URI=[from-mongodb]
   - JWT_SECRET=[random-string]
   - JWT_REFRESH_SECRET=[random-string]
   - NODE_ENV=production
   - AI_SERVICE_URL=[will-update-later]
9. Deploy → Wait 5-10 min
10. Copy Render URL: https://...onrender.com
```

---

## 🤖 Railway AI Setup (10 min)

```
1. Sign up with GitHub
2. New Project → Deploy from GitHub
3. Select: kajoot/the-hollow-library
4. Root Directory: ai
5. Environment: PORT=5000
6. Deploy → Wait 5-10 min
7. Copy Railway URL: https://...railway.app
```

---

## 🎨 Vercel Frontend Setup (5 min)

```
1. Sign up with GitHub
2. Add New Project
3. Import: kajoot/the-hollow-library
4. Framework: Next.js
5. Root: . (default)
6. Environment Variable:
   NEXT_PUBLIC_API_URL=[render-backend-url]
7. Deploy → Wait 2-5 min
8. Copy Vercel URL: https://...vercel.app
```

---

## 🔗 Final Integration (3 min)

Go back to **Render Backend**:
```
Update Environment:
- AI_SERVICE_URL = [railway-url]
- CORS_ORIGIN = [vercel-url]
Save → Auto-redeploy
```

---

## 🧪 Test (5 min)

1. Open: `https://[your-vercel-url].vercel.app`
2. Create account
3. Go to Message Board
4. Post: "This is crap" → Should be BLOCKED ✅
5. Post: "This is great" → Should post NORMALLY ✅

---

## 📊 Final URLs

```
🌍 Frontend (Share with professor): https://hollow-library.vercel.app
🔗 Backend API: https://hollow-library-backend.onrender.com
🤖 AI Service: https://hollow-lib-ai.railway.app
💾 Database: MongoDB Atlas (hidden)
```

---

## ⚠️ Things to Remember

- **Free tier cold starts**: Render/Railway sleep after 15 min → first request takes 30 sec
- **IP Whitelist**: Must be `0.0.0.0/0` for MongoDB free tier
- **Environment Variables**: Must be exact spelling (case-sensitive)
- **Password**: Change `JWT_SECRET` to something strong
- **Never commit `.env`**: Already in .gitignore ✅

---

## 🆘 If Something Goes Wrong

**Backend not connecting?** → Check `NEXT_PUBLIC_API_URL` in Vercel

**Toxicity detection failing?** → Check `AI_SERVICE_URL` in Render

**Can't login?** → Check MongoDB URI and IP whitelist

**CORS errors?** → Update `CORS_ORIGIN` in Render backend

---

## 📖 Full Guide

See **DEPLOYMENT_FULL_GUIDE.md** in your repo for detailed step-by-step instructions.

---

**Ready to deploy? Let's go! 🚀**

Estimated completion: **40 minutes from now your app will be live!**
