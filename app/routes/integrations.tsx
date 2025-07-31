import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData, Link, Form } from '@remix-run/react'
import { useState } from 'react'
import { createSessionStorage, requireUser } from '~/lib/auth/session'
import { LLM_PROVIDERS, DEFAULT_LLM_CONFIG, type LLMConfigForm } from '~/lib/integrations/llm-config'
import { DEFAULT_MCP_SERVERS, mcpManager, type MCPServer } from '~/lib/integrations/mcp-config'
import MCPToolTester from '~/components/mcp/MCPToolTester'
import MCPContextTester from '~/components/mcp/MCPContextTester'

export async function loader({ request, context }: LoaderFunctionArgs) {
  const sessionStorage = createSessionStorage(context.cloudflare.env.AUTH_SECRET)
  const user = await requireUser(sessionStorage, request)
  
  return json({ 
    user,
    llmProviders: LLM_PROVIDERS,
    mcpServers: DEFAULT_MCP_SERVERS
  })
}

export default function Integrations() {
  const { user, llmProviders, mcpServers } = useLoaderData<typeof loader>()
  const [activeTab, setActiveTab] = useState<'llm' | 'mcp'>('llm')
  const [llmConfig, setLlmConfig] = useState<LLMConfigForm>(DEFAULT_LLM_CONFIG)
  const [mcpServers2, setMcpServers] = useState<MCPServer[]>(mcpServers)
  
  const handleLLMConfigChange = (field: keyof LLMConfigForm, value: any) => {
    setLlmConfig(prev => ({ ...prev, [field]: value }))
  }
  
  const testMCPConnection = async (serverId: string) => {
    const success = await mcpManager.testConnection(serverId)
    
    setMcpServers(prev => 
      prev.map(server => 
        server.id === serverId 
          ? { ...server, status: success ? 'connected' : 'error' as const }
          : server
      )
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-xl font-semibold">UpTax Flow</Link>
              <div className="flex space-x-4">
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">Dashboard</Link>
                <Link to="/integrations" className="text-indigo-600 font-medium">Integrations</Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name || user.email}</span>
              <Form method="post" action="/auth/logout">
                <button type="submit" className="text-gray-500 hover:text-gray-700">Logout</button>
              </Form>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600 mt-2">Configure your AI providers and business system connections</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('llm')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'llm'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🤖 AI Providers (LLMs)
              </button>
              <button
                onClick={() => setActiveTab('mcp')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'mcp'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔗 Business Systems (MCP)
              </button>
            </nav>
          </div>
          
          {/* LLM Configuration Tab */}
          {activeTab === 'llm' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">AI Provider Configuration</h2>
                <p className="text-gray-600 mb-6">
                  Configure your AI providers for workflow suggestions and automation. 
                  You can use the same API keys from your LLM Suite.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Provider Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI Provider
                    </label>
                    <select
                      value={llmConfig.provider}
                      onChange={(e) => handleLLMConfigChange('provider', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {Object.values(llmProviders).map(provider => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Model Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <select
                      value={llmConfig.model}
                      onChange={(e) => handleLLMConfigChange('model', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {llmProviders[llmConfig.provider]?.models.map(model => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* API Key */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={llmConfig.apiKey}
                      onChange={(e) => handleLLMConfigChange('apiKey', e.target.value)}
                      placeholder="Enter your API key from LLM Suite"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Advanced Settings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Temperature (0-2)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={llmConfig.temperature}
                      onChange={(e) => handleLLMConfigChange('temperature', parseFloat(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100000"
                      value={llmConfig.maxTokens}
                      onChange={(e) => handleLLMConfigChange('maxTokens', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Save Configuration
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* MCP Configuration Tab */}
          {activeTab === 'mcp' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Business System Connections</h2>
                <p className="text-gray-600 mb-6">
                  Connect to your existing MCP servers (Omie, Nibo) running from your LLM Suite.
                </p>
                
                <div className="space-y-4">
                  {mcpServers2.map(server => (
                    <div key={server.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            server.status === 'connected' ? 'bg-green-400' :
                            server.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
                          }`} />
                          <div>
                            <h3 className="font-medium">{server.name}</h3>
                            <p className="text-sm text-gray-500">{server.description}</p>
                            <p className="text-xs text-gray-400 mt-1">Endpoint: {server.endpoint}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            server.status === 'connected' ? 'bg-green-100 text-green-800' :
                            server.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {server.status}
                          </span>
                          <button
                            onClick={() => testMCPConnection(server.id)}
                            className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                          >
                            Test
                          </button>
                        </div>
                      </div>
                      
                      {/* Tools List */}
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Available Tools ({server.tools.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {server.tools.slice(0, 4).map(tool => (
                            <div key={tool.name} className="bg-gray-50 px-2 py-1 rounded text-xs">
                              {tool.name}
                            </div>
                          ))}
                          {server.tools.length > 4 && (
                            <div className="bg-gray-50 px-2 py-1 rounded text-xs text-gray-500">
                              +{server.tools.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Add Custom MCP Server
                  </button>
                </div>
              </div>
              
              {/* MCP Context Tester */}
              <MCPContextTester openRouterApiKey={llmConfig.provider === 'openrouter' ? llmConfig.apiKey : undefined} />
              
              {/* MCP Tool Tester */}
              <MCPToolTester servers={mcpServers2} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}