# PlateOS Deployment Guide

This guide explains how to deploy PlateOS demo to various hosting platforms.

## Build for Production

First, create a production build:

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Deployment Options

### 1. Vercel (Recommended - Easiest)

#### Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd plateos-demo
vercel
```

#### Using Vercel Website
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel auto-detects Vite
6. Click "Deploy"

**Done!** Your app will be live at `https://your-project.vercel.app`

### 2. Netlify

#### Using Netlify CLI
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Using Netlify Website
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `dist` folder
3. Or connect your Git repository

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `dist`

### 3. GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/plateos-demo"
}
```

3. Deploy:
```bash
npm run deploy
```

**Note**: Update `base` in `vite.config.ts`:
```ts
export default defineConfig({
  base: '/plateos-demo/',
  // ... rest of config
})
```

### 4. Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login and init:
```bash
firebase login
firebase init hosting
```

3. Configure:
- Public directory: `dist`
- Single-page app: Yes
- Automatic builds: No

4. Deploy:
```bash
npm run build
firebase deploy
```

### 5. AWS S3 + CloudFront

1. Build the app:
```bash
npm run build
```

2. Create S3 bucket:
```bash
aws s3 mb s3://plateos-demo
```

3. Upload files:
```bash
aws s3 sync dist/ s3://plateos-demo --delete
```

4. Configure bucket for static hosting
5. (Optional) Set up CloudFront for CDN

### 6. DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy

### 7. Render

1. Go to [render.com](https://render.com)
2. New Static Site
3. Connect repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy

## Custom Domain

After deploying to any platform:

1. Get your deployment URL
2. Go to your domain provider
3. Add CNAME record pointing to deployment
4. Configure custom domain in hosting platform

## Environment Considerations

### No Environment Variables Needed
PlateOS demo has no backend, so no environment variables are required.

### Browser Compatibility
The app works on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
Production build is optimized with:
- Code splitting
- Minification
- Tree shaking
- Gzip compression (on most hosts)

Expected bundle size: ~200-300 KB gzipped

## Post-Deployment Checklist

- [ ] Test on mobile devices
- [ ] Verify language switching works
- [ ] Test cart persistence
- [ ] Check order flow (customer → admin)
- [ ] Verify all images load
- [ ] Test on different browsers
- [ ] Check responsive design
- [ ] Verify localStorage works

## Monitoring

Since this is a frontend-only demo, monitoring is minimal:

1. **Analytics**: Add Google Analytics or similar
2. **Error Tracking**: Consider Sentry for production use
3. **Performance**: Use Lighthouse for performance audits

## Updating

To update the deployed app:

1. Make changes locally
2. Test with `npm run dev`
3. Build: `npm run build`
4. Test build: `npm run preview`
5. Deploy using your chosen method

Most platforms (Vercel, Netlify) auto-deploy on git push if connected to repo.

## Troubleshooting

### Blank Page After Deploy
- Check browser console for errors
- Verify base path in `vite.config.ts`
- Check that `dist` folder was uploaded correctly

### 404 Errors
- Ensure hosting is configured for single-page apps
- Add redirect rules if needed

### Images Not Loading
- Check image URLs in mock data
- Verify external image sources are accessible
- Consider hosting images locally in `public` folder

### localStorage Not Working
- Some hosting platforms may block localStorage in iframes
- Ensure site is served over HTTPS

## Cost Estimate

All platforms offer free tiers sufficient for PlateOS demo:

- **Vercel**: Free for personal projects
- **Netlify**: Free (100GB bandwidth/month)
- **GitHub Pages**: Free
- **Firebase**: Free (10GB storage)
- **Render**: Free tier available

## Security Notes

Since PlateOS is a demo with no authentication:
- No sensitive data is stored
- All data is client-side only
- No API keys or secrets needed
- Safe to deploy publicly

## Need Help?

If you encounter deployment issues:
1. Check the platform's documentation
2. Review build logs
3. Test locally with `npm run preview`
4. Verify `dist` folder contents

Happy deploying!
