import { useState, useEffect } from 'react'
import { mcpManager, type MCPServer, type MCPTool } from '~/lib/integrations/mcp-config'

interface MCPToolTesterProps {
  servers: MCPServer[]
}

export default function MCPToolTester({ servers }: MCPToolTesterProps) {
  const [selectedServer, setSelectedServer] = useState<string>('')
  const [selectedTool, setSelectedTool] = useState<string>('')
  const [parameters, setParameters] = useState<Record<string, any>>({})
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'testing' | 'connected' | 'error'>>({})

  // Test all server connections on mount
  useEffect(() => {
    const testAllConnections = async () => {
      for (const server of servers) {
        setConnectionStatus(prev => ({ ...prev, [server.id]: 'testing' }))
        
        try {
          const isConnected = await mcpManager.testConnection(server.id)
          setConnectionStatus(prev => ({ 
            ...prev, 
            [server.id]: isConnected ? 'connected' : 'error' 
          }))
        } catch (err) {
          setConnectionStatus(prev => ({ ...prev, [server.id]: 'error' }))
        }
      }
    }

    testAllConnections()
  }, [servers])

  const selectedServerData = servers.find(s => s.id === selectedServer)
  const selectedToolData = selectedServerData?.tools.find(t => t.name === selectedTool)

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }))
  }

  const executeTool = async () => {
    if (!selectedServer || !selectedTool) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const result = await mcpManager.executeTool(selectedServer, selectedTool, parameters)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🔧 MCP Tool Tester</h2>
      <p className="text-gray-600 mb-6">
        Test your MCP server tools directly from the interface. This validates real connections to your running servers.
      </p>

      <div className="space-y-6">
        {/* Server Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select MCP Server
          </label>
          <div className="space-y-2">
            {servers.map(server => (
              <div key={server.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  id={`server-${server.id}`}
                  name="server"
                  value={server.id}
                  checked={selectedServer === server.id}
                  onChange={(e) => setSelectedServer(e.target.value)}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor={`server-${server.id}`} className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    connectionStatus[server.id] === 'connected' ? 'bg-green-400' :
                    connectionStatus[server.id] === 'testing' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`} />
                  <span className="font-medium">{server.name}</span>
                  <span className="text-sm text-gray-500">({server.endpoint})</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                    {server.tools.length} tools
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Tool Selection */}
        {selectedServerData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tool
            </label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose a tool...</option>
              {selectedServerData.tools.map(tool => (
                <option key={tool.name} value={tool.name}>
                  {tool.name} - {tool.description}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Tool Parameters */}
        {selectedToolData && selectedToolData.parameters.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Parameters</h3>
            <div className="space-y-3">
              {selectedToolData.parameters.map(param => (
                <div key={param.name} className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-600">
                      {param.name}
                      {param.required && <span className="text-red-500">*</span>}
                    </label>
                    <p className="text-xs text-gray-400 mt-1">{param.type}</p>
                  </div>
                  <div className="col-span-2">
                    {param.type === 'boolean' ? (
                      <select
                        value={parameters[param.name] ?? param.default ?? ''}
                        onChange={(e) => handleParameterChange(param.name, e.target.value === 'true')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select...</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : param.type === 'number' ? (
                      <input
                        type="number"
                        value={parameters[param.name] ?? param.default ?? ''}
                        onChange={(e) => handleParameterChange(param.name, parseFloat(e.target.value) || undefined)}
                        placeholder={param.default ? `Default: ${param.default}` : ''}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={parameters[param.name] ?? param.default ?? ''}
                        onChange={(e) => handleParameterChange(param.name, e.target.value || undefined)}
                        placeholder={param.default ? `Default: ${param.default}` : ''}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  </div>
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500">{param.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Execute Button */}
        {selectedTool && (
          <div>
            <button
              onClick={executeTool}
              disabled={loading || connectionStatus[selectedServer] !== 'connected'}
              className={`px-4 py-2 rounded-md font-medium ${
                loading || connectionStatus[selectedServer] !== 'connected'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Executing...' : 'Execute Tool'}
            </button>
            {connectionStatus[selectedServer] !== 'connected' && (
              <p className="text-sm text-red-600 mt-2">
                Server is not connected. Please check your MCP server is running.
              </p>
            )}
          </div>
        )}

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="text-red-800 font-medium">Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h4 className="text-green-800 font-medium mb-2">Result</h4>
            <pre className="text-green-700 text-sm overflow-auto max-h-96 bg-white p-2 rounded border">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}