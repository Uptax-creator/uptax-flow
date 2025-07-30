# 🚀 Cloudflare Pages - Guia Completo de Setup

## 📋 **Ordem Correta do Processo**

### **Fase 1: Setup no Cloudflare (PRIMEIRO)**
1. Criar projeto no Cloudflare Pages
2. Configurar build settings
3. Fazer primeiro deploy manual

### **Fase 2: GitHub Secrets (DEPOIS)**
1. Configurar secrets para deploys automáticos
2. Testar pipeline CI/CD

---

## 🎯 **FASE 1: Criando Projeto no Cloudflare Pages**

### **Passo 1: Acessar Cloudflare Pages**
1. Acesse: https://dash.cloudflare.com/pages
2. Clique em **"Create a project"**
3. Escolha **"Connect to Git"**

### **Passo 2: Conectar GitHub**
1. Clique em **"Connect GitHub"**
2. Autorize o Cloudflare
3. Selecione: **Uptax-creator/uptax-flow**

### **Passo 3: Configurar Build Settings**

⚠️ **IMPORTANTE**: Use estas configurações EXATAS:

```
Framework preset: Remix
Build command: pnpm run build
Build output directory: build/client
Root directory: (deixar vazio)
```

### **Passo 4: Variáveis de Ambiente**

Clique em **"Environment variables"** e adicione:

#### **🔴 OBRIGATÓRIAS (Build)**
```
NODE_VERSION = 18
PNPM_VERSION = 9.4.0
```

#### **🟡 RECOMENDADAS (Runtime)**
```
NODE_ENV = production
AUTH_SECRET = (gerar string aleatória segura)
```

#### **🔵 OPCIONAIS (APIs)**
```
OPENAI_API_KEY = sua-chave-aqui
ANTHROPIC_API_KEY = sua-chave-aqui
GOOGLE_GENERATIVE_AI_API_KEY = sua-chave-aqui
```

### **Passo 5: Deploy Inicial**
1. Clique em **"Save and Deploy"**
2. Aguarde o build (5-10 minutos)
3. Acesse a URL gerada: `uptax-flow.pages.dev`

---

## 🔐 **FASE 2: GitHub Secrets (Para Deploys Automáticos)**

### **Por que fazer DEPOIS?**
- Você precisa do projeto criado para gerar o API Token
- O Account ID fica mais fácil de encontrar
- Você confirma que o setup manual funciona primeiro

### **Passo 1: Gerar API Token (no Cloudflare)**
1. Vá para: https://dash.cloudflare.com/profile/api-tokens
2. Clique **"Create Token"**
3. Use template **"Cloudflare Pages - Edit"**
4. Ou configure manualmente:
   ```
   Permissions:
   - Account - Cloudflare Pages:Edit
   - Account - Account Settings:Read
   - Zone - Zone Settings:Read
   
   Account Resources:
   - Include - Your Account
   ```
5. **COPIE O TOKEN** (só aparece uma vez!)

### **Passo 2: Pegar Account ID**
1. No dashboard do Cloudflare
2. Vá em qualquer domínio ou Pages
3. Sidebar direita → **Account ID**
4. Copie o ID (32 caracteres)

### **Passo 3: Adicionar no GitHub**
1. No GitHub: https://github.com/Uptax-creator/uptax-flow
2. **Settings** → **Secrets and variables** → **Actions**
3. Adicione dois secrets:
   ```
   CLOUDFLARE_API_TOKEN = seu-token-aqui
   CLOUDFLARE_ACCOUNT_ID = seu-id-aqui
   ```

---

## ✅ **Checklist Completa**

### **Cloudflare Pages Setup**
- [ ] Conta Cloudflare criada
- [ ] Projeto Pages criado
- [ ] GitHub conectado
- [ ] Build command: `pnpm run build`
- [ ] Output dir: `build/client`
- [ ] NODE_VERSION = 18
- [ ] PNPM_VERSION = 9.4.0
- [ ] AUTH_SECRET configurado
- [ ] Primeiro deploy bem-sucedido

### **GitHub Secrets Setup**
- [ ] API Token criado no Cloudflare
- [ ] Account ID copiado
- [ ] CLOUDFLARE_API_TOKEN adicionado no GitHub
- [ ] CLOUDFLARE_ACCOUNT_ID adicionado no GitHub
- [ ] Push de teste funcionando

---

## 🚨 **Dicas Importantes**

### **Sobre o Build Command**
```bash
# ❌ ERRADO (da primeira vez)
npm run build

# ✅ CORRETO (para este projeto)
pnpm run build
```

### **Variáveis Esquecidas**
A variável que você não lembrou provavelmente era:
- `PNPM_VERSION = 9.4.0` (gerenciador de pacotes)
- Ou `COMPATIBILITY_DATE = 2024-07-01` (Cloudflare Workers)

### **Gerador de AUTH_SECRET**
```bash
# No terminal, gere uma string segura:
openssl rand -base64 32
```

---

## 📊 **Fluxo de Deploy**

```
1. Manual (Primeira vez):
   GitHub → Cloudflare Pages UI → Build → Deploy

2. Automático (Após secrets):
   Git Push → GitHub Actions → Cloudflare API → Deploy
```

---

## 🆘 **Troubleshooting**

### **Erro: "pnpm: command not found"**
- Adicione `PNPM_VERSION = 9.4.0` nas variáveis

### **Erro: "Node version X required"**
- Adicione `NODE_VERSION = 18` nas variáveis

### **Build falha com "AUTH_SECRET required"**
- Adicione `AUTH_SECRET` com valor aleatório seguro

### **Deploy manual funciona, automático não**
- Verifique os GitHub Secrets
- Confirme que o API Token tem permissões corretas

---

**Pronto para começar?** Siga a FASE 1 primeiro, depois volte para a FASE 2!