# 🚀 Deployment Guide - UpTax Flow

## Cloudflare Pages Deployment

### Required Environment Variables

**❗ CRITICAL:** Ensure these exact values in Cloudflare Pages Environment Variables:

```
Type        Name            Value                   Notes
Variable    AUTH_SECRET     [your-secure-secret]    Keep your current value
Variable    NODE_ENV        production              Required for production
Variable    NODE_VERSION    20.15.1                 ⚠️  MUST BE 20.15.1 (not 18)
Variable    PNPM_VERSION    9.4.0                   Package manager version
```

### Build Configuration

```yaml
Build Command: npm run build
Build Output Directory: build/client
Root Directory: / (leave empty)
Node.js Version: 20.15.1
```

### Troubleshooting Common Issues

#### 1. "remix: not found" Error
**Cause:** `NODE_VERSION` set to `18` instead of `20.15.1`
**Solution:** Update `NODE_VERSION` to `20.15.1` in Environment Variables

#### 2. "Failed: error occurred while installing tools"
**Cause:** Incompatible Node.js version or missing build dependencies
**Solution:** Verify all environment variables match the table above

#### 3. Wrangler Configuration Mismatch
**Cause:** Project name mismatch between Cloudflare and wrangler.toml
**Solution:** Ensure `name = "flow"` in wrangler.toml matches Cloudflare project name

### Pre-deployment Checklist

- [ ] `NODE_VERSION` = `20.15.1` (not 18)
- [ ] `PNPM_VERSION` = `9.4.0` 
- [ ] `NODE_ENV` = `production`
- [ ] `AUTH_SECRET` is set (secure random string)
- [ ] Project name in wrangler.toml = `"flow"`
- [ ] Build command = `npm run build`
- [ ] Output directory = `build/client`

### Deployment Process

1. **Update Environment Variables** in Cloudflare Pages
2. **Trigger Deployment** (manual or push to main)
3. **Monitor Build Logs** for any errors
4. **Verify Deployment** at your Cloudflare Pages URL

### Build Dependencies

These packages are now in `dependencies` (not `devDependencies`) for Cloudflare compatibility:
- `@remix-run/dev@^2.10.0`
- `vite@^5.3.1` 
- `typescript@^5.5.2`

### Automatic Deployment

GitHub Actions automatically deploys to Cloudflare Pages on every push to `main` branch.

### Support

If deployment fails, check:
1. Environment variables match exactly
2. Build logs for specific error messages
3. GitHub repository has latest changes pushed