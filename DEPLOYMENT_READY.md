# 🚀 QUICK DEPLOYMENT SETUP

All files are ready. Follow these 4 steps:

---

## **Step 1: MongoDB Atlas (5 min)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Sign up** (or login if you have account)
3. Create **M0 Free Cluster**
4. Choose region: **Frankfurt** (closest to Germany West Central where AI is)
5. Create user:
   - Username: `hollow_user`
   - Password: `generate-strong-password`
6. Allow network access: **0.0.0.0/0** (for free tier)
7. Copy connection string from "Connect" button:
   ```
   mongodb+srv://hollow_user:PASSWORD@cluster-name.mongodb.net/the-hollow-library?retryWrites=true&w=majority
   ```
8. **Save this URL** - you'll need it for Backend!

---

## **Step 2: Deploy Backend (Render) - 10 min**

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Select **Connect a GitHub repository**
4. Choose: `kajoot/the-hollow-library`
5. Fill in:
   - **Name**: `hollow-library-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   
6. Under **Environment** tab, add these variables:
   ```
   MONGODB_URI = mongodb+srv://hollow_user:PASSWORD@cluster.mongodb.net/the-hollow-library?retryWrites=true&w=majority
   JWT_SECRET = generate-any-random-string-here
   JWT_REFRESH_SECRET = generate-another-random-string
   AI_SERVICE_URL = https://hollow-lib-ai.railway.app
   NODE_ENV = production
   ```

7. Click **Deploy** (wait 5-10 minutes)
8. Once deployed, copy your Render URL:
   - Format: `https://hollow-library-backend.onrender.com`
   - **Save this URL** - you'll need it for Frontend!

---

## **Step 3: Deploy AI Service (Railway) - 10 min**

1. Go to https://railway.app
2. Click **Start New Project**
3. Click **Deploy from GitHub Repo**
4. Select your GitHub account → `kajoot/the-hollow-library`
5. Click **Configure**:
   - **Root Directory**: `ai`
   - Add environment variable: `PORT=5000`
6. Click **Deploy**
7. Wait for deployment (~5-10 min)
8. Go to **Deployments** → Click your deployment → Copy URL
   - Format: `https://hollow-lib-ai.railway.app`
   - **Save this URL** - you'll need it for Backend!

---

## **Step 4: Deploy Frontend (Vercel) - 5 min**

1. Go to https://vercel.com
2. Click **Add New...** → **Project**
3. Select **Import Git Repository**
4. Choose: `kajoot/the-hollow-library`
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (leave default)
   - Click **Environment Variables**
   - Add one variable:
     ```
     NEXT_PUBLIC_API_URL = https://hollow-library-backend.onrender.com
     ```
     (Replace with your actual Render URL from Step 2)

6. Click **Deploy** (wait 2-5 min)
7. Once deployed, your site is live! Copy the Vercel URL
   - Format: `https://hollow-library.vercel.app`
   - **This is what you share with your professor!**

---

## **Step 5: Final Integration (2 min)**

Go back to Render backend and update the environment variables with your final URLs:

1. Go to Render dashboard
2. Select `hollow-library-backend`
3. Go to **Environment**
4. Update:
   ```
   AI_SERVICE_URL = https://hollow-lib-ai.railway.app
   ```
   (With your actual Railway URL from Step 3)

---

## **🧪 Test Your Deployment**

1. Open your **Vercel URL** in browser
2. Create a new account
3. Try posting a message with bad words:
   - Example: "This is crap"
   - Should be **flagged as NEGATIVE** ❌
   
4. Try posting a normal message:
   - Example: "This is amazing"
   - Should be **posted normally** ✅

**If tests pass, you're live!** 🎉

---

## **📋 Your Live URLs**

Once deployed, share this with your professor:

| Service | URL |
|---------|-----|
| **Main App** | `https://your-vercel-url.vercel.app` |
| Backend API | `https://hollow-library-backend.onrender.com` |
| AI Service | `https://hollow-lib-ai.railway.app` |

---

## **⚠️ Important Notes**

- **Free tier sleep**: Render/Railway may sleep after 15 min of inactivity. First request after sleep takes ~30 sec.
- **MongoDB whitelist**: Make sure you set IP to `0.0.0.0/0` in MongoDB Atlas
- **Keep URLs consistent**: All 3 services must know each other's URLs
- **Environment variables**: Double-check spelling - they're case-sensitive!
- **If something fails**: Check service logs in Render/Railway dashboard

---

**Good luck! You're ready to deploy! 🚀**

Need help? Check individual service logs in their dashboards.
