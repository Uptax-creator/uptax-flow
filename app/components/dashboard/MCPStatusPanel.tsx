import { useState, useEffect } from 'react'
import { mcpManager, type MCPServer } from '~/lib/integrations/mcp-config'

interface MCPStatusPanelProps {
  servers: MCPServer[]
}

export default function MCPStatusPanel({ servers }: MCPStatusPanelProps) {
  const [connectionStatus, setConnectionStatus] = useState<Record<string, {
    status: 'testing' | 'connected' | 'error'
    lastChecked?: Date
    responseTime?: number
  }>>({})
  const [stats, setStats] = useState({
    totalServers: 0,
    connectedServers: 0,
    totalTools: 0,
    availableTools: 0
  })

  // Test all connections periodically
  useEffect(() => {
    const testConnections = async () => {
      const newStatus: typeof connectionStatus = {}
      let connectedCount = 0
      let availableToolsCount = 0

      for (const server of servers) {
        newStatus[server.id] = { status: 'testing' }
        
        const startTime = Date.now()
        try {
          const isConnected = await mcpManager.testConnection(server.id)
          const responseTime = Date.now() - startTime
          
          newStatus[server.id] = {
            status: isConnected ? 'connected' : 'error',
            lastChecked: new Date(),
            responseTime
          }
          
          if (isConnected) {
            connectedCount++
            availableToolsCount += server.tools.length
          }
        } catch (err) {
          newStatus[server.id] = {
            status: 'error',
            lastChecked: new Date(),
            responseTime: Date.now() - startTime
          }
        }
      }

      setConnectionStatus(newStatus)
      setStats({
        totalServers: servers.length,
        connectedServers: connectedCount,
        totalTools: servers.reduce((sum, s) => sum + s.tools.length, 0),
        availableTools: availableToolsCount
      })
    }

    // Test immediately
    testConnections()
    
    // Then test every 30 seconds
    const interval = setInterval(testConnections, 30000)
    
    return () => clearInterval(interval)
  }, [servers])

  const formatLastChecked = (date?: Date) => {
    if (!date) return 'Never'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">🔗 MCP Server Status</h2>
        <div className="text-sm text-gray-500">
          Auto-refresh every 30s
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.connectedServers}</div>
          <div className="text-sm text-blue-600">Connected Servers</div>
          <div className="text-xs text-gray-500">of {stats.totalServers} total</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.availableTools}</div>
          <div className="text-sm text-green-600">Available Tools</div>
          <div className="text-xs text-gray-500">of {stats.totalTools} total</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {stats.totalServers > 0 ? Math.round((stats.connectedServers / stats.totalServers) * 100) : 0}%
          </div>
          <div className="text-sm text-purple-600">Uptime</div>
          <div className="text-xs text-gray-500">Success rate</div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {Object.values(connectionStatus).reduce((avg, status) => 
              avg + (status.responseTime || 0), 0) / Math.max(1, Object.keys(connectionStatus).length)
            }ms
          </div>
          <div className="text-sm text-yellow-600">Avg Response</div>
          <div className="text-xs text-gray-500">Health check</div>
        </div>
      </div>

      {/* Server Details */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-700">Server Details</h3>
        {servers.map(server => {
          const status = connectionStatus[server.id]
          return (
            <div key={server.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status?.status === 'connected' ? 'bg-green-400' :
                    status?.status === 'testing' ? 'bg-yellow-400 animate-pulse' :
                    'bg-red-400'
                  }`} />
                  <div>
                    <h4 className="font-medium">{server.name}</h4>
                    <p className="text-sm text-gray-500">{server.endpoint}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    status?.status === 'connected' ? 'bg-green-100 text-green-800' :
                    status?.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {status?.status || 'unknown'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatLastChecked(status?.lastChecked)}
                  </div>
                  {status?.responseTime && (
                    <div className="text-xs text-gray-400">
                      {status.responseTime}ms
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tools Summary */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {server.tools.length} tools available
                </div>
                <div className="flex space-x-1">
                  {server.tools.slice(0, 3).map(tool => (
                    <span key={tool.name} className="bg-gray-100 text-xs px-2 py-1 rounded">
                      {tool.name}
                    </span>
                  ))}
                  {server.tools.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{server.tools.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {stats.connectedServers === 0 && stats.totalServers > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex">
            <div className="text-amber-400">⚠️</div>
            <div className="ml-3">
              <h3 className="text-amber-800 font-medium">No MCP Servers Connected</h3>
              <p className="text-amber-700 text-sm mt-1">
                Make sure your Omie and Nibo MCP servers are running on localhost:3000 and localhost:3001.
                Check the LLM Suite documentation for setup instructions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}