# 🧠 N8N AI Business Agent - UpTax Manifesto Aligned

**Data**: 31/07/2025  
**Objetivo**: Transformar N8N em Agente AI Especialista em Planos de Negócios  
**Alinhamento**: Manifesto UpTax - AI-First para Contadores Brasileiros  

---

## 🎯 **PROMPT MASTER - COPIE E COLE NO CHAT**

```
Edite o workflow "Omie MCP Integration - Corrigido" para transformá-lo em um Agente AI Especialista em Planos de Negócios para Contadores Brasileiros.

O workflow deve:

1. RECEBER PERGUNTAS sobre:
   - Análise fiscal e tributária
   - Planejamento tributário (Simples Nacional vs Lucro Real/Presumido)
   - Projeções de crescimento e faturamento
   - Análise de custos e margem
   - Compliance fiscal (SPED, NFe, ICMS)
   - Estratégias de redução legal de impostos

2. PROCESSAR COM AI:
   - Buscar dados relevantes no Omie (faturamento, custos, impostos pagos)
   - Analisar histórico fiscal dos últimos 12 meses
   - Identificar padrões e oportunidades
   - Calcular cenários alternativos
   - Gerar recomendações baseadas em dados

3. RESPONDER COM:
   - Análise detalhada em português brasileiro
   - Números e projeções específicas
   - Comparativo de regimes tributários
   - Ações recomendadas com prazo
   - Alertas de compliance e prazos fiscais
   - ROI estimado de cada recomendação

4. ESTRUTURA DO WORKFLOW:
   - Webhook (recebe pergunta) → 
   - OpenRouter/Claude (processa contexto) → 
   - Omie MCP (busca dados) → 
   - BAML Functions (cálculos fiscais) → 
   - AI Analysis (gera insights) → 
   - Response (plano estruturado)

5. EXEMPLO DE INTERAÇÃO:
   Pergunta: "Qual o melhor regime tributário para minha empresa que fatura R$ 300k/mês?"
   
   Resposta: Plano completo com:
   - Análise atual (impostos pagos, margem líquida)
   - Simulação Simples Nacional vs Lucro Presumido
   - Economia projetada
   - Passos para migração
   - Cronograma de implementação

Configure o workflow para ser um verdadeiro consultor fiscal AI.
```

---

## 💼 **CASOS DE USO ESPECÍFICOS - PROMPTS ADICIONAIS**

### **1. Análise de Regime Tributário**
```
Analise os dados da empresa no Omie e me diga:
- Qual regime tributário é mais vantajoso considerando faturamento atual?
- Quanto economizaria mudando de regime?
- Quais os riscos e requisitos para mudança?
- Cronograma ideal para transição?
```

### **2. Planejamento Fiscal Anual**
```
Crie um plano fiscal para 2025 considerando:
- Crescimento projetado de 20%
- Expansão para outros estados (ICMS interestadual)
- Contratação de 5 novos funcionários
- Investimento em tecnologia (benefícios fiscais)
Me dê números específicos e ações mês a mês.
```

### **3. Análise de Compliance**
```
Verifique minha situação de compliance fiscal:
- Obrigações acessórias em dia?
- Riscos identificados no SPED?
- Inconsistências entre NFe emitidas e declarações?
- Plano de regularização se necessário
```

### **4. Otimização de Impostos**
```
Como posso reduzir legalmente minha carga tributária?
Analise:
- Mix de produtos/serviços e suas alíquotas
- Benefícios fiscais não utilizados
- Créditos de ICMS não aproveitados
- Estratégias de elisão fiscal aplicáveis
```

### **5. Projeção de Fluxo de Caixa Tributário**
```
Projete meu fluxo de caixa tributário para os próximos 6 meses:
- Impostos a pagar por mês
- Datas de vencimento
- Impacto no capital de giro
- Estratégias de gestão de caixa
```

---

## 🔧 **CONFIGURAÇÃO TÉCNICA DO WORKFLOW N8N**

### **Nodes Necessários:**

1. **Webhook Node**
   ```json
   {
     "name": "Recebe Pergunta Business",
     "type": "webhook",
     "path": "business-advisor",
     "method": "POST"
   }
   ```

2. **OpenRouter Node (HTTP Request)**
   ```json
   {
     "name": "AI Analysis",
     "url": "https://openrouter.ai/api/v1/chat/completions",
     "headers": {
       "Authorization": "Bearer sk-or-v1-xxx",
       "X-Model": "anthropic/claude-3.5-sonnet"
     }
   }
   ```

3. **Omie MCP Node (Function)**
   ```javascript
   // Buscar dados fiscais
   const omieData = await $mcpExecute('omie', 'consultar_contas_pagar', {
     status_titulo: 'todos',
     periodo: lastMonths(12)
   });
   ```

4. **BAML Calculation Node**
   ```python
   @baml_function
   def calcular_melhor_regime(faturamento, custos, tipo_atividade):
       # Lógica específica brasileira
       # Simples Nacional vs Lucro Real vs Lucro Presumido
       return optimal_regime_analysis
   ```

5. **Response Formatter**
   ```javascript
   // Formata resposta estruturada
   return {
     analise: detailedAnalysis,
     numeros: specificNumbers,
     recomendacoes: actionableItems,
     cronograma: timeline,
     roi: estimatedSavings
   }
   ```

---

## 📊 **TEMPLATES DE RESPOSTA DO AGENTE**

### **Template: Análise de Regime Tributário**
```markdown
## 📊 Análise Tributária - [Nome da Empresa]

### 💰 Situação Atual
- Regime: [Atual]
- Faturamento Médio: R$ [valor]/mês
- Carga Tributária: [%] (R$ [valor])
- Margem Líquida: [%]

### 🔄 Simulação de Regimes
| Regime | Impostos | Economia | Viabilidade |
|--------|----------|----------|-------------|
| Simples Nacional | R$ X | R$ Y | ✅/❌ |
| Lucro Presumido | R$ X | R$ Y | ✅/❌ |
| Lucro Real | R$ X | R$ Y | ✅/❌ |

### 🎯 Recomendação
[Regime recomendado] com economia estimada de R$ [valor]/ano

### 📋 Plano de Ação
1. [Ação 1] - Prazo: [data]
2. [Ação 2] - Prazo: [data]
3. [Ação 3] - Prazo: [data]

### ⚠️ Alertas Importantes
- [Alerta 1]
- [Alerta 2]
```

---

## 🚀 **ATIVAÇÃO IMEDIATA**

1. **Cole o PROMPT MASTER no chat**
2. **Sistema vai editar o workflow automaticamente**
3. **Teste com uma pergunta real de negócio**
4. **Receba análise completa com números**

---

## 💡 **DIFERENCIAL UPTAX**

Este agente AI é único porque:
- ✅ Entende legislação fiscal brasileira
- ✅ Acessa dados reais do Omie/Nibo
- ✅ Calcula cenários específicos
- ✅ Gera planos acionáveis
- ✅ ROI mensurável

**Alinhado 100% com o Manifesto UpTax**: Transformando contadores em consultores estratégicos através de AI especializada.