# Cloudflare Pages Setup Guide

This guide will help you deploy UpTax Flow to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. GitHub repository access
3. Cloudflare API Token

## Step 1: Create Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use the "Custom token" template
4. Configure permissions:
   - Account: Cloudflare Pages:Edit
   - Zone: Page Rules:Edit (if using custom domain)
5. Save the token securely

## Step 2: Get Cloudflare Account ID

1. Go to any domain in your Cloudflare account
2. In the right sidebar, find your Account ID
3. Copy this ID

## Step 3: Configure GitHub Secrets

In your GitHub repository settings, add these secrets:

1. `CLOUDFLARE_API_TOKEN` - Your API token from Step 1
2. `CLOUDFLARE_ACCOUNT_ID` - Your account ID from Step 2

## Step 4: Manual Deployment (First Time)

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project"
3. Connect to Git
4. Select your repository: `uptax-flow`
5. Configure build settings:
   - Build command: `pnpm run build`
   - Build output directory: `build/client`
   - Environment variables: Add any required API keys

## Step 5: Automatic Deployments

After the initial setup, the GitHub Actions workflow will automatically deploy:
- On every push to `main` branch
- On pull requests (preview deployments)

## Environment Variables

Add these in Cloudflare Pages settings:

```
NODE_ENV=production
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
```

## Custom Domain (Optional)

1. In Cloudflare Pages project settings
2. Go to "Custom domains"
3. Add your domain (e.g., `flow.uptax.com.br`)
4. Follow DNS configuration instructions

## Troubleshooting

### Build Failures
- Check GitHub Actions logs
- Verify all environment variables are set
- Ensure Node.js version matches (>=18.18.0)

### Runtime Errors
- Check Cloudflare Pages Functions logs
- Verify API keys are correctly set
- Check browser console for client-side errors

## Support

For issues, check:
- [GitHub Issues](https://github.com/Uptax-creator/uptax-flow/issues)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)