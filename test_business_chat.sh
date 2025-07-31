#!/bin/bash

echo "🚀 Testando UpTax Business AI Chat Workflow"
echo "================================================"

# Test 1: Pergunta sobre plano de negócios
echo ""
echo "📋 Teste 1: Plano de Negócios para Startup"
echo "Pergunta: Como criar um plano de negócios para uma startup de contabilidade digital?"

curl -X POST "http://localhost:5678/webhook/business-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Como criar um plano de negócios para uma startup de contabilidade digital no Brasil? Tenho R$ 50.000 de investimento inicial.",
    "context": "Sou contador há 10 anos e quero abrir minha própria empresa de contabilidade digital"
  }' | jq '.'

echo ""
echo "================================================"

# Test 2: Análise de viabilidade
echo ""
echo "💰 Teste 2: Análise de Viabilidade"
echo "Pergunta: É viável uma fintech para MEIs?"

curl -X POST "http://localhost:5678/webhook/business-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "É viável abrir uma fintech focada em MEIs no Brasil? Investimento disponível: R$ 200k",
    "context": "Tenho experiência em tecnologia e quero entrar no mercado financeiro"
  }' | jq '.'

echo ""
echo "================================================"

# Test 3: Projeção financeira
echo ""
echo "📊 Teste 3: Projeção Financeira"
echo "Pergunta: Projeção para e-commerce fitness"

curl -X POST "http://localhost:5678/webhook/business-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Crie uma projeção financeira para um e-commerce de produtos fitness. Meta: R$ 100k/mês em 12 meses",
    "context": "Já tenho fornecedores e marca definida"
  }' | jq '.'

echo ""
echo "✅ Testes concluídos!"