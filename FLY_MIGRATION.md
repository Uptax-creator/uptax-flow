# 🚀 Migração UpTax Flow: Cloudflare → Fly.io

## ❌ Problemas Cloudflare Pages
- Erro persistente na instalação Node.js (20→18→18.0.0)
- Falta de suporte nativo pnpm
- Ambiente de build inflexível
- Falhas no pipeline sem logs detalhados

## ✅ Vantagens Fly.io
- ✅ **Suporte nativo pnpm**
- ✅ **Controle total do ambiente**
- ✅ **Dockerfile personalizado**
- ✅ **Logs detalhados de build**
- ✅ **Edge locations globais**
- ✅ **Melhor para aplicações Remix**

## 🔧 Configuração Fly.io

### 1. Instalar Fly CLI
```bash
# macOS
brew install flyctl

# Login
flyctl auth login
```

### 2. Inicializar Projeto
```bash
cd uptax-flow
flyctl launch
```

### 3. Dockerfile Otimizado
```dockerfile
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm@9.4.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start
CMD ["pnpm", "start"]
```

### 4. fly.toml
```toml
app = "uptax-flow"
primary_region = "gru"

[build]

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[vm]]
  memory = "1gb"
  cpu_kind = "shared"
  cpus = 1

[env]
  NODE_ENV = "production"
```

## 🚀 Deploy
```bash
flyctl deploy
```

## 💰 Custos
- **Hobby Plan**: ~$5/mês
- **Melhor ROI** que debugging Cloudflare
- **Tempo economizado** > custo

## 📊 Comparação

| Feature | Cloudflare Pages | Fly.io |
|---------|------------------|--------|
| pnpm Support | ❌ Manual | ✅ Nativo |
| Build Control | ❌ Limitado | ✅ Total |
| Debugging | ❌ Logs básicos | ✅ Logs completos |
| Deploy Speed | ❌ Falhas | ✅ Rápido |
| Configuração | ❌ Complexa | ✅ Simples |

## 🎯 Recomendação: **MIGRAR AGORA**

Tempo gasto debuggando Cloudflare > custo Fly.io