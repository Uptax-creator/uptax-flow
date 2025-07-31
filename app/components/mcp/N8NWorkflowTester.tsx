import { useState, useEffect } from 'react'
import { mcpManager } from '~/lib/integrations/mcp-config'

interface N8NWorkflow {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
  nodes: any[]
}

interface N8NWorkflowTesterProps {
  endpoint?: string
}

export default function N8NWorkflowTester({ endpoint = 'http://localhost:5678/api/v1' }: N8NWorkflowTesterProps) {
  const [workflows, setWorkflows] = useState<N8NWorkflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('')
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')

  // Test N8N connection and load workflows
  useEffect(() => {
    testN8NConnection()
  }, [])

  const testN8NConnection = async () => {
    setConnectionStatus('testing')
    setError('')

    try {
      // First test the connection
      const healthResponse = await fetch(`${endpoint}/workflows`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (healthResponse.ok) {
        const workflowsData = await healthResponse.json()
        setWorkflows(Array.isArray(workflowsData) ? workflowsData : [])
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('error')
        setError(`N8N connection failed: ${healthResponse.status} ${healthResponse.statusText}`)
      }
    } catch (err) {
      setConnectionStatus('error')
      setError(`N8N connection error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const executeWorkflow = async () => {
    if (!selectedWorkflow) return

    setLoading(true)
    setError('')
    setExecutionResult(null)

    try {
      // Execute via MCP API
      const result = await mcpManager.executeTool('n8n-mcp', 'execute_workflow', {
        workflow_id: selectedWorkflow
      })
      
      setExecutionResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Workflow execution failed')
    } finally {
      setLoading(false)
    }
  }

  const getWorkflowDetails = async (workflowId: string) => {
    try {
      const result = await mcpManager.executeTool('n8n-mcp', 'get_workflow', {
        workflow_id: workflowId
      })
      
      return result
    } catch (err) {
      console.error('Failed to get workflow details:', err)
      return null
    }
  }

  const createTestWorkflow = async () => {
    setLoading(true)
    setError('')

    try {
      // This would create a simple test workflow
      const testWorkflowData = {
        name: 'UpTax Flow Test Workflow',
        nodes: [
          {
            name: 'Start',
            type: 'n8n-nodes-base.start',
            position: [250, 300],
            parameters: {}
          },
          {
            name: 'Set Data',
            type: 'n8n-nodes-base.set',
            position: [450, 300],
            parameters: {
              values: {
                string: [
                  {
                    name: 'message',
                    value: 'Hello from UpTax Flow!'
                  }
                ]
              }
            }
          }
        ],
        connections: {
          'Start': {
            main: [[{ node: 'Set Data', type: 'main', index: 0 }]]
          }
        }
      }

      // Note: This is a mock - real N8N workflow creation requires proper API calls
      console.log('Test workflow data:', testWorkflowData)
      alert('Test workflow creation is simulated. Check console for workflow structure.')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create test workflow')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🔄 N8N Workflow Tester</h2>
      <p className="text-gray-600 mb-6">
        Test and execute N8N workflows directly from UpTax Flow. This validates the integration between 
        your N8N instance and the MCP system.
      </p>

      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-md bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400' :
              connectionStatus === 'testing' ? 'bg-yellow-400 animate-pulse' :
              'bg-red-400'
            }`} />
            <div>
              <h3 className="font-medium">N8N Connection Status</h3>
              <p className="text-sm text-gray-500">{endpoint}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
              connectionStatus === 'testing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {connectionStatus}
            </span>
            <button
              onClick={testN8NConnection}
              className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Workflows List */}
      {connectionStatus === 'connected' && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-3">Available Workflows ({workflows.length})</h3>
          
          {workflows.length > 0 ? (
            <div className="space-y-2">
              {workflows.map(workflow => (
                <div key={workflow.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id={`workflow-${workflow.id}`}
                        name="workflow"
                        value={workflow.id}
                        checked={selectedWorkflow === workflow.id}
                        onChange={(e) => setSelectedWorkflow(e.target.value)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label htmlFor={`workflow-${workflow.id}`} className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${workflow.active ? 'bg-green-400' : 'bg-gray-400'}`} />
                        <span className="font-medium">{workflow.name}</span>
                        <span className="text-sm text-gray-500">
                          ({workflow.nodes?.length || 0} nodes)
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        workflow.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workflow.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(workflow.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No workflows found in your N8N instance.</p>
              <button
                onClick={createTestWorkflow}
                className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Create Test Workflow
              </button>
            </div>
          )}
        </div>
      )}

      {/* Execution Controls */}
      {selectedWorkflow && (
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={executeWorkflow}
              disabled={loading}
              className={`px-4 py-2 rounded-md font-medium ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? 'Executing...' : '▶ Execute Workflow'}
            </button>
            
            <button
              onClick={() => getWorkflowDetails(selectedWorkflow)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              📋 View Details
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-red-800 font-medium">Error</h4>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          
          {connectionStatus === 'error' && (
            <div className="mt-3 text-red-700 text-sm">
              <p><strong>Troubleshooting:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Make sure N8N is running on localhost:5678</li>
                <li>Check N8N API credentials are configured</li>
                <li>Verify N8N API is accessible from this application</li>
                <li>Ensure CORS is properly configured in N8N</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Execution Results */}
      {executionResult && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="text-green-800 font-medium mb-2">Execution Result</h4>
          <pre className="text-green-700 text-sm overflow-auto max-h-96 bg-white p-2 rounded border">
            {JSON.stringify(executionResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Integration Instructions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-700 mb-3">🔧 N8N Integration Setup</h3>
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-blue-800 text-sm mb-2">
            <strong>To enable N8N MCP integration:</strong>
          </p>
          <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
            <li>Start your N8N instance: <code className="bg-blue-100 px-1 rounded">n8n start</code></li>
            <li>Enable API access in N8N settings</li>
            <li>Configure authentication (if required)</li>
            <li>Create test workflows in N8N interface</li>
            <li>Use this tester to validate integration</li>
          </ol>
        </div>
      </div>
    </div>
  )
}