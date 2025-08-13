# PulseSync - Vercel Deployment Guide

This guide will help you deploy the PulseSync Next.js application to Vercel.

## Prerequisites

1. **GitHub/GitLab/Bitbucket Account** - Your code repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Environment Variables** - API keys and configuration

## Step 1: Prepare Your Repository

### 1.1 Ensure Your Code is Pushed
Make sure all your latest changes are pushed to your main branch:
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### 1.2 Verify Build Locally
Test that your application builds successfully:
```bash
npm run build
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub/GitLab/Bitbucket account

2. **Import Project**
   - Click "New Project"
   - Select your repository (pulsesync)
   - Vercel will auto-detect it's a Next.js project

3. **Configure Project**
   - Project Name: `pulsesync`
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

### 3.1 In Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add the following variables:

#### Required Environment Variables:
```
NODE_ENV=production
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

#### Application-Specific Variables:
```
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Microsoft Graph Configuration
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
AZURE_AD_TENANT_ID=your-azure-ad-tenant-id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token

# Spotify Configuration (if using)
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

### 3.2 Via Vercel CLI
```bash
# Set environment variables via CLI
vercel env add NEXTAUTH_SECRET
vercel env add OPENAI_API_KEY
vercel env add AZURE_AD_CLIENT_ID
# ... add other variables
```

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

### 4.2 Update Environment Variables
Update `NEXTAUTH_URL` to use your custom domain:
```
NEXTAUTH_URL=https://yourdomain.com
```

## Step 5: Automatic Deployments

### 5.1 Git Integration
Vercel automatically deploys when you push to your main branch:
- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches or pull requests

### 5.2 Deploy Hooks (Optional)
Create deploy hooks for manual or external triggers:
1. Settings → Git → Deploy Hooks
2. Create hook with a name
3. Use the webhook URL to trigger deployments

## Step 6: Monitoring and Analytics

### 6.1 Vercel Analytics
Enable Vercel Analytics for performance monitoring:
1. Settings → Analytics
2. Enable Web Analytics
3. Add analytics script to your app (optional)

### 6.2 Function Logs
Monitor API routes and server functions:
1. Functions tab in Dashboard
2. View real-time logs
3. Monitor performance and errors

## Step 7: Performance Optimization

### 7.1 Vercel Edge Functions
For better performance, consider using Edge Functions for API routes:
```javascript
// In your API routes, add:
export const config = {
  runtime: 'edge',
}
```

### 7.2 Image Optimization
Next.js Image component works automatically with Vercel's Image Optimization.

### 7.3 Caching Strategy
Vercel automatically handles caching for static assets and pages.

## Common Issues and Solutions

### Issue: Build Fails
**Solution**: Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors
- Verify environment variables are set

### Issue: API Routes Not Working
**Solution**: 
- Check function logs in Vercel Dashboard
- Ensure API routes are in `src/app/api/` directory
- Verify environment variables for external services

### Issue: Authentication Not Working
**Solution**:
- Update `NEXTAUTH_URL` to your Vercel domain
- Check that all OAuth providers are configured correctly
- Verify callback URLs in OAuth providers

### Issue: Database Connection Issues
**Solution**:
- Use connection pooling for database connections
- Consider serverless-friendly databases
- Check connection limits

## Security Best Practices

1. **Environment Variables**: Never commit secrets to repository
2. **HTTPS**: Vercel provides HTTPS by default
3. **CORS**: Configure CORS headers for API routes if needed
4. **Rate Limiting**: Implement rate limiting for API routes

## Cost Optimization

1. **Function Duration**: Optimize serverless functions
2. **Bundle Size**: Minimize bundle size for faster cold starts
3. **Edge Functions**: Use Edge Functions for better performance
4. **Image Optimization**: Use Next.js Image component

## Deployment Commands Summary

```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy to production
vercel --prod

# Deploy preview
vercel

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

## Next Steps After Deployment

1. **Test Your Application**: Visit your Vercel URL
2. **Configure Monitoring**: Set up error tracking
3. **Set Up Analytics**: Enable Vercel Analytics
4. **Configure Alerts**: Set up deployment notifications
5. **Document APIs**: Document your API endpoints

Your PulseSync application will be available at:
- **Production**: `https://pulsesync.vercel.app` (or your custom domain)
- **Preview**: Unique URLs for each branch/PR

---

## Quick Start

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Add environment variables
4. Deploy!

Your application will be live in minutes! 🚀
