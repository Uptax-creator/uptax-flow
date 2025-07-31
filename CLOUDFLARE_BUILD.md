# 🚀 Cloudflare Pages Build Configuration

## ⚙️ Configurações Necessárias no Dashboard Cloudflare

### Build Settings:
- **Framework preset**: `None` (ou deixe em branco)
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `build/client`
- **Root directory**: `/` (deixe vazio)

### Environment Variables (opcional):
```
NPM_FLAGS = --version
```

## 🔧 Por que esta configuração?

1. **pnpm não vem pré-instalado** na Cloudflare Pages
2. O comando `build:cloudflare` primeiro instala pnpm, depois executa o build normal
3. Isso garante que a versão correta do pnpm (9.4.0) seja usada

## 📋 Comandos de Build

### Local (desenvolvimento):
```bash
pnpm run build
```

### Cloudflare Pages:
```bash
npm run build:cloudflare
```

Este comando executa:
1. `npm install -g pnpm@9.4.0` - Instala pnpm globalmente
2. `pnpm install --frozen-lockfile` - Instala dependências
3. `pnpm run build` - Executa o build do Remix

## 🚨 Troubleshooting

Se ainda houver erros:
1. Verifique se o Node.js 18 está sendo usado (`.nvmrc`)
2. Confirme que `build:cloudflare` está no package.json
3. Use `npm run build:cloudflare` como Build command na Cloudflare

---

**Última Atualização:** 31/01/2025