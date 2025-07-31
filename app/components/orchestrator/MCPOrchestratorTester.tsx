import { useState } from 'react'
import { mcpOrchestrator, type MCPWorkflow } from '~/lib/orchestrator/mcp-agent-orchestrator'

interface MCPOrchestratorTesterProps {
  openRouterApiKey?: string
}

export default function MCPOrchestratorTester({ openRouterApiKey }: MCPOrchestratorTesterProps) {
  const [userIntent, setUserIntent] = useState('')
  const [workflow, setWorkflow] = useState<MCPWorkflow | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState('')
  const [analytics, setAnalytics] = useState<any>(null)

  const createWorkflow = async () => {
    if (!userIntent.trim()) return

    setLoading(true)
    setError('')
    setWorkflow(null)

    try {
      const createdWorkflow = await mcpOrchestrator.createWorkflowFromIntent(
        userIntent,
        openRouterApiKey
      )
      setWorkflow(createdWorkflow)
      
      // Get suggestions for related workflows
      const workflowSuggestions = await mcpOrchestrator.suggestWorkflows(
        userIntent,
        openRouterApiKey
      )
      setSuggestions(workflowSuggestions)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workflow')
    } finally {
      setLoading(false)
    }
  }

  const executeWorkflow = async () => {
    if (!workflow) return

    setExecuting(true)
    setError('')

    try {
      await mcpOrchestrator.executeWorkflow(workflow.id)
      
      // Refresh workflow data
      const updatedWorkflow = mcpOrchestrator.getWorkflow(workflow.id)
      if (updatedWorkflow) {
        setWorkflow(updatedWorkflow)
      }
      
      // Update analytics
      const currentAnalytics = mcpOrchestrator.getWorkflowAnalytics()
      setAnalytics(currentAnalytics)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Workflow execution failed')
    } finally {
      setExecuting(false)
    }
  }

  const loadAnalytics = () => {
    const currentAnalytics = mcpOrchestrator.getWorkflowAnalytics()
    setAnalytics(currentAnalytics)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'running': return 'text-blue-600 bg-blue-50'
      case 'failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const exampleIntents = [
    "Sincronizar clientes do Omie com a contabilidade do Nibo",
    "Criar relatório financeiro combinando dados do Omie e Nibo",
    "Automatizar criação de tasks no Atlas baseado em issues do Jira",
    "Documentar no Confluence os processos financeiros do Omie",
    "Integrar via Composio os dados do Omie com sistemas externos"
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🎭 MCP Agent Orchestrator</h2>
      <p className="text-gray-600 mb-6">
        AI-First workflow orchestration that combines multiple MCP servers intelligently.
        Based on Business Integration Graph patterns and LLM Suite context.
      </p>

      {/* API Key Status */}
      <div className="mb-4 p-3 rounded-md bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${openRouterApiKey ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-sm font-medium">
            OpenRouter API: {openRouterApiKey ? 'Connected' : 'Required for AI workflow creation'}
          </span>
        </div>
      </div>

      {/* Intent Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Intent (Natural Language)
        </label>
        <div className="flex space-x-2">
          <textarea
            value={userIntent}
            onChange={(e) => setUserIntent(e.target.value)}
            placeholder="Describe what you want to accomplish across multiple systems..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={3}
          />
          <button
            onClick={createWorkflow}
            disabled={loading || !userIntent.trim() || !openRouterApiKey}
            className={`px-4 py-2 rounded-md font-medium ${
              loading || !userIntent.trim() || !openRouterApiKey
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Workflow'}
          </button>
        </div>
      </div>

      {/* Example Intents */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Example Business Intents:</h3>
        <div className="space-y-2">
          {exampleIntents.map((intent, index) => (
            <button
              key={index}
              onClick={() => setUserIntent(intent)}
              className="text-left w-full text-xs p-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            >
              {intent}
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

      {/* Generated Workflow */}
      {workflow && (
        <div className="mb-6 space-y-4">
          <h3 className="font-medium text-gray-700">🔄 Generated Workflow</h3>
          
          {/* Workflow Header */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-800">{workflow.name}</h4>
            <p className="text-blue-700 text-sm mt-1">{workflow.description}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(workflow.status)}`}>
                {workflow.status}
              </span>
              <span className="text-xs text-blue-600">
                {workflow.steps.length} steps
              </span>
              <span className="text-xs text-blue-600">
                Created: {workflow.createdAt.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Execution Steps:</h4>
            {workflow.steps.map((step, index) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {index + 1}
                    </span>
                    <div>
                      <h5 className="font-medium text-sm">
                        {step.serverId}.{step.toolName}
                      </h5>
                      {step.dependsOn && step.dependsOn.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Depends on: {step.dependsOn.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(step.status)}`}>
                    {step.status}
                  </span>
                </div>
                
                {Object.keys(step.parameters).length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Parameters: {JSON.stringify(step.parameters)}
                  </div>
                )}
                
                {step.output && (
                  <div className="mt-2">
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-600">View Output</summary>
                      <pre className="mt-1 bg-gray-50 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
                
                {step.error && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    Error: {step.error}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Execute Button */}
          <div className="flex space-x-4">
            <button
              onClick={executeWorkflow}
              disabled={executing || workflow.status === 'running' || workflow.status === 'completed'}
              className={`px-4 py-2 rounded-md font-medium ${
                executing || workflow.status === 'running' || workflow.status === 'completed'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {executing ? 'Executing...' : '▶ Execute Workflow'}
            </button>
            
            <button
              onClick={loadAnalytics}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 font-medium"
            >
              📊 Load Analytics
            </button>
          </div>
        </div>
      )}

      {/* Workflow Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">💡 Related Workflow Suggestions</h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-yellow-50 p-3 rounded-md">
                <p className="text-yellow-800 text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics */}
      {analytics && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">📊 Orchestrator Analytics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalWorkflows}</div>
              <div className="text-sm text-blue-600">Total Workflows</div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.completedWorkflows}</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{analytics.failedWorkflows}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(analytics.successRate)}%</div>
              <div className="text-sm text-purple-600">Success Rate</div>
            </div>
          </div>

          {/* Most Used Servers */}
          {Object.keys(analytics.mostUsedServers).length > 0 && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Most Used Servers</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analytics.mostUsedServers)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([server, count]) => (
                    <span key={server} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      {server}: {count as number}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}