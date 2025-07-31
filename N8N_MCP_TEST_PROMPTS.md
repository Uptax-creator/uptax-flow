# 🚀 N8N MCP Test Prompts - UpTax Flow Chat

**Data**: 31/07/2025  
**Objetivo**: Testar integração N8N MCP através do chat AI-First  

---

## 📋 **PROMPTS PARA COPIAR E COLAR NO CHAT**

### **1. 🔍 Consultar Workflows Disponíveis**
```
Quero ver todos os workflows disponíveis no N8N. 
Liste os workflows ativos e inativos, mostrando o nome, status e quantidade de nodes de cada um.
```

**Resultado Esperado**: 
- Lista com workflow "Omie MCP Integration - Corrigido"
- Status: Active
- Nodes: Quantidade de nodes no workflow

---

### **2. 📊 Analisar Workflow Específico**
```
Me mostre os detalhes do workflow "Omie MCP Integration - Corrigido".
Quero ver:
- Estrutura dos nodes
- Configurações principais
- Última execução
- Performance metrics
```

**Resultado Esperado**:
- Detalhes completos do workflow
- Lista de nodes e suas conexões
- Métricas de execução

---

### **3. ▶️ Executar Workflow**
```
Execute o workflow "Omie MCP Integration - Corrigido" e me mostre os resultados em tempo real.
Capture todos os logs e outputs de cada node.
```

**Resultado Esperado**:
- Execução iniciada
- Logs em tempo real
- Resultado de cada node
- Status final da execução

---

### **4. 📝 Criar Novo Workflow de Teste**
```
Crie um novo workflow N8N chamado "UpTax Flow Test Integration" com os seguintes nodes:
1. Start node
2. HTTP Request para verificar status do Omie MCP (http://localhost:3000)
3. Set node para processar resposta
4. Webhook response com resultado

Configure as conexões entre os nodes automaticamente.
```

**Resultado Esperado**:
- Workflow criado com sucesso
- Nodes configurados e conectados
- Workflow ativado para execução

---

### **5. 🔄 Workflow de Integração Completa**
```
Crie um workflow que integre Omie MCP com N8N para:
1. Buscar clientes no Omie (listar_clientes)
2. Processar dados com filtros
3. Criar tarefas no Atlas-task para follow-up
4. Enviar notificação de conclusão

Use os MCPs disponíveis: omie, atlas-task, n8n-mcp
```

**Resultado Esperado**:
- Workflow multi-MCP criado
- Integração entre sistemas configurada
- Fluxo de dados mapeado

---

### **6. 📈 Monitoramento e Métricas**
```
Me mostre as métricas de execução dos workflows N8N dos últimos 7 dias:
- Taxa de sucesso
- Tempo médio de execução
- Erros mais comuns
- Workflows mais executados
```

**Resultado Esperado**:
- Dashboard de métricas
- Gráficos de performance
- Análise de erros
- Recomendações de otimização

---

### **7. 🔧 Editar Workflow Existente**
```
Edite o workflow "Omie MCP Integration - Corrigido":
1. Adicione um node de validação de dados após buscar clientes
2. Configure tratamento de erros em todos os nodes
3. Adicione logging detalhado
4. Implemente retry automático para falhas

Salve e ative o workflow atualizado.
```

**Resultado Esperado**:
- Workflow editado com novos nodes
- Tratamento de erros implementado
- Configurações de retry ativas
- Workflow re-ativado

---

### **8. 🤖 Workflow Inteligente com AI**
```
Crie um workflow N8N inteligente que:
1. Monitore novos clientes no Omie a cada hora
2. Use AI para classificar clientes por potencial
3. Crie tarefas automáticas no Atlas para clientes high-value
4. Gere relatório diário com insights

Configure com execução agendada (cron).
```

**Resultado Esperado**:
- Workflow com AI integration
- Agendamento cron configurado
- Classificação inteligente funcionando
- Automação completa ativa

---

### **9. 🔍 Debug e Troubleshooting**
```
Analise os logs de erro do workflow "Omie MCP Integration - Corrigido".
Identifique:
- Pontos de falha recorrentes
- Problemas de conectividade
- Timeouts ou erros de API
- Sugestões de correção
```

**Resultado Esperado**:
- Análise detalhada de erros
- Identificação de padrões
- Recomendações específicas
- Plano de ação para correções

---

### **10. 🌐 Workflow de Sincronização Multi-Sistema**
```
Desenvolva um workflow master que sincronize dados entre todos os sistemas:
- Omie (clientes e contas)
- Nibo (dados financeiros)
- Atlas-task (projetos e tarefas)
- Jira (issues e sprints)

Configure para rodar diariamente às 6h com relatório de sincronização.
```

**Resultado Esperado**:
- Workflow master criado
- Todos MCPs integrados
- Sincronização configurada
- Relatórios automáticos

---

## 🎯 **COMO USAR ESTES PROMPTS**

1. **Acesse o Chat**: http://localhost:5175/chat
2. **Configure OpenRouter**: Certifique-se que a API key está configurada
3. **Copie e Cole**: Use os prompts acima diretamente no chat
4. **Observe os Resultados**: O sistema deve executar via MCP Context Mapper

---

## 🔧 **TROUBLESHOOTING**

### **Se o N8N MCP não responder:**
```
Verifique o status de todos os MCPs e me mostre:
- Quais estão online/offline
- Últimas tentativas de conexão
- Erros de autenticação
- Como corrigir problemas de conectividade
```

### **Se precisar de autenticação:**
```
Configure as credenciais do N8N MCP:
- API Key: [sua chave aqui]
- Base URL: http://localhost:5678
- Teste a conexão e confirme o status
```

---

## 📊 **VALIDAÇÃO DOS TESTES**

Após executar os prompts, valide:
- ✅ Workflows foram listados corretamente
- ✅ Execuções funcionaram sem erros
- ✅ Novos workflows foram criados
- ✅ Integrações multi-MCP funcionam
- ✅ Monitoramento em tempo real ativo

---

## 🚀 **PRÓXIMOS PASSOS**

Após validar o N8N MCP, teste:
1. **Integração com BAML** (Sprint 3)
2. **Workflows complexos multi-step**
3. **Automações baseadas em eventos**
4. **AI-powered workflow generation**