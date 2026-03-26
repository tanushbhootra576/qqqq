# 🚀 Deploy Frontend to Vercel (Free)

Vercel is the easiest way to deploy your React/Vite frontend. It's free, fast, and handles everything.

---

## 📋 Prerequisites

- GitHub account (free)
- Vercel account (free) - https://vercel.com/signup
- Your project pushed to GitHub

---

## Step 1: Push Project to GitHub

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `esp32-vitals-dashboard`
3. Make it **Public** (free option)
4. Click "Create repository"

### Push Your Code

```powershell
cd d:\qqqq

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: ESP32 Vitals Dashboard"

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/esp32-vitals-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Web Interface (Easiest)

1. Go to https://vercel.com/import
2. Sign in with GitHub
3. Select your `esp32-vitals-dashboard` repository
4. Click "Import"
5. Vercel will detect it's a Vite project
6. **Important Configuration:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Click "Deploy"

**That's it!** Your frontend is live.

### Method 2: Using Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend
cd d:\qqqq\frontend

# Deploy
vercel
```

Follow the prompts and accept defaults.

---

## Step 3: Update Backend URL

Your frontend will be deployed to something like:
```
https://esp32-vitals-dashboard.vercel.app
```

But it still tries to fetch from `localhost:4000`. You need to update it to your **hosted backend URL**.

Once you deploy the backend (see DEPLOY_RENDER_BACKEND.md), update your frontend:

**File:** `frontend/src/App.jsx` (line ~21)

Change:
```javascript
const response = await fetch('http://localhost:4000/api/vitals');
```

To:
```javascript
const response = await fetch('https://your-backend-url.onrender.com/api/vitals');
```

Then redeploy:
```powershell
cd d:\qqqq
git add .
git commit -m "Update backend URL for production"
git push
```

Vercel will automatically redeploy!

---

## Step 4: Configure Environment Variables (Optional)

If you want to use environment variables:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add:
   ```
   VITE_API_URL = https://your-backend-url.onrender.com
   ```

Then update App.jsx:
```javascript
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vitals`);
```

---

## ✅ Your Frontend is Live!

After deployment, you'll get a URL like:
```
https://esp32-vitals-dashboard.vercel.app
```

### Update ESP32 Arduino Code

Once backend is hosting, update the Arduino code:

**File:** `ESP32_Full_Vitals.ino` (line ~31)

```cpp
#define SERVER_URL "https://your-backend-url.onrender.com/api/vitals"
```

Upload to ESP32 and it will send data to your hosted backend!

---

## 🔧 Troubleshooting

### "Build failed" error
- Check `frontend/package.json` has correct scripts
- Ensure Vercel is set to root dir: `frontend`
- Check for TypeScript errors: `npm run build` locally first

### CORS errors
- These will be fixed once backend is deployed
- Frontend needs backend URL to be correct

### Blank dashboard
- Check browser console (F12) for errors
- Verify backend URL is correct in App.jsx
- Ensure backend is running and accessible

---

## 📝 Vercel Dashboard

After deployment, you can:
- View logs: **Deployments → Current → Logs**
- See analytics: **Analytics tab**
- Configure domains: **Settings → Domains**
- Add custom domain: Points to your Vercel app

---

## 🎯 Your Live URLs

After both deployments:
- **Frontend:** `https://esp32-vitals-dashboard.vercel.app`
- **Backend:** `https://your-backend-url.onrender.com`
- **ESP32:** Connects to backend, displays on frontend

All working together across the internet!

---

## 📚 Next Steps

1. Deploy backend to Render (see DEPLOY_RENDER_BACKEND.md)
2. Update frontend with backend URL
3. Update ESP32 code with backend URL
4. Upload to ESP32
5. Watch your vitals stream live!
