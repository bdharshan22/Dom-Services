# Deployment Guide

## Backend Deployment (Render)

1. **Push code to GitHub repository**

2. **Create Render account and connect GitHub**

3. **Create new Web Service on Render:**
   - Repository: Select your GitHub repo
   - Branch: main
   - Root Directory: `domestic-services-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables in Render:**
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

5. **Deploy and get your Render URL** (e.g., https://your-app.onrender.com)

## Frontend Deployment (Vercel)

1. **Update environment variables:**
   - Update `.env.production` with your Render backend URL
   - Update `server.js` CORS origin with your Vercel URL

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Navigate to frontend folder: `cd domestic-services-frontend`
   - Run: `vercel`
   - Follow prompts and deploy

3. **Add Environment Variables in Vercel:**
   ```
   VITE_API_URL=https://your-render-app.onrender.com/api
   ```

4. **Update CORS in backend:**
   - Replace `https://your-vercel-app.vercel.app` with your actual Vercel URL
   - Redeploy backend on Render

## Post-Deployment Steps

1. **Test the application**
2. **Update any hardcoded URLs**
3. **Monitor logs for errors**
4. **Set up custom domains (optional)**

## Important Notes

- Render free tier may have cold starts
- Vercel automatically handles SPA routing with vercel.json
- Environment variables are case-sensitive
- MongoDB Atlas is recommended for production database