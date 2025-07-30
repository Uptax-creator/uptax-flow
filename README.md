# UpTax Flow - AI-Powered Workflow Automation Platform

UpTax Flow is an AI-powered workflow automation platform that combines visual programming with intelligent agents to streamline business processes. Built on top of cutting-edge web technologies, it enables users to create, deploy, and manage complex automation workflows directly from their browser.

## 🚀 Features

- **Visual Workflow Builder**: Drag-and-drop interface for creating automation flows
- **AI-Powered Agents**: Intelligent assistants that help build and optimize workflows
- **MCP Integration**: Connect to multiple business systems through Model Context Protocol
- **Real-time Collaboration**: Work together on workflows in real-time
- **Cloud Deployment**: Deploy workflows instantly to Cloudflare's global edge network
- **N8N Compatible**: Import and export workflows from N8N

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Remix
- **AI Integration**: Multiple AI providers (OpenAI, Anthropic, etc.)
- **State Management**: Zustand
- **Styling**: UnoCSS + Radix UI
- **Build Tool**: Vite
- **Deployment**: Cloudflare Pages

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

Create a `.env` file based on `.env.example`:

```bash
# AI Provider Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Other configurations
NODE_ENV=development
```

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