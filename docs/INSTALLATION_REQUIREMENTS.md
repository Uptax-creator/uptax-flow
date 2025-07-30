# Installation Requirements - UpTax Flow

## 📋 System Requirements

### Required Software
1. **Node.js** >= 18.18.0
2. **pnpm** >= 9.4.0 (package manager)
3. **Git** (for version control)

### Optional but Recommended
- **VS Code** (IDE with TypeScript support)
- **Docker** (for containerized deployment)

## 📦 Dependencies Overview

### Core Dependencies (Already in package.json)
```json
{
  "engines": {
    "node": ">=18.18.0"
  },
  "packageManager": "pnpm@9.4.0"
}
```

### Key Libraries Included:
- **Remix** (Full-stack framework)
- **React 18** (UI library)
- **TypeScript** (Type safety)
- **Vite** (Build tool)
- **UnoCSS** (Styling)
- **Radix UI** (Component primitives)
- **AI SDK** (Multiple AI providers)
- **Wrangler** (Cloudflare deployment)

## 🚀 Installation Process

### 1. System Setup
```bash
# Install Node.js (if not installed)
# Download from https://nodejs.org/ or use nvm
nvm install 18.18.0
nvm use 18.18.0

# Install pnpm globally
npm install -g pnpm@9.4.0
```

### 2. Project Setup
```bash
# Clone repository
git clone https://github.com/Uptax-creator/uptax-flow.git
cd uptax-flow

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm run dev
```

### 3. Environment Variables
Create `.env` file with:
```bash
# Required for production
AUTH_SECRET=your-auth-secret-here

# Optional AI providers
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Cloudflare deployment (optional)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
```

## 🔧 Development Commands

```bash
# Development server
pnpm run dev

# Type checking
pnpm run typecheck

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Deploy to Cloudflare
pnpm run deploy
```

## ⚠️ Common Issues & Solutions

### 1. TypeScript Errors
**Problem**: Environment variables not recognized
**Solution**: Update `worker-configuration.d.ts` with required types

### 2. Package Manager Issues
**Problem**: `command not found: pnpm`
**Solution**: Install pnpm globally: `npm install -g pnpm@9.4.0`

### 3. Port Already in Use
**Problem**: Port 5173 is busy
**Solution**: Kill existing processes: `lsof -ti:5173 | xargs kill -9`

### 4. Authentication Issues
**Problem**: Session storage errors
**Solution**: Ensure `AUTH_SECRET` is set in environment variables

## 🌐 Deployment Options

### Local Development
- Port: `http://localhost:5173`
- Hot reload enabled
- TypeScript compilation

### Cloudflare Pages (Recommended)
- Global CDN
- Automatic deployments via GitHub Actions
- Environment variables managed in dashboard

### Docker (Alternative)
```bash
# Build container
docker build -t uptax-flow .

# Run container
docker run -p 5173:5173 uptax-flow
```

## 📊 Performance Considerations

### Build Optimization
- Tree shaking enabled via Vite
- CSS optimization with UnoCSS
- Code splitting for better loading

### Runtime Performance
- Server-side rendering with Remix
- Edge computing with Cloudflare Workers
- Optimized bundle size

## 🔐 Security Checklist

- [ ] Update `AUTH_SECRET` in production
- [ ] Set secure environment variables
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Validate all user inputs

## 📞 Support

For installation issues:
1. Check [GitHub Issues](https://github.com/Uptax-creator/uptax-flow/issues)
2. Verify Node.js and pnpm versions
3. Clear `node_modules` and reinstall if needed
4. Check environment variable configuration