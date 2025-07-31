import { useState, useEffect } from 'react'
import { ENHANCED_MCP_SERVERS, MCPDailyContextManager } from '~/lib/integrations/mcp-daily-context'
import type { EnhancedMCPServer } from '~/lib/integrations/mcp-daily-context'

interface ModernDashboardProps {
  openRouterApiKey?: string
}

export default function ModernDashboard({ openRouterApiKey }: ModernDashboardProps) {
  const [servers, setServers] = useState<EnhancedMCPServer[]>(ENHANCED_MCP_SERVERS)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [dailyReport, setDailyReport] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadDailyReport()
    const interval = setInterval(refreshServerStatus, 30000) // Refresh every 30s
    
    return () => clearInterval(interval)
  }, [])

  const loadDailyReport = () => {
    const report = MCPDailyContextManager.getDailyReport()
    setDailyReport(report)
  }

  const refreshServerStatus = async () => {
    setIsRefreshing(true)
    
    // Simulate server status checks (in real implementation, this would call health endpoints)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update daily context for each server
    servers.forEach(server => {
      MCPDailyContextManager.updateDailyContext(server.id, {
        healthStatus: Math.random() > 0.8 ? 'degraded' : 'healthy',
        performanceMetrics: {
          averageResponseTime: Math.round(Math.random() * 1000 + 500),
          successRate: Math.round(Math.random() * 20 + 80),
          totalRequests: Math.round(Math.random() * 1000),
          errorCount: Math.round(Math.random() * 10)
        }
      })
    })
    
    setServers([...ENHANCED_MCP_SERVERS])
    loadDailyReport()
    setIsRefreshing(false)
  }

  const filteredServers = selectedCategory === 'all' 
    ? servers 
    : servers.filter(s => s.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-400'
      case 'starting': return 'bg-yellow-400 animate-pulse'
      case 'error': return 'bg-red-400'
      default: return 'bg-gray-400'
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-50'
      case 'degraded': return 'text-yellow-600 bg-yellow-50'
      case 'unhealthy': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [
    { id: 'all', name: 'All Systems', count: servers.length },
    { id: 'business', name: 'Business', count: servers.filter(s => s.category === 'business').length },
    { id: 'development', name: 'Development', count: servers.filter(s => s.category === 'development').length },
    { id: 'automation', name: 'Automation', count: servers.filter(s => s.category === 'automation').length },
    { id: 'projectMgmt', name: 'Project Mgmt', count: servers.filter(s => s.category === 'projectMgmt').length }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">UpTax Flow</h1>
              <p className="text-gray-600 text-sm">AI-First MCP Integration Platform</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${openRouterApiKey ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm text-gray-600">
                  AI: {openRouterApiKey ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <button
                onClick={refreshServerStatus}
                disabled={isRefreshing}
                className={`px-3 py-1 text-sm rounded-md border ${
                  isRefreshing 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Daily Report KPIs */}
        {dailyReport && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{dailyReport.totalServers}</div>
              <div className="text-sm text-gray-600">Total Systems</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">{dailyReport.healthyServers}</div>
              <div className="text-sm text-gray-600">Healthy</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">{dailyReport.criticalServices.length}</div>
              <div className="text-sm text-gray-600">Critical Services</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{dailyReport.topPerformers.length}</div>
              <div className="text-sm text-gray-600">Top Performers</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">{dailyReport.needsAttention.length}</div>
              <div className="text-sm text-gray-600">Need Attention</div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Server Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServers.map(server => (
            <div key={server.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Server Header */}
              <div className="p-4 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(server.status)}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{server.name}</h3>
                      <p className="text-sm text-gray-500">{server.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(server.priority)}`}>
                      {server.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getHealthColor(server.dailyContext.healthStatus)}`}>
                      {server.dailyContext.healthStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Server Details */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">{server.description}</p>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {server.dailyContext.performanceMetrics.averageResponseTime}ms
                    </div>
                    <div className="text-xs text-gray-500">Avg Response</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {server.dailyContext.performanceMetrics.successRate}%
                    </div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>

                {/* Business Context */}
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-700 mb-1">Business Value</h4>
                  <p className="text-xs text-gray-600">{server.dailyContext.businessContext.businessValue}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {server.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {server.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{server.tags.length - 3} more</span>
                  )}
                </div>

                {/* Tools Count */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {server.tools.length} tools available
                  </span>
                  <span className="text-gray-400">
                    v{server.serviceDetails.apiVersion}
                  </span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Updated: {server.dailyContext.dailyUpdate.toLocaleTimeString()}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      View Details
                    </button>
                    <button className="text-xs text-green-600 hover:text-green-700 font-medium">
                      Test Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">🚀 Getting Started</h3>
          <div className="text-blue-800 text-sm space-y-1">
            <p>• <strong>Omie MCP:</strong> <code>cd ~/omie-mcp && python omie_fastmcp_conjunto_2_complete.py</code></p>
            <p>• <strong>Nibo MCP:</strong> <code>cd ~/nibo-mcp && python nibo_mcp_server_hybrid.py</code></p>
            <p>• <strong>N8N:</strong> <code>n8n start</code></p>
            <p>• <strong>Configure OpenRouter:</strong> Add API key in /integrations for AI-powered workflows</p>
          </div>
        </div>
      </div>
    </div>
  )
}