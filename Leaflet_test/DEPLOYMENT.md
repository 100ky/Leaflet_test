# 🚀 Produkční nasazení - České spalovny

Kompletní návod pro nasazení aplikace České spalovny do produkčního prostředí.

## 📋 Předpoklady

### Systémové požadavky
- **Node.js**: verze 18+ (doporučeno 20+)
- **NPM**: verze 9+
- **RAM**: minimálně 512MB, doporučeno 1GB+
- **Storage**: ~200MB pro aplikaci včetně cache
- **CPU**: Single core je dostačující pro běžný provoz

### Síťové požadavky
- **HTTPS**: Doporučeno pro produkční prostředí
- **Domain**: Vlastní doména nebo subdoména
- **CDN**: Volitelné, ale doporučené (Vercel/Cloudflare)

## 🛠️ Příprava k nasazení

### 1. Kontrola kvality kódu

```bash
# Kontrola ESLint pravidel
npm run lint

# Kontrola TypeScript typů
npx tsc --noEmit

# Test produkčního buildu
npm run build
```

### 2. Environment konfigurace

Vytvořte `.env.production` soubor:

```env
# Produkční prostředí
NODE_ENV=production

# API konfigurace
NEXT_PUBLIC_API_URL=https://your-domain.com

# Analytics (volitelné)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Error tracking (volitelné)
SENTRY_DSN=https://your-sentry-dsn

# Build optimalizace
ANALYZE=false
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Build optimalizace

V `next.config.ts` ověřte produkční nastavení:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produkční optimalizace
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['leaflet', 'react-leaflet']
  },
  
  // Komprese
  compress: true,
  
  // Headers pro cache
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}
```

## 🌐 Nasazení na Vercel (doporučeno)

### Automatické nasazení

1. **Připojení GitHub repository**
   ```bash
   # Pushněte kód na GitHub
   git push origin main
   ```

2. **Konfigurace na vercel.com**
   - Přihlaste se na [vercel.com](https://vercel.com)
   - Importujte GitHub repository
   - Vercel automaticky detekuje Next.js projekt

3. **Environment proměnné**
   - V Vercel dashboard → Settings → Environment Variables
   - Přidejte produkční environment proměnné

4. **Custom domain (volitelné)**
   - Settings → Domains
   - Přidejte vlastní doménu
   - Nakonfigurujte DNS záznamy

### CLI nasazení

```bash
# Instalace Vercel CLI
npm i -g vercel

# První nasazení
vercel

# Produkční nasazení
vercel --prod

# Nastavení environment proměnných
vercel env add NEXT_PUBLIC_API_URL production
```

## 🖥️ Nasazení na vlastní server

### Metoda 1: Standalone (doporučeno)

1. **Konfigurace standalone režimu**
   ```javascript
   // next.config.js
   module.exports = {
     output: 'standalone'
   }
   ```

2. **Build a kopírování**
   ```bash
   npm run build
   
   # Kopíruj na server:
   # .next/standalone/
   # .next/static/ → .next/standalone/.next/static/
   # public/ → .next/standalone/public/
   ```

3. **Spuštění na serveru**
   ```bash
   cd .next/standalone
   PORT=3000 node server.js
   ```

### Metoda 2: PM2 (pro Node.js servery)

1. **Instalace PM2**
   ```bash
   npm install -g pm2
   ```

2. **PM2 konfigurace** (`ecosystem.config.js`)
   ```javascript
   module.exports = {
     apps: [{
       name: 'ceske-spalovny',
       script: 'server.js',
       cwd: './.next/standalone',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log'
     }]
   }
   ```

3. **Spuštění**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Metoda 3: Docker

1. **Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci --only=production

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build a spuštění**
   ```bash
   docker build -t ceske-spalovny .
   docker run -p 3000:3000 ceske-spalovny
   ```

## ⚙️ Reverzní proxy (Nginx)

### Nginx konfigurace

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Gzip komprese
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Cache statických souborů
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /images/ {
        expires 1y;
        add_header Cache-Control "public";
    }

    # Proxy na Next.js aplikaci
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring a údržba

### 1. Health check endpoint

Vytvořte health check pro monitoring:

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Základní health checks
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { status: 'error', error: error.message },
      { status: 500 }
    );
  }
}
```

### 2. Error tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 3. Analytics (Google Analytics)

```typescript
// src/utils/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
```

### 4. Performance monitoring

```bash
# Analýza bundle velikosti
npm run build
npx @next/bundle-analyzer

# Runtime monitoring
npm install @vercel/analytics
```

## 🔒 Bezpečnost

### Security headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### Environment proměnné

```bash
# Nikdy necommitujte do Git:
.env.local
.env.production
.env

# Používejte vault nebo secure storage pro:
# - API klíče
# - Database hesla
# - SSL certifikáty
```

## 🔄 CI/CD Pipeline

### GitHub Actions příklad

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run lint
      
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🚨 Troubleshooting

### Běžné produkční problémy

**1. Aplikace se nespustí**
```bash
# Zkontrolujte logy
pm2 logs ceske-spalovny
# nebo
docker logs container-id

# Zkontrolujte porty
netstat -tlnp | grep 3000
```

**2. Pomalé načítání**
```bash
# Analyzujte bundle
npm run build && npx @next/bundle-analyzer

# Zkontrolujte network latency
curl -w "@curl-format.txt" -o /dev/null https://your-domain.com
```

**3. Memory leaks**
```bash
# Monitorování paměti
pm2 monit

# Heap dump analýza
node --inspect server.js
```

**4. SSL problémy**
```bash
# Test SSL certifikátu
openssl s_client -connect your-domain.com:443

# Renewal (Let's Encrypt)
certbot renew --dry-run
```

### Emergency postupy

**Rollback nasazení:**
```bash
# Vercel
vercel rollback

# PM2
pm2 reload ceske-spalovny

# Docker
docker run -p 3000:3000 ceske-spalovny:previous-tag
```

**Rychlá oprava:**
```bash
# Hotfix branch
git checkout -b hotfix/critical-fix
# ... fix
git push origin hotfix/critical-fix
# Fast-track přes CI/CD
```

## 📞 Podpora

Pro produkční problémy:

1. **Zkontrolujte monitoring** (health endpoint, logy)
2. **Konzultujte troubleshooting** sekci
3. **Vytvořte issue** s production logs
4. **Emergency kontakt** přes projektové kanály

---

**Úspěšné produkční nasazení! 🎉**
