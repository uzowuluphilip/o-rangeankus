# Deployment Guide

## 📦 Production Build

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API running

### Build Process

1. **Install Dependencies** (if not already done)
```bash
npm install
```

2. **Create Production Environment File**
```bash
cp .env.example .env.production
```

3. **Update Environment Variables**
```
VITE_API_BASE_URL=https://api.orangebank.com/api
```

4. **Build for Production**
```bash
npm run build
```

This creates an optimized `dist/` folder containing:
- Minified JavaScript
- Optimized CSS
- HTML with asset references
- Static assets

### Build Output
```
dist/
├── index.html          # Entry point
├── assets/
│   ├── index-xxx.js   # Main app bundle
│   └── index-xxx.css  # Compiled styles
└── vite.svg           # Favicon
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Static Hosting)

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
vercel
```

4. **Configure Environment**
- Add environment variable in Vercel dashboard
- `VITE_API_BASE_URL` = Production API URL

5. **Set Production URL**
- Vercel provides automatic HTTPS URL

### Option 2: Netlify

1. **Connect Repository**
- Push to GitHub/GitLab
- Connect with Netlify

2. **Build Settings**
- Build command: `npm run build`
- Publish directory: `dist`

3. **Environment Variables**
- Go to Site settings > Build & Deploy
- Add `VITE_API_BASE_URL`

4. **Deploy**
- Push to main branch triggers automatic deployment

### Option 3: Docker + Cloud Server

1. **Create Dockerfile**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri /index.html;
    add_header Cache-Control "public, max-age=3600";
  }
  location /assets {
    root /usr/share/nginx/html;
    add_header Cache-Control "public, max-age=31536000";
  }
}
```

3. **Build Docker Image**
```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.orangebank.com/api \
  -t orange-bank-frontend:1.0.0 .
```

4. **Run Container**
```bash
docker run -p 80:80 orange-bank-frontend:1.0.0
```

### Option 4: Traditional Server (Apache/Nginx)

1. **Build the app**
```bash
npm run build
```

2. **Upload dist folder** to server
```bash
scp -r dist/ user@server:/var/www/orange-bank/
```

3. **Configure Nginx**
```nginx
server {
  listen 80;
  server_name orangebank.com;
  
  root /var/www/orange-bank;
  index index.html;
  
  # SPA routing
  location / {
    try_files $uri /index.html;
  }
  
  # API proxy (optional)
  location /api {
    proxy_pass https://api.orangebank.com;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

4. **Configure SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d orangebank.com
```

## 🔒 Security Checklist

### HTTPS
- [ ] Enable HTTPS in production (required for JWT)
- [ ] Redirect HTTP to HTTPS
- [ ] Use HSTS headers

### API
- [ ] Verify API_BASE_URL is production API endpoint
- [ ] Ensure API has CORS configured correctly
- [ ] Implement request rate limiting (backend)

### Frontend
- [ ] Remove debug console.logs
- [ ] Validate all inputs client-side
- [ ] Use Content Security Policy headers
- [ ] Set proper cache headers

### Headers to Add
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

## 📊 Performance Optimization

### Built-in Vite Optimizations
- Code splitting (automatic)
- Lazy loading routes (add React.lazy())
- Asset minification
- Tree shaking
- Gzip compression

### Additional Optimizations

1. **Enable Gzip Compression** (Nginx)
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

2. **Cache Static Assets** (Nginx)
```nginx
location /assets {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~\.html$ {
  expires 1h;
  add_header Cache-Control "public";
}
```

3. **Use CDN** for static assets
- Cloudflare (free tier available)
- AWS CloudFront
- Fastly

## 🔄 CI/CD Pipeline Example (GitHub Actions)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: https://api.orangebank.com/api
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

## 🧪 Pre-deployment Testing

### Manual Testing Checklist
- [ ] Test login/logout flow
- [ ] Test all transfer types
- [ ] Test transaction filtering
- [ ] Test PDF downloads
- [ ] Test on mobile devices
- [ ] Test admin dashboard
- [ ] Test error scenarios

### Automated Testing (when added)
```bash
npm run test
```

## 📝 Environment Specific Configurations

### Development
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Staging
```
VITE_API_BASE_URL=https://staging-api.orangebank.com/api
```

### Production
```
VITE_API_BASE_URL=https://api.orangebank.com/api
```

## 🚨 Troubleshooting

### Issue: Blank page after deployment
**Solution**: Check in browser console for errors. Verify:
- API_BASE_URL is correct
- Backend CORS is configured
- JavaScript bundles are loading

### Issue: JWT errors after deployment
**Solution**: 
- Verify API endpoint in .env
- Check localStorage in browser DevTools
- Ensure backend is returning token correctly

### Issue: Styles not loading
**Solution**:
- Clear browser cache (Ctrl+Shift+Del)
- Check network tab for CSS file
- Verify Nginx/server MIME types

### Issue: CORS errors
**Solution**: Check backend has CORS headers:
```
Access-Control-Allow-Origin: https://orangebank.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## 📈 Monitoring & Logging

### Browser Monitoring
- Monitor errors with Sentry:
  ```javascript
  import * as Sentry from "@sentry/react";
  
  Sentry.init({
    dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
    environment: "production"
  });
  ```

### Server Monitoring
- Monitor uptime and performance
- Set up alerts for errors
- Use tools like DataDog, New Relic, or Grafana

## 🔄 Rollback Procedure

### Vercel
```bash
# View deployments
vercel deployments

# Promote recent deployment
vercel promote <deployment-url>
```

### Manual Server
```bash
# Keep backups
cp -r /var/www/orange-bank /var/www/orange-bank.backup.20240115

# Restore if needed
rm -rf /var/www/orange-bank
cp -r /var/www/orange-bank.backup.20240115 /var/www/orange-bank
```

## 📋 Deployment Checklist

### Before Deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] API endpoint verified
- [ ] Database backups created
- [ ] SSL certificate ready

### During Deployment
- [ ] Monitor build logs
- [ ] Verify deployment completed
- [ ] Check service health
- [ ] Monitor error logs

### After Deployment
- [ ] Test critical flows
- [ ] Verify API connection
- [ ] Check performance metrics
- [ ] Monitor error tracking
- [ ] Update status page

## 📞 Support & Rollback

### If Issues Arise
1. Check error logs immediately
2. Verify API is accessible
3. Check browser console for errors
4. Rollback if critical issues found
5. Investigate root cause
6. Redeploy fix

### Emergency Contact
- DevOps: devops@orangebank.com
- Backend: backend@orangebank.com
- Frontend: frontend@orangebank.com

---

**Version**: 1.0.0
**Last Updated**: March 2026
