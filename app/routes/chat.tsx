import { json, type MetaFunction } from '@remix-run/cloudflare'
import { useState } from 'react'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'UpTax Flow - AI Chat' }, 
    { name: 'description', content: 'AI-powered chat interface for UpTax Flow' }
  ]
}

export const loader = () => json({})

export default function Chat() {
  const [messages, setMessages] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([
    {
      id: '1',
      role: 'assistant', 
      content: 'Olá! Sou o assistente UpTax Flow. Como posso ajudar você hoje?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      // Real OpenRouter API call
      const response = await fetch('/api/chat/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            { role: 'system', content: 'Você é o assistente UpTax Flow, especializado em automação de workflows de negócios e integração com sistemas MCP (Omie, Nibo, etc.). Seja útil e direto.' },
            ...messages.filter(m => m.role !== 'system'),
            { role: 'user', content: currentInput }
          ],
          apiKey: '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',
          temperature: 0.7,
          maxTokens: 1000
        })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: data.response || 'Desculpe, não consegui processar sua mensagem.'
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('API call failed')
      }
    } catch (error) {
      // Fallback to demo response
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `Recebi sua mensagem: "${currentInput}". Estou com problemas de conectividade com o OpenRouter no momento. Esta é uma resposta demo enquanto trabalho na correção.`
      }
      setMessages(prev => [...prev, assistantMessage])
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">UpTax Flow Chat</h1>
          <div className="flex space-x-4">
            <Link to="/" className="text-indigo-600 hover:text-indigo-700">Home</Link>
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700">Dashboard</Link>
            <Link to="/integrations" className="text-indigo-600 hover:text-indigo-700">Integrations</Link>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
          
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">🚀 Status do Chat:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>✅ Interface de chat funcionando</li>
            <li>⏳ Integração MCP em desenvolvimento</li>
            <li>✅ Conexão com OpenRouter/Claude 3.5 Sonnet ativa</li>
            <li>💡 Esta é uma versão de demonstração</li>
          </ul>
        </div>
      </div>
    </div>
  )
}