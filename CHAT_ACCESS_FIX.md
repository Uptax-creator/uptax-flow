# 🔧 UpTax Flow - Fix Chat Access Issue

## 🚨 Problema Identificado
- **Dashboard**: 404 error (AUTH_SECRET missing)
- **Chat**: Não acessível (requer dashboard funcionando)

## ✅ Solução - Configurar AUTH_SECRET

### No Dashboard Cloudflare Pages:
1. **Workers & Pages** → **uptax-flow**
2. **Settings** → **Environment Variables**
3. **Add variable:**
   ```
   Name: AUTH_SECRET
   Value: sua-chave-secreta-aqui-32-chars-min
   ```

### Gerar AUTH_SECRET (opcional):
```bash
# Gerar chave aleatória
openssl rand -base64 32
```

## 🚀 Deploy após configurar:
- **Settings** → **Deployments** → **Retry deployment**

## 🎯 Resultado Esperado:
- **`/dashboard`** funcionará
- **Chat** acessível via dashboard
- **Login** com demo@uptax.com.br / demo123

---

## ⚡ Alternativa Rápida - Bypass Auth

Se quiser testar imediatamente, posso criar uma versão sem autenticação.