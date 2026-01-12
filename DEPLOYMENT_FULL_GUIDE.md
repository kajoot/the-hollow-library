# 🚀 COMPLETE DEPLOYMENT GUIDE - The Hollow Library

## ✅ What's Ready to Deploy

Your project is fully configured for production deployment on 3 free platforms:

| Component | Framework | Platform | Status |
|-----------|-----------|----------|--------|
| **Frontend** | Next.js 16 + React 19 | Vercel | ✅ Ready |
| **Backend** | Express.js 5 + Node.js | Render | ✅ Ready |
| **AI Service** | Flask + Python 3.12 | Railway | ✅ Ready |
| **Database** | MongoDB Atlas | MongoDB Cloud | ✅ Free Tier |

---

## 🔑 Step 1: Create MongoDB Atlas (5 min)

This is your database - both Backend and AI need this connection.

### Steps:
1. Go to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. Click **Sign Up** with email
3. Create a **M0 (Free Forever) Cluster**
   - Region: **Frankfurt** (closest to you in Germany)
   - Provider: AWS
4. Create a database user:
   - Username: `hollow_user`
   - Password: **Generate and save this password!**
   - Permissions: **Read and write to any database**
5. Add your IP to whitelist:
   - Click **Network Access** → **Add IP Address**
   - Enter `0.0.0.0/0` (allows access from anywhere - needed for free tier)
6. Go to **Databases** → Your cluster → **Connect** → **Drivers**
   - Copy the connection string:
   ```
   mongodb+srv://hollow_user:PASSWORD@cluster0.xxxxx.mongodb.net/the-hollow-library?retryWrites=true&w=majority
   ```
   - **Replace PASSWORD with your actual password**

### 💾 Save:
```
MONGODB_URI=mongodb+srv://hollow_user:[YOUR_PASSWORD]@cluster0.xxxxx.mongodb.net/the-hollow-library?retryWrites=true&w=majority
```

---

## 🔧 Step 2: Deploy Backend to Render (10 min)

### Steps:
1. Go to **[Render.com](https://render.com)**
2. Click **Sign Up** → Connect with **GitHub**
3. Click **New** → **Web Service**
4. Select **Connect a repository**
   - Choose: `kajoot/the-hollow-library`
5. Configure deployment:
   - **Name**: `hollow-library-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

6. Click **Environment** and add these variables:
   ```
   MONGODB_URI = mongodb+srv://hollow_user:PASSWORD@cluster.mongodb.net/the-hollow-library?retryWrites=true&w=majority
   JWT_SECRET = generate-a-random-string-here-min-32-chars
   JWT_REFRESH_SECRET = generate-another-random-string-here
   NODE_ENV = production
   PORT = 8000
   AI_SERVICE_URL = (You'll update this after Railway deploys)
   CORS_ORIGIN = (You'll update this after Vercel deploys)
   ```

7. Click **Deploy** (wait 5-10 minutes)
8. When done, copy your **Render URL** (e.g., `https://hollow-library-backend.onrender.com`)

### 💾 Save:
```
BACKEND_URL=https://hollow-library-backend.onrender.com
```

---

## 🤖 Step 3: Deploy AI Service to Railway (10 min)

### Steps:
1. Go to **[Railway.app](https://railway.app)**
2. Click **Start New Project**
3. Select **Deploy from GitHub Repo**
4. Connect GitHub → Select your account → `kajoot/the-hollow-library`
5. Configure:
   - **Root Directory**: `ai`
   - Click **Environment** and add:
     ```
     FLASK_ENV = production
     PORT = 5000
     ```

6. Railway will auto-detect Python from `requirements.txt`
7. Click **Deploy** (wait 5-10 minutes)
8. When done, go to **Deployments** → Select your deployment → Copy URL
   - Format: `https://hollow-lib-ai.railway.app`

### 💾 Save:
```
AI_URL=https://hollow-lib-ai.railway.app
```

---

## 🎨 Step 4: Deploy Frontend to Vercel (5 min)

### Steps:
1. Go to **[Vercel.com](https://vercel.com)**
2. Click **Add New...** → **Project**
3. Click **Import Git Repository**
4. Select your GitHub account → `kajoot/the-hollow-library`
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (root, leave default)
   
6. Click **Environment Variables** and add:
   ```
   NEXT_PUBLIC_API_URL = https://hollow-library-backend.onrender.com
   ```
   (Use your Render backend URL from Step 2)

7. Click **Deploy** (wait 2-5 minutes)
8. Your frontend is now live! Copy the **Vercel URL**
   - Format: `https://hollow-library.vercel.app`

### 💾 Save:
```
FRONTEND_URL=https://hollow-library.vercel.app
```

---

## 🔗 Step 5: Connect All Services (3 min)

Now that all services are deployed, you need to update environment variables so they can talk to each other.

### Update Backend on Render:
1. Go to Render dashboard
2. Select `hollow-library-backend`
3. Go to **Environment**
4. Update/add these variables:
   ```
   AI_SERVICE_URL = https://hollow-lib-ai.railway.app
   CORS_ORIGIN = https://hollow-library.vercel.app
   ```
5. Click **Save** (service will redeploy automatically)

### That's it! All services are now connected. ✅

---

## 🧪 Step 6: Test Your Live Deployment (5 min)

1. Open your **Vercel Frontend URL** in browser
   ```
   https://hollow-library.vercel.app
   ```

2. Create a new account:
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: anything secure
   - Select a Hogwarts house

3. Navigate to **Message Board**

4. Test toxicity detection by posting:
   - **Bad message**: "This is crap" or "That sucks"
     - Expected: ❌ Flagged as toxic, won't post
   - **Good message**: "This is amazing" or "Well done!"
     - Expected: ✅ Posts normally

5. If both work, your deployment is successful! 🎉

---

## 📊 Production URLs Summary

| Service | URL | Access |
|---------|-----|--------|
| **Frontend** | `https://hollow-library.vercel.app` | 🌍 Public |
| **Backend API** | `https://hollow-library-backend.onrender.com` | 🔒 Internal |
| **AI Service** | `https://hollow-lib-ai.railway.app` | 🔒 Internal |
| **Database** | MongoDB Atlas | 🔒 Secure |

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Render & Railway**: Services sleep after 15 min of inactivity
  - First request after sleep takes ~30 seconds (cold start)
  - Upgrade to paid tier ($7/month) if you need instant response
- **Vercel**: Always active, no cold starts
- **MongoDB Atlas**: Free tier has 512MB storage (plenty for testing)

### Security:
- ✅ JWT tokens stored in localStorage (secure for this use)
- ✅ Passwords hashed with bcryptjs
- ✅ MongoDB requires credentials
- ⚠️ Never commit `.env` files to GitHub (they're in .gitignore)

### Monitoring:
- Render dashboard: Check logs if backend fails
- Railway dashboard: Check logs if AI service fails
- Vercel dashboard: Check deployment history
- MongoDB Atlas: Monitor data usage

---

## 🆘 Troubleshooting

### "Message won't post but no error"
→ Backend might be sleeping (Render free tier). Wait 30 sec for cold start.

### "Toxicity detection not working"
→ AI service is sleeping or AI_SERVICE_URL is wrong in Render environment variables

### "Can't login"
→ MongoDB connection failing. Check:
1. MongoDB Atlas connection string in Render env vars
2. IP whitelist includes 0.0.0.0/0
3. Database user credentials are correct

### "API returning CORS errors"
→ Update CORS_ORIGIN in Render backend with correct Vercel URL

### Service logs:
- **Render**: Backend → Logs tab
- **Railway**: Deployments → Service → Logs
- **Vercel**: Deployments → View Deployment → Functions or Logs

---

## 📈 Next Steps (Optional)

### Upgrade to paid tiers:
- **Render**: $7/month Pro tier (no cold starts)
- **Railway**: $5/month (no free tier after $5 credits)
- **Vercel**: Free tier is unlimited

### Add custom domain:
- Vercel, Render, and Railway all support custom domains
- Connect your domain in their dashboard

### Database backups:
- MongoDB Atlas auto-backs up (free tier)
- Download snapshots from MongoDB dashboard

### Environment variables:
- All sensitive data should be in environment variables
- Never commit `.env` files

---

## ✨ You're Done!

Your full-stack application is now live and ready for your professor to test!

**Share this URL**: `https://hollow-library.vercel.app`

All code is on GitHub: `github.com/kajoot/the-hollow-library`

Happy deploying! 🚀
