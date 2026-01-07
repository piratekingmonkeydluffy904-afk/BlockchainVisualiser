# Deploying Blockchain Visualizer to GitHub Pages

## Prerequisites
- GitHub account
- Git installed on your computer
- Project code ready

## Step-by-Step Deployment

### 1. Prepare the Project

First, install the GitHub Pages deployment package:

```bash
npm install --save-dev gh-pages
```

### 2. Update package.json

Add these scripts and homepage to your `package.json`:

```json
{
  "name": "blockchainvisualiser",
  "homepage": "https://YOUR_USERNAME.github.io/blockchainvisualiser",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Update vite.config.ts

Add the base path:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/blockchainvisualiser/', // Add this line
  plugins: [react()],
  optimizeDeps: {
    exclude: ['pyodide']
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
```

### 4. Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Blockchain Visualizer"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/blockchainvisualiser.git

# Push to GitHub
git push -u origin main
```

### 5. Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
1. Build your project (`npm run build`)
2. Create a `gh-pages` branch
3. Push the built files to that branch
4. Your site will be live in a few minutes!

### 6. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** section
4. Under **Source**, select `gh-pages` branch
5. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/blockchainvisualiser`

## Alternative: Deploy to Vercel (Easier)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
vercel
```

Follow the prompts - it's that simple! Vercel will give you a live URL instantly.

## Updating Your Site

Whenever you make changes:

```bash
# For GitHub Pages
git add .
git commit -m "Update description"
git push origin main
npm run deploy

# For Vercel
vercel --prod
```

## Custom Domain (Optional)

### For GitHub Pages:
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Add a `CNAME` file to your `public` folder with your domain
3. Configure DNS settings in your domain provider
4. Update GitHub Pages settings

### For Vercel:
1. Go to Vercel dashboard
2. Click on your project
3. Go to Settings → Domains
4. Add your custom domain
5. Follow DNS configuration instructions

## Troubleshooting

### Issue: Blank page after deployment
**Solution**: Make sure `base` in `vite.config.ts` matches your repository name

### Issue: Pyodide not loading
**Solution**: Check browser console for CORS errors. GitHub Pages should work fine, but if issues persist, use Vercel instead.

### Issue: 404 on refresh
**Solution**: Add a `404.html` that redirects to `index.html` (for SPA routing)

## Free Hosting Comparison

| Feature | GitHub Pages | Vercel | Netlify |
|---------|-------------|--------|---------|
| Price | FREE | FREE | FREE |
| Build time | ~2 min | ~30 sec | ~1 min |
| Custom domain | ✅ | ✅ | ✅ |
| HTTPS | ✅ | ✅ | ✅ |
| Auto deploy | ❌ | ✅ | ✅ |
| Bandwidth | 100GB/month | 100GB/month | 100GB/month |

## Recommended: Vercel

For this project, I recommend **Vercel** because:
- Faster deployment
- Better performance
- Automatic deployments on git push
- Better error handling
- Still 100% free

## Quick Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

Done! Your site is live in under 2 minutes! 🎉
