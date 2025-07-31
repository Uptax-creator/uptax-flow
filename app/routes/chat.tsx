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
  const [apiKey, setApiKey] = useState('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')
  const [showConfig, setShowConfig] = useState(false)
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet')
  const [provider, setProvider] = useState<'openrouter' | 'gemini'>('openrouter')
  const [geminiApiKey, setGeminiApiKey] = useState('')

  // Update model when provider changes
  const handleProviderChange = (newProvider: 'openrouter' | 'gemini') => {
    setProvider(newProvider)
    if (newProvider === 'openrouter') {
      setSelectedModel('anthropic/claude-3.5-sonnet')
    } else {
      setSelectedModel('gemini-1.5-pro')
    }
  }

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
      const endpoint = provider === 'openrouter' ? '/api/chat/openrouter' : '/api/chat/gemini'
      const apiKeyToUse = provider === 'openrouter' ? apiKey : geminiApiKey
      
      // API call based on provider
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: 'Você é o assistente UpTax Flow, especializado em automação de workflows de negócios e integração com sistemas MCP (Omie, Nibo, etc.). Seja útil e direto.' },
            ...messages.filter(m => m.role !== 'system'),
            { role: 'user', content: currentInput }
          ],
          apiKey: apiKeyToUse,
          temperature: 0.7,
          maxTokens: 1000
        })
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: data.response || 'Desculpe, não consegui processar sua mensagem.'
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        // Show specific error
        const errorMsg = data.error || 'API call failed'
        const details = data.details ? `\nDetalhes: ${typeof data.details === 'string' ? data.details : JSON.stringify(data.details)}` : ''
        throw new Error(`${errorMsg}${details}`)
      }
    } catch (error) {
      // Show error details
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `❌ Erro ao conectar com OpenRouter:\n${errorMessage}\n\n💡 Dicas:\n1. Verifique sua API key no botão ⚙️ Config\n2. Certifique-se que a chave começa com "sk-or-v1-"\n3. Verifique se tem créditos em openrouter.ai`
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
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>⚙️</span>
              <span>Config</span>
            </button>
            <Link to="/" className="text-indigo-600 hover:text-indigo-700">Home</Link>
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700">Dashboard</Link>
            <Link to="/integrations" className="text-indigo-600 hover:text-indigo-700">Integrations</Link>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Config Panel */}
        {showConfig && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="font-semibold mb-4">🔧 Configuração do Chat</h3>
            
            {/* Provider Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="openrouter"
                    checked={provider === 'openrouter'}
                    onChange={(e) => handleProviderChange(e.target.value as 'openrouter')}
                    className="mr-2"
                  />
                  <span>OpenRouter</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="gemini"
                    checked={provider === 'gemini'}
                    onChange={(e) => handleProviderChange(e.target.value as 'gemini')}
                    className="mr-2"
                  />
                  <span>Google Gemini</span>
                </label>
              </div>
            </div>
            
            {/* Model Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {provider === 'openrouter' ? (
                  <>
                    <optgroup label="Anthropic">
                      <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                      <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
                      <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                    </optgroup>
                    <optgroup label="OpenAI">
                      <option value="openai/gpt-4o">GPT-4o</option>
                      <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </optgroup>
                    <optgroup label="Google">
                      <option value="google/gemini-pro-1.5">Gemini 1.5 Pro</option>
                      <option value="google/gemini-flash-1.5">Gemini 1.5 Flash</option>
                    </optgroup>
                    <optgroup label="Meta">
                      <option value="meta-llama/llama-3.2-90b-vision-instruct">Llama 3.2 90B</option>
                      <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
                    </optgroup>
                    <optgroup label="Mistral">
                      <option value="mistralai/mistral-large">Mistral Large</option>
                      <option value="mistralai/mixtral-8x7b">Mixtral 8x7B</option>
                    </optgroup>
                  </>
                ) : (
                  <>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  </>
                )}
              </select>
            </div>
            
            {/* API Key Input */}
            <div className="space-y-2">
              {provider === 'openrouter' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key (OpenRouter)
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    <p>• Obtenha em <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">openrouter.ai/keys</a></p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key (Gemini)
                  </label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIza..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    <p>• Obtenha em <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">makersuite.google.com</a></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
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
            <li>✅ Provider: {provider === 'openrouter' ? 'OpenRouter' : 'Google Gemini'}</li>
            <li>🤖 Modelo: {selectedModel}</li>
            <li>💡 Configure suas chaves API no botão ⚙️ Config</li>
          </ul>
        </div>
      </div>
    </div>
  )
}