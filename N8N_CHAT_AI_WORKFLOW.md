# 🤖 Workflow N8N: Chat AI para Plano de Negócios

**Objetivo**: Criar um workflow N8N que funcione como chat AI especialista em planos de negócios

---

## 📋 **PROMPT PARA CRIAR O WORKFLOW**

Cole este prompt no chat da UpTax Flow:

```
Crie um novo workflow N8N chamado "AI Business Plan Chat" com a seguinte estrutura:

1. WEBHOOK (Entrada)
   - Path: /chat-business-plan
   - Method: POST
   - Recebe: { "question": "pergunta do usuário", "context": "histórico opcional" }

2. SET NODE (Preparar Contexto)
   - Define o papel do AI como especialista em planos de negócios brasileiros
   - Adiciona contexto sobre legislação fiscal, mercado brasileiro e melhores práticas

3. HTTP REQUEST (OpenRouter AI)
   - URL: https://openrouter.ai/api/v1/chat/completions
   - Headers: 
     - Authorization: Bearer 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
     - HTTP-Referer: https://uptax.ai
     - X-Title: UpTax Business Advisor
   - Body:
     {
       "model": "anthropic/claude-3.5-sonnet",
       "messages": [
         {
           "role": "system",
           "content": "Você é um consultor especialista em planos de negócios para empresas brasileiras. Foque em: análise de mercado, projeções financeiras, estratégias de crescimento, compliance fiscal, e oportunidades específicas do Brasil. Sempre forneça respostas práticas com números e ações específicas."
         },
         {
           "role": "user", 
           "content": "{{pergunta do webhook}}"
         }
       ],
       "temperature": 0.7,
       "max_tokens": 2000
     }

4. SET NODE (Formatar Resposta)
   - Extrai a resposta do AI
   - Adiciona formatação markdown
   - Inclui timestamp e metadados

5. RESPOND TO WEBHOOK
   - Retorna a resposta formatada em JSON
   - Inclui: resposta, timestamp, tokens usados

Configure o workflow para execução imediata e ative-o.
```

---

## 🧪 **TESTE RÁPIDO DO WORKFLOW**

Após criar, teste com este comando no terminal:

```bash
curl -X POST http://localhost:5678/webhook/chat-business-plan \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Como criar um plano de negócios para uma startup de tecnologia no Brasil?"
  }'
```

---

## 💬 **PERGUNTAS DE TESTE PARA O CHAT AI**

### **1. Plano de Negócios Básico**
```json
{
  "question": "Preciso criar um plano de negócios para abrir uma consultoria contábil. O que devo incluir?"
}
```

### **2. Análise de Mercado**
```json
{
  "question": "Qual o tamanho do mercado de software fiscal no Brasil? Quais as principais oportunidades?"
}
```

### **3. Projeção Financeira**
```json
{
  "question": "Como fazer uma projeção financeira realista para uma empresa SaaS B2B no Brasil? Investimento inicial: R$ 500k"
}
```

### **4. Estratégia de Crescimento**
```json
{
  "question": "Quais estratégias de crescimento para uma empresa de e-commerce que fatura R$ 200k/mês?"
}
```

### **5. Análise de Viabilidade**
```json
{
  "question": "É viável abrir uma fintech focada em MEIs no Brasil? Analise prós, contras e investimento necessário."
}
```

---

## 🔄 **EVOLUÇÃO DO WORKFLOW - PRÓXIMOS PASSOS**

### **Fase 2: Adicionar Memória**
```
Adicione ao workflow:
- Code Node para salvar histórico de conversas
- Contexto acumulativo para respostas mais precisas
- Identificação de temas recorrentes
```

### **Fase 3: Integração com Dados**
```
Quando estivermos prontos, adicione:
- Conexão com Omie MCP (dados financeiros reais)
- Conexão com Nibo MCP (análise contábil)
- Cálculos baseados em dados reais da empresa
```

### **Fase 4: Geração de Documentos**
```
Evolua para:
- Gerar PDF do plano de negócios
- Criar apresentações executivas
- Exportar projeções em Excel
```

---

## 🎯 **RESULTADO ESPERADO**

O workflow deve responder como um consultor expert, fornecendo:

1. **Estrutura Clara**
   - Seções do plano de negócios
   - Ordem lógica de desenvolvimento
   - Checklists de validação

2. **Números Específicos**
   - Investimento necessário
   - Projeções de receita
   - Ponto de equilíbrio
   - ROI esperado

3. **Contexto Brasileiro**
   - Legislação aplicável
   - Incentivos fiscais
   - Peculiaridades do mercado
   - Competidores locais

4. **Ações Práticas**
   - Próximos passos
   - Cronograma sugerido
   - Recursos necessários
   - Riscos e mitigações

---

## 🚀 **COMEÇAR AGORA**

1. Cole o prompt de criação no chat
2. Aguarde a confirmação de criação
3. Teste com as perguntas fornecidas
4. Valide as respostas do AI

O workflow será seu primeiro agente AI especializado!