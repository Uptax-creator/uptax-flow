import { useState } from 'react'
import { mcpContextMapper, type MCPContextMapping } from '~/lib/integrations/mcp-context-mapper'

interface MCPContextTesterProps {
  openRouterApiKey?: string
}

export default function MCPContextTester({ openRouterApiKey }: MCPContextTesterProps) {
  const [query, setQuery] = useState('')
  const [mapping, setMapping] = useState<MCPContextMapping | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testContextMapping = async () => {
    if (!query.trim()) return
    
    setLoading(true)
    setError('')
    setMapping(null)

    try {
      if (openRouterApiKey) {
        mcpContextMapper.setApiKey(openRouterApiKey)
      }
      
      const result = await mcpContextMapper.mapUserIntentToMCP(query)
      setMapping(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Context mapping failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      testContextMapping()
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50'
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const exampleQueries = [
    "Mostre os clientes em atraso",
    "Criar uma nova task para o time",
    "Listar todas as empresas no sistema",
    "Configurar workflow de automação",
    "Buscar issues em aberto no Jira",
    "Documentar as melhores práticas",
    "Integrar APIs do sistema",
    "Ver relatórios contábeis"
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🧠 AI Context Mapping Tester</h2>
      <p className="text-gray-600 mb-6">
        Test how AI maps natural language queries to the appropriate MCP server and tool.
        Powered by OpenRouter + Claude 3.5 Sonnet.
      </p>

      {/* API Key Status */}
      <div className="mb-4 p-3 rounded-md bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${openRouterApiKey ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-sm font-medium">
            OpenRouter API: {openRouterApiKey ? 'Connected' : 'Not configured'}
          </span>
        </div>
        {!openRouterApiKey && (
          <p className="text-xs text-gray-500 mt-1">
            Configure OpenRouter API key in the Integrations tab for AI-powered mapping
          </p>
        )}
      </div>

      {/* Query Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Natural Language Query
        </label>
        <div className="flex space-x-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your query in natural language... (e.g., 'Show me overdue invoices')"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={2}
          />
          <button
            onClick={testContextMapping}
            disabled={loading || !query.trim()}
            className={`px-4 py-2 rounded-md font-medium ${
              loading || !query.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Mapping...' : 'Map'}
          </button>
        </div>
      </div>

      {/* Example Queries */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Example Queries:</h3>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((exampleQuery, index) => (
            <button
              key={index}
              onClick={() => setQuery(exampleQuery)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            >
              {exampleQuery}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-red-800 font-medium">Error</h4>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Mapping Results */}
      {mapping && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">🎯 AI Mapping Result</h3>
          
          {/* Intent & Confidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-sm text-gray-700">Intent Detected</h4>
              <p className="text-gray-900 mt-1">{mapping.intent}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="font-medium text-sm text-gray-700">Confidence Score</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getConfidenceColor(mapping.confidence)}`}>
                  {mapping.confidence}%
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      mapping.confidence >= 80 ? 'bg-green-400' :
                      mapping.confidence >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${mapping.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Server & Tool */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-sm text-blue-700">Suggested Server</h4>
              <p className="text-blue-900 mt-1 font-medium">{mapping.suggestedServer}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <h4 className="font-medium text-sm text-green-700">Suggested Tool</h4>
              <p className="text-green-900 mt-1 font-medium">{mapping.suggestedTool}</p>
            </div>
          </div>

          {/* Parameters */}
          {Object.keys(mapping.parameters).length > 0 && (
            <div className="bg-purple-50 p-3 rounded-md">
              <h4 className="font-medium text-sm text-purple-700">Extracted Parameters</h4>
              <pre className="text-purple-900 text-sm mt-1 overflow-auto">
                {JSON.stringify(mapping.parameters, null, 2)}
              </pre>
            </div>
          )}

          {/* Reasoning */}
          <div className="bg-yellow-50 p-3 rounded-md">
            <h4 className="font-medium text-sm text-yellow-700">AI Reasoning</h4>
            <p className="text-yellow-900 text-sm mt-1">{mapping.reasoning}</p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={() => {
                // This would trigger the actual MCP execution
                alert(`Would execute: ${mapping.suggestedServer}.${mapping.suggestedTool}(${JSON.stringify(mapping.parameters)})`)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
            >
              ▶ Execute Suggested Action
            </button>
          </div>
        </div>
      )}

      {/* Available Servers Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-700 mb-3">📡 Available MCP Servers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'omie', name: 'Omie ERP', category: 'Business', tools: 49 },
            { id: 'nibo', name: 'Nibo Accounting', category: 'Business', tools: 37 },
            { id: 'atlas-task', name: 'Atlas Tasks', category: 'Development', tools: '?' },
            { id: 'n8n-mcp', name: 'N8N Workflows', category: 'Automation', tools: '?' },
            { id: 'jira', name: 'Jira', category: 'Project Mgmt', tools: '?' },
            { id: 'confluence', name: 'Confluence', category: 'Project Mgmt', tools: '?' },
            { id: 'composio', name: 'Composio', category: 'Automation', tools: '?' },
            { id: 'context7', name: 'Context7', category: 'Development', tools: '?' }
          ].map(server => (
            <div key={server.id} className="bg-gray-50 p-2 rounded text-center">
              <div className="font-medium text-sm">{server.name}</div>
              <div className="text-xs text-gray-500">{server.category}</div>
              <div className="text-xs text-gray-400">{server.tools} tools</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}