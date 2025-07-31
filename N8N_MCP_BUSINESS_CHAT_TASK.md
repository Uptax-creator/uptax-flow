# 🤖 Tarefa N8N MCP: Criar Chat AI Business

**Objetivo**: Usar N8N MCP para criar workflow de chat AI especializado em planos de negócios

---

## 📋 **PROMPT PARA EXECUTAR VIA N8N MCP**

Cole este prompt no chat da UpTax Flow:

```
Use o N8N MCP para criar um novo workflow chamado "UpTax Business AI Chat" com a seguinte configuração:

{
  "name": "UpTax Business AI Chat",
  "active": true,
  "nodes": [
    {
      "name": "Business Question Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "parameters": {
        "path": "business-chat",
        "httpMethod": "POST",
        "responseMode": "responseNode",
        "options": {}
      }
    },
    {
      "name": "Prepare AI Context",
      "type": "n8n-nodes-base.set",
      "position": [440, 300],
      "parameters": {
        "values": {
          "string": [
            {
              "name": "ai_role",
              "value": "Você é um consultor especialista em planos de negócios para empresas brasileiras. Foque em análise de mercado, projeções financeiras realistas, estratégias de crescimento, compliance fiscal brasileiro, e oportunidades específicas do mercado nacional. Sempre forneça respostas práticas com números específicos, cronogramas e ações concretas."
            },
            {
              "name": "user_question",
              "value": "={{$json.body.question}}"
            },
            {
              "name": "context",
              "value": "={{$json.body.context || 'Nova conversa sobre plano de negócios'}}"
            }
          ]
        }
      }
    },
    {
      "name": "OpenRouter AI Call",
      "type": "n8n-nodes-base.httpRequest",
      "position": [640, 300],
      "parameters": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "httpMethod": "POST",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "HTTP-Referer",
              "value": "https://uptax.ai"
            },
            {
              "name": "X-Title",
              "value": "UpTax Business Advisor"
            },
            {
              "name": "Authorization",
              "value": "Bearer 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"
            }
          ]
        },
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "={\n  \"model\": \"anthropic/claude-3.5-sonnet\",\n  \"messages\": [\n    {\n      \"role\": \"system\",\n      \"content\": \"{{$json.ai_role}}\"\n    },\n    {\n      \"role\": \"user\",\n      \"content\": \"{{$json.user_question}}\"\n    }\n  ],\n  \"temperature\": 0.7,\n  \"max_tokens\": 2000\n}",
        "options": {}
      }
    },
    {
      "name": "Format Response",
      "type": "n8n-nodes-base.set",
      "position": [840, 300],
      "parameters": {
        "values": {
          "string": [
            {
              "name": "ai_response",
              "value": "={{$json.choices[0].message.content}}"
            },
            {
              "name": "timestamp",
              "value": "={{new Date().toISOString()}}"
            },
            {
              "name": "tokens_used",
              "value": "={{$json.usage.total_tokens}}"
            },
            {
              "name": "model_used",
              "value": "anthropic/claude-3.5-sonnet"
            }
          ]
        }
      }
    },
    {
      "name": "Respond to Chat",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1040, 300],
      "parameters": {
        "options": {},
        "respondBody": "={\n  \"success\": true,\n  \"response\": \"{{$json.ai_response}}\",\n  \"timestamp\": \"{{$json.timestamp}}\",\n  \"tokens_used\": {{$json.tokens_used}},\n  \"model\": \"{{$json.model_used}}\"\n}",
        "responseHeaders": {
          "entries": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        }
      }
    }
  ],
  "connections": {
    "Business Question Webhook": {
      "main": [
        [
          {
            "node": "Prepare AI Context",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare AI Context": {
      "main": [
        [
          {
            "node": "OpenRouter AI Call",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenRouter AI Call": {
      "main": [
        [
          {
            "node": "Format Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Response": {
      "main": [
        [
          {
            "node": "Respond to Chat",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}

Após criar o workflow, ative-o imediatamente e me informe o ID do workflow criado.
```

---

## 🧪 **TESTE IMEDIATO DO WORKFLOW**

Depois de criar, execute este teste via N8N MCP:

```
Execute o workflow "UpTax Business AI Chat" com os seguintes dados de teste:

{
  "question": "Como criar um plano de negócios para uma startup de contabilidade digital no Brasil? Tenho R$ 50.000 de investimento inicial.",
  "context": "Sou contador há 10 anos e quero abrir minha própria empresa de contabilidade digital"
}

Capture todos os logs de execução e me mostre o resultado completo.
```

---

## 📊 **VALIDAÇÃO DOS RESULTADOS**

Após a execução, verifique:

1. **Workflow Criado**
   - ✅ Nome: "UpTax Business AI Chat"
   - ✅ Status: Ativo  
   - ✅ 5 nodes conectados corretamente
   - ✅ Webhook disponível em: /webhook/business-chat

2. **Execução de Teste**
   - ✅ Webhook recebeu dados
   - ✅ AI processou a pergunta
   - ✅ Resposta gerada com conteúdo relevante
   - ✅ Tokens contabilizados
   - ✅ Response formatado em JSON

3. **Qualidade da Resposta**
   - ✅ Contexto brasileiro aplicado
   - ✅ Números específicos incluídos
   - ✅ Ações práticas sugeridas
   - ✅ Cronograma proposto
   - ✅ Considerações fiscais brasileiras

---

## 🔄 **TESTES ADICIONAIS**

Se o primeiro teste funcionar, execute estes:

### **Teste 2: Análise de Viabilidade**
```
{
  "question": "É viável abrir uma fintech focada em MEIs no Brasil? Investimento disponível: R$ 200k",
  "context": "Tenho experiência em tecnologia e quero entrar no mercado financeiro"
}
```

### **Teste 3: Projeção Financeira**
```
{
  "question": "Crie uma projeção financeira para um e-commerce de produtos fitness. Meta: R$ 100k/mês em 12 meses",
  "context": "Já tenho fornecedores e marca definida"
}
```

### **Teste 4: Estratégia de Crescimento**  
```
{
  "question": "Como escalar uma consultoria de marketing digital de R$ 50k/mês para R$ 200k/mês?",
  "context": "Tenho 3 clientes fixos e equipe de 5 pessoas"
}
```

---

## 🎯 **RESULTADO ESPERADO**

Cada teste deve retornar:

```json
{
  "success": true,
  "response": "# 🚀 Plano de Negócios para Contabilidade Digital\n\n## Análise de Mercado...",
  "timestamp": "2025-07-31T...",
  "tokens_used": 1500,
  "model": "anthropic/claude-3.5-sonnet"
}
```

---

## ✅ **PRÓXIMOS PASSOS**

Após validar que o workflow funciona via N8N MCP:

1. **Testar diretamente via curl**:
```bash
curl -X POST http://localhost:5678/webhook/business-chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Como validar uma ideia de startup?", "context": "Nova conversa"}'
```

2. **Integrar na UpTax Flow**:
   - Criar interface web que chama este webhook
   - Adicionar ao menu principal
   - Implementar histórico de conversas

**Pronto para executar o primeiro prompt via N8N MCP?** 🚀