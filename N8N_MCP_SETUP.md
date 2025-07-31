# 🔧 N8N MCP Setup - Configuração Rápida

## **1. Verificar N8N em Execução**
```bash
# Terminal 1 - Verificar status
curl http://localhost:5678/healthz

# Resposta esperada:
{"status":"ok"}
```

## **2. Acessar UpTax Flow Chat**
```bash
# Browser
http://localhost:5175/chat

# Ou pela página inicial:
http://localhost:5175/ → Clique em "🤖 Try Chat"
```

## **3. Configuração do N8N MCP Server**

### **Opção A: Via Interface (Recomendado)**
1. Acesse: http://localhost:5175/integrations
2. Clique na aba "🔗 Business Systems (MCP)"
3. Encontre "N8N Workflows" na lista
4. Clique em "Test" para verificar conexão
5. Status deve mudar para "connected" ✅

### **Opção B: Via Chat Direto**
Cole este prompt no chat:
```
Configure e teste a conexão com o N8N MCP em http://localhost:5678/api/v1. 
Verifique se há workflows disponíveis e me mostre o status da conexão.
```

## **4. Estrutura do N8N MCP**

O N8N MCP já está configurado com as seguintes ferramentas:

```typescript
// Ferramentas disponíveis:
- list_workflows      // Listar todos os workflows
- get_workflow       // Obter detalhes de um workflow
- execute_workflow   // Executar um workflow
- create_workflow    // Criar novo workflow
- update_workflow    // Atualizar workflow existente
- get_execution      // Obter detalhes de execução
```

## **5. Teste Rápido**

Use este prompt simples para validar:
```
Liste todos os workflows N8N disponíveis
```

Resultado esperado:
- ✅ Conexão estabelecida
- ✅ Lista de workflows retornada
- ✅ "Omie MCP Integration - Corrigido" deve aparecer

## **6. Context Mapping Automático**

O sistema usa AI (Claude 3.5 Sonnet via OpenRouter) para mapear automaticamente suas solicitações para as ferramentas certas do MCP.

Exemplos de mapeamento:
- "ver workflows" → `list_workflows`
- "executar Omie integration" → `execute_workflow` + workflow_id
- "criar automação" → `create_workflow` + configurações

## **7. Monitoramento em Tempo Real**

Durante a execução, você verá:
```json
{
  "status": "executing",
  "node": "HTTP Request",
  "progress": 45,
  "logs": ["Starting execution...", "Fetching data..."]
}
```

## **8. Troubleshooting Comum**

### **Erro: "Unauthorized"**
```bash
# N8N pode precisar de autenticação desabilitada para testes
# Edite ~/.n8n/config e adicione:
export N8N_BASIC_AUTH_ACTIVE=false
export N8N_PUSH_BACKEND=websocket

# Reinicie N8N
n8n start
```

### **Erro: "Connection refused"**
```bash
# Verifique se N8N está rodando
ps aux | grep n8n

# Se não estiver, inicie:
n8n start
```

### **Erro: "No workflows found"**
1. Acesse http://localhost:5678
2. Crie um workflow de teste manualmente
3. Salve e ative o workflow
4. Tente novamente no chat

## **9. Fluxo de Teste Completo**

1. ✅ N8N rodando (localhost:5678)
2. ✅ UpTax Flow rodando (localhost:5175)
3. ✅ Acessar Chat
4. ✅ Usar prompts do arquivo N8N_MCP_TEST_PROMPTS.md
5. ✅ Validar resultados

---

**Pronto!** Agora você pode usar os prompts em `/N8N_MCP_TEST_PROMPTS.md` no chat para testar todas as funcionalidades do N8N MCP.