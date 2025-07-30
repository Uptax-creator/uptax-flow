# 🔐 GitHub Secrets Configuration Guide

## 📋 **O que são GitHub Secrets?**

GitHub Secrets são variáveis sensíveis (como senhas e tokens) que ficam criptografadas no GitHub e são usadas durante o deploy automático. Elas NUNCA aparecem em logs ou no código.

## 🎯 **Por que precisamos delas?**

Quando você faz um push para o GitHub, o GitHub Actions executa automaticamente o deploy para o Cloudflare Pages. Para isso funcionar, o GitHub precisa ter permissão para acessar sua conta Cloudflare.

## 📸 **Passo a Passo com Imagens**

### **Passo 1: Obter Cloudflare API Token**

1. **Acesse o Cloudflare Dashboard**
   - Vá para: https://dash.cloudflare.com/profile/api-tokens
   - Faça login com sua conta

2. **Criar um Token**
   - Clique em **"Create Token"**
   - Escolha **"Custom token"**
   - Configure as permissões:
     ```
     Account - Cloudflare Pages:Edit
     Account - Account Settings:Read
     Zone - Zone Settings:Read (se usar domínio customizado)
     ```
   - Clique em **"Continue to summary"**
   - Clique em **"Create Token"**
   - **COPIE O TOKEN AGORA** (ele só aparece uma vez!)
   - Exemplo do token: `pJDn5X8kQvh3_AbCdEfGhIjKlMnOpQrStUvWxYz`

### **Passo 2: Obter Cloudflare Account ID**

1. **No Dashboard do Cloudflare**
   - Vá para qualquer domínio (ou crie um gratuito se não tiver)
   - Na barra lateral direita, procure por **"Account ID"**
   - Copie o ID (parece com: `f037e56e89293a057740de681ac9abbe`)

### **Passo 3: Adicionar Secrets no GitHub**

1. **Acesse seu repositório no GitHub**
   - URL: https://github.com/Uptax-creator/uptax-flow

2. **Vá para Settings**
   - Clique na aba **"Settings"** no topo do repositório
   - ⚠️ Nota: Se não aparecer "Settings", você precisa ser o dono do repositório

3. **Navegue até Secrets**
   - No menu lateral esquerdo, procure por **"Secrets and variables"**
   - Clique em **"Actions"**

4. **Adicione o primeiro Secret (API Token)**
   - Clique no botão verde **"New repository secret"**
   - Preencha:
     - **Name**: `CLOUDFLARE_API_TOKEN`
     - **Value**: Cole o token que você copiou no Passo 1
   - Clique em **"Add secret"**

5. **Adicione o segundo Secret (Account ID)**
   - Clique novamente em **"New repository secret"**
   - Preencha:
     - **Name**: `CLOUDFLARE_ACCOUNT_ID`
     - **Value**: Cole o Account ID do Passo 2
   - Clique em **"Add secret"**

## ✅ **Verificação**

Após adicionar, você verá algo assim na página de Secrets:

```
Repository secrets (2)
├── CLOUDFLARE_ACCOUNT_ID    Updated now
└── CLOUDFLARE_API_TOKEN      Updated now
```

## 🚨 **Importante**

1. **Segurança**
   - NUNCA compartilhe esses valores
   - NUNCA coloque no código
   - NUNCA commite no Git

2. **Se errar**
   - Você pode editar clicando em "Update"
   - Ou deletar e criar novamente

3. **Não funcionou?**
   - Verifique se copiou os valores completos
   - Confirme que os nomes estão EXATAMENTE como mostrado
   - O API Token deve ter as permissões corretas

## 🔄 **Como o GitHub Actions usa os Secrets**

No arquivo `.github/workflows/deploy.yaml`, temos:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}    # <-- Usa o secret aqui
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}  # <-- E aqui
```

O GitHub automaticamente substitui `${{ secrets.NOME }}` pelos valores reais durante o deploy.

## 📊 **Fluxo Completo**

1. Você faz push → 
2. GitHub Actions inicia → 
3. Usa os Secrets para autenticar → 
4. Deploy no Cloudflare Pages

## 🆘 **Problemas Comuns**

### **"Bad credentials" ou "Authentication failed"**
- Token expirou ou está incorreto
- Refaça o Passo 1 e atualize o Secret

### **"Account ID not found"**
- Account ID está incorreto
- Verifique o formato (32 caracteres hexadecimais)

### **"Insufficient permissions"**
- Token não tem as permissões necessárias
- Crie um novo token com as permissões corretas

## 📝 **Resumo Rápido**

1. **Cloudflare**: Criar API Token + Copiar Account ID
2. **GitHub**: Settings → Secrets → Actions → New repository secret
3. **Adicionar**: 
   - `CLOUDFLARE_API_TOKEN` = seu token
   - `CLOUDFLARE_ACCOUNT_ID` = seu account id
4. **Pronto**: Agora o deploy automático funcionará!

---

**Dúvidas?** Os Secrets são como "senhas" que o GitHub usa para fazer deploy no Cloudflare sem expor suas credenciais!