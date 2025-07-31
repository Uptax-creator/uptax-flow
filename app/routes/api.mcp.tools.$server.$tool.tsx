import { json, type ActionFunctionArgs } from '@remix-run/cloudflare'
import { createSessionStorage, requireUser } from '~/lib/auth/session'

// MCP Server configurations (this should match your running servers)
const MCP_SERVERS = {
  omie: {
    endpoint: 'http://localhost:3000',
    name: 'Omie FastMCP'
  },
  nibo: {
    endpoint: 'http://localhost:3001', 
    name: 'Nibo MCP'
  },
  'atlas-task': {
    endpoint: 'http://localhost:3002',
    name: 'Atlas Task System'
  },
  'n8n-mcp': {
    endpoint: 'http://localhost:5678/api/v1',
    name: 'N8N MCP Workflows'
  },
  jira: {
    endpoint: 'http://localhost:3003',
    name: 'Jira MCP'
  },
  confluence: {
    endpoint: 'http://localhost:3004',
    name: 'Confluence MCP'
  },
  composio: {
    endpoint: 'http://localhost:3005',
    name: 'Composio MCP'
  },
  context7: {
    endpoint: 'http://localhost:3006',
    name: 'Context7 MCP'
  }
} as const

export async function action({ request, params, context }: ActionFunctionArgs) {
  const sessionStorage = createSessionStorage(context.cloudflare.env.AUTH_SECRET)
  
  try {
    // Require authentication
    await requireUser(sessionStorage, request)
    
    const { server, tool } = params
    
    if (!server || !tool) {
      return json({ error: 'Server and tool parameters are required' }, { status: 400 })
    }
    
    const serverConfig = MCP_SERVERS[server as keyof typeof MCP_SERVERS]
    if (!serverConfig) {
      return json({ error: 'Invalid server specified' }, { status: 400 })
    }
    
    // Get request body
    const body = await request.json()
    
    // Execute MCP tool via HTTP
    const mcpResponse = await fetch(`${serverConfig.endpoint}/tools/${tool}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    if (!mcpResponse.ok) {
      const errorText = await mcpResponse.text()
      return json({ 
        error: `MCP server error: ${mcpResponse.status} ${mcpResponse.statusText}`,
        details: errorText 
      }, { status: mcpResponse.status })
    }
    
    const result = await mcpResponse.json()
    
    return json({ 
      success: true, 
      result,
      server: serverConfig.name,
      tool,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('MCP tool execution error:', error)
    
    if (error instanceof Response) {
      throw error // Re-throw auth redirect responses
    }
    
    return json({ 
      error: 'Failed to execute MCP tool',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Health check endpoint
export async function loader({ params }: { params: { server: string, tool: string } }) {
  const { server } = params
  
  const serverConfig = MCP_SERVERS[server as keyof typeof MCP_SERVERS]
  if (!serverConfig) {
    return json({ error: 'Invalid server specified' }, { status: 400 })
  }
  
  try {
    const healthResponse = await fetch(`${serverConfig.endpoint}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    
    return json({
      server: serverConfig.name,
      endpoint: serverConfig.endpoint,
      status: healthResponse.ok ? 'connected' : 'error',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return json({
      server: serverConfig.name,
      endpoint: serverConfig.endpoint,
      status: 'error',
      error: error instanceof Error ? error.message : 'Connection failed',
      timestamp: new Date().toISOString()
    })
  }
}