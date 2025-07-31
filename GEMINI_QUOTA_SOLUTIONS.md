# 🚨 Gemini Quota Exceeded - Soluções

## Problema Atual
- ❌ Gemini 1.5 Pro: Quota FREE excedida
- ❌ Rate limits: requests/day e requests/minute
- ❌ Input token limits atingidos

## Soluções Imediatas

### 1. Usar Gemini Flash (Mais Barato)
```
Model: gemini-1.5-flash
- Menos tokens por request
- Limites mais generosos
- Mesma qualidade para chat básico
```

### 2. Aguardar Reset (29s segundo último erro)
- Quotas resetam por minuto
- Aguardar 30-60 segundos entre requests
- Implementar retry automático

### 3. Alternativas de Provider
- **Claude via OpenRouter**: Precisa créditos
- **OpenAI**: Precisaria configurar
- **Local Ollama**: Para desenvolvimento

### 4. Upgrade Gemini (Recomendado)
- Gemini Pro: $0.50/1M tokens
- Sem rate limits do free tier
- Melhor para produção

## Solução Temporária Implementada
- ✅ Mudado default para Gemini 1.5 Flash
- ✅ Mensagens de erro melhoradas
- ✅ API REST (igual N8N)

## Para Resolver Definitivamente
1. **Billing no Google AI Studio**
2. **Ou usar OpenRouter** (mais providers)
3. **Ou implementar rate limiting/retry**