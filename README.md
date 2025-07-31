# UpTax Flow - AI-Powered Workflow Automation Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Status](https://img.shields.io/badge/status-Production%20Ready-green) ![Node](https://img.shields.io/badge/node-20.15.1-brightgreen) ![Cloudflare](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)

UpTax Flow is an AI-powered workflow automation platform that combines visual programming with intelligent agents to streamline business processes. Built on top of cutting-edge web technologies, it enables users to create, deploy, and manage complex automation workflows directly from their browser.

**🌐 Live Demo**: [https://flow.pages.dev](https://flow.pages.dev)

## 🚀 Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating automation flows
- **AI-Powered Agents**: Intelligent assistants that help build and optimize workflows  
- **MCP Integration**: Connect to multiple business systems through Model Context Protocol
- **Omie ERP Integration**: 49 financial tools via FastMCP
- **Nibo Accounting**: 37 accounting and tax compliance tools
- **N8N Workflows**: Visual workflow automation engine
- **Real-time Collaboration**: Work together on workflows in real-time
- **Cloud Deployment**: Deploy workflows instantly to Cloudflare's global edge network

## 🛠 Technology Stack

- **Framework**: Remix 2.10.2 + React 18 + TypeScript 5.5.2
- **Runtime**: Node.js 20.15.1 (LTS)
- **Package Manager**: pnpm 9.4.0
- **AI Integration**: Multiple AI providers (OpenAI, Anthropic, OpenRouter, etc.)
- **State Management**: Nanostores + Remix loaders/actions
- **Styling**: UnoCSS + Radix UI components
- **Code Editor**: CodeMirror 6 with language support
- **Terminal**: xterm.js with WebContainer integration
- **Build Tool**: Vite 5.3.1
- **Deployment**: Cloudflare Pages with edge computing

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/uptax-platform/uptax-flow.git
cd uptax-flow

# Install dependencies (requires pnpm)
pnpm install

# Run development server
pnpm run dev
```

## 🔧 Configuration

### Local Development

Create a `.env` file based on `.env.example`:

```bash
# AI Provider Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENROUTER_API_KEY=your_openrouter_key

# Application Settings
NODE_ENV=development
PORT=5173
AUTH_SECRET=your-development-secret-key

# MCP Server Endpoints (Local)
MCP_OMIE_ENDPOINT=http://localhost:3000
MCP_NIBO_ENDPOINT=http://localhost:3001
MCP_UNIFIED_ENDPOINT=http://localhost:3000

# N8N Integration
N8N_API_URL=http://localhost:5678/api/v1
N8N_USERNAME=admin
N8N_PASSWORD=admin123

# Feature Flags
ENABLE_COLLABORATION=true
ENABLE_CLOUD_SYNC=true
ENABLE_MCP_INTEGRATION=true
```

### Cloudflare Pages Deployment

**Required Environment Variables:**

| Variable | Value | Description |
|----------|-------|-------------|
| `AUTH_SECRET` | Your secure secret | Session encryption key |
| `NODE_ENV` | `production` | Environment mode |
| `NODE_VERSION` | `20.15.1` | **IMPORTANT: Must be 20.15.1** |
| `PNPM_VERSION` | `9.4.0` | Package manager version |

**Deploy Configuration:**
- **Build Command**: `npm run build`
- **Build Output Directory**: `build/client`
- **Root Directory**: `/` (default)
- **Node.js Version**: `20.15.1` (LTS)

**Automatic Deployment:**
This repository includes GitHub Actions for automatic deployment to Cloudflare Pages on every push to `main`.

## 🚀 Deployment

### Local Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
pnpm preview
```

### Cloudflare Pages
1. Connect your GitHub repository to Cloudflare Pages
2. Set the environment variables listed above
3. **Ensure `NODE_VERSION` is set to `20.15.1`**
4. Deploy automatically on push to main

## 📚 Documentation

For detailed documentation, visit our [GitHub Pages](https://uptax-platform.github.io/uptax-flow/).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🏢 About UpTax

UpTax is revolutionizing business automation by combining AI with visual programming. Our platform helps businesses of all sizes streamline their operations and focus on growth.

---

Built with ❤️ by the UpTax Team