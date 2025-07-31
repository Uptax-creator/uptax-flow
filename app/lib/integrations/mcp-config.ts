/**
 * MCP (Model Context Protocol) Integration Configuration
 * Frontend configuration for MCP servers (Omie/Nibo)
 */

export interface MCPServer {
  id: string
  name: string
  description: string
  endpoint: string
  status: 'connected' | 'disconnected' | 'error'
  lastChecked?: Date
  tools: MCPTool[]
  credentials?: MCPCredentials
}

export interface MCPTool {
  name: string
  description: string
  parameters: MCPParameter[]
  category: 'query' | 'create' | 'update' | 'delete'
  requiresAuth: boolean
}

export interface MCPParameter {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description: string
  default?: any
}

export interface MCPCredentials {
  type: 'api_key' | 'oauth' | 'basic_auth'
  apiKey?: string
  clientId?: string
  clientSecret?: string
  username?: string
  password?: string
  refreshToken?: string
}

// Default MCP server configurations
export const DEFAULT_MCP_SERVERS: MCPServer[] = [
  {
    id: 'omie',
    name: 'Omie ERP',
    description: 'Integration with Omie ERP system for customers, invoices, and financial data',
    endpoint: 'http://localhost:3000', // Your existing Omie MCP server
    status: 'disconnected',
    tools: [
      {
        name: 'consultar_categorias',
        description: 'Query product/service categories',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'pagina',
            type: 'number',
            required: false,
            description: 'Page number for pagination',
            default: 1
          },
          {
            name: 'registros_por_pagina',
            type: 'number',
            required: false,
            description: 'Records per page',
            default: 50
          }
        ]
      },
      {
        name: 'listar_clientes',
        description: 'List customers from Omie',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'filtro',
            type: 'string',
            required: false,
            description: 'Filter customers by name or code'
          }
        ]
      },
      {
        name: 'consultar_contas_pagar',
        description: 'Query accounts payable',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'status_titulo',
            type: 'string',
            required: false,
            description: 'Filter by status: aberto, a_pagar, vencido, todos',
            default: 'todos'
          }
        ]
      },
      {
        name: 'incluir_projeto',
        description: 'Create new project',
        category: 'create',
        requiresAuth: true,
        parameters: [
          {
            name: 'codigo',
            type: 'string',
            required: true,
            description: 'Project code'
          },
          {
            name: 'nome',
            type: 'string',
            required: true,
            description: 'Project name'
          }
        ]
      }
    ]
  },
  {
    id: 'nibo',
    name: 'Nibo',
    description: 'Integration with Nibo financial system',
    endpoint: 'http://localhost:3001', // Your existing Nibo MCP server
    status: 'disconnected',
    tools: [
      {
        name: 'listar_empresas',
        description: 'List companies from Nibo',
        category: 'query',
        requiresAuth: true,
        parameters: []
      },
      {
        name: 'consultar_financeiro',
        description: 'Query financial data',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'empresa_id',
            type: 'string',
            required: true,
            description: 'Company ID'
          },
          {
            name: 'periodo',
            type: 'string',
            required: false,
            description: 'Period filter (YYYY-MM)'
          }
        ]
      }
    ]
  },
  {
    id: 'atlas-task',
    name: 'Atlas Task System',
    description: 'Advanced task management and project coordination system',
    endpoint: 'http://localhost:3002',
    status: 'disconnected',
    tools: [
      {
        name: 'list_tasks',
        description: 'List all tasks with filters',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'status',
            type: 'string',
            required: false,
            description: 'Filter by status: open, in_progress, completed, all'
          },
          {
            name: 'assignee',
            type: 'string',
            required: false,
            description: 'Filter by assignee'
          }
        ]
      },
      {
        name: 'create_task',
        description: 'Create a new task',
        category: 'create',
        requiresAuth: true,
        parameters: [
          {
            name: 'title',
            type: 'string',
            required: true,
            description: 'Task title'
          },
          {
            name: 'description',
            type: 'string',
            required: false,
            description: 'Task description'
          },
          {
            name: 'assignee',
            type: 'string',
            required: false,
            description: 'Task assignee'
          },
          {
            name: 'priority',
            type: 'string',
            required: false,
            description: 'Priority: low, medium, high, urgent'
          }
        ]
      }
    ]
  },
  {
    id: 'n8n-mcp',
    name: 'N8N Workflows',
    description: 'Visual workflow automation and integration platform',
    endpoint: 'http://localhost:5678/api/v1',
    status: 'disconnected',
    tools: [
      {
        name: 'list_workflows',
        description: 'List all N8N workflows',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'active',
            type: 'boolean',
            required: false,
            description: 'Filter by active workflows only'
          }
        ]
      },
      {
        name: 'execute_workflow',
        description: 'Execute a workflow by ID',
        category: 'update',
        requiresAuth: true,
        parameters: [
          {
            name: 'workflow_id',
            type: 'string',
            required: true,
            description: 'Workflow ID to execute'
          },
          {
            name: 'input_data',
            type: 'object',
            required: false,
            description: 'Input data for workflow execution'
          }
        ]
      },
      {
        name: 'get_workflow',
        description: 'Get workflow details by ID',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'workflow_id',
            type: 'string',
            required: true,
            description: 'Workflow ID'
          }
        ]
      }
    ]
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Issue tracking, project management, and agile development',
    endpoint: 'http://localhost:3003',
    status: 'disconnected',
    tools: [
      {
        name: 'search_issues',
        description: 'Search Jira issues with JQL',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'jql',
            type: 'string',
            required: false,
            description: 'JQL query string'
          },
          {
            name: 'project',
            type: 'string',
            required: false,
            description: 'Project key filter'
          }
        ]
      },
      {
        name: 'create_issue',
        description: 'Create a new Jira issue',
        category: 'create',
        requiresAuth: true,
        parameters: [
          {
            name: 'project',
            type: 'string',
            required: true,
            description: 'Project key'
          },
          {
            name: 'summary',
            type: 'string',
            required: true,
            description: 'Issue summary'
          },
          {
            name: 'issue_type',
            type: 'string',
            required: true,
            description: 'Issue type (Bug, Task, Story, etc.)'
          }
        ]
      }
    ]
  },
  {
    id: 'confluence',
    name: 'Confluence',
    description: 'Knowledge base, documentation, and team collaboration',
    endpoint: 'http://localhost:3004',
    status: 'disconnected',
    tools: [
      {
        name: 'search_content',
        description: 'Search Confluence content',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'query',
            type: 'string',
            required: true,
            description: 'Search query'
          },
          {
            name: 'space',
            type: 'string',
            required: false,
            description: 'Space key filter'
          }
        ]
      },
      {
        name: 'create_page',
        description: 'Create a new Confluence page',
        category: 'create',
        requiresAuth: true,
        parameters: [
          {
            name: 'space',
            type: 'string',
            required: true,
            description: 'Space key'
          },
          {
            name: 'title',
            type: 'string',
            required: true,
            description: 'Page title'
          },
          {
            name: 'content',
            type: 'string',
            required: true,
            description: 'Page content (HTML or Confluence markup)'
          }
        ]
      }
    ]
  },
  {
    id: 'composio',
    name: 'Composio',
    description: 'Multi-platform integrations and API orchestration',
    endpoint: 'http://localhost:3005',
    status: 'disconnected',
    tools: [
      {
        name: 'list_integrations',
        description: 'List available integrations',
        category: 'query',
        requiresAuth: true,
        parameters: []
      },
      {
        name: 'execute_action',
        description: 'Execute an integration action',
        category: 'update',
        requiresAuth: true,
        parameters: [
          {
            name: 'integration',
            type: 'string',
            required: true,
            description: 'Integration name'
          },
          {
            name: 'action',
            type: 'string',
            required: true,
            description: 'Action to execute'
          },
          {
            name: 'parameters',
            type: 'object',
            required: false,
            description: 'Action parameters'
          }
        ]
      }
    ]
  },
  {
    id: 'context7',
    name: 'Context7',
    description: 'Development standards, templates, and best practices',
    endpoint: 'http://localhost:3006',
    status: 'disconnected',
    tools: [
      {
        name: 'list_templates',
        description: 'List available code templates',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'category',
            type: 'string',
            required: false,
            description: 'Template category filter'
          }
        ]
      },
      {
        name: 'get_template',
        description: 'Get template content by ID',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'template_id',
            type: 'string',
            required: true,
            description: 'Template ID'
          }
        ]
      },
      {
        name: 'validate_code',
        description: 'Validate code against standards',
        category: 'query',
        requiresAuth: true,
        parameters: [
          {
            name: 'code',
            type: 'string',
            required: true,
            description: 'Code to validate'
          },
          {
            name: 'language',
            type: 'string',
            required: true,
            description: 'Programming language'
          }
        ]
      }
    ]
  }
]

// MCP Configuration Form Interface
export interface MCPConfigForm {
  serverId: string
  endpoint: string
  credentials: MCPCredentials
  testConnection: boolean
}

// Frontend MCP Management Functions
export class MCPManager {
  private servers: Map<string, MCPServer> = new Map()
  
  constructor() {
    // Initialize with default servers
    DEFAULT_MCP_SERVERS.forEach(server => {
      this.servers.set(server.id, server)
    })
  }
  
  // Get all configured servers
  getServers(): MCPServer[] {
    return Array.from(this.servers.values())
  }
  
  // Get server by ID
  getServer(id: string): MCPServer | undefined {
    return this.servers.get(id)
  }
  
  // Add or update server configuration
  setServer(server: MCPServer): void {
    this.servers.set(server.id, server)
  }
  
  // Test connection to MCP server via API
  async testConnection(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false
    
    try {
      // Use our API endpoint for health check
      const response = await fetch(`/api/mcp/tools/${serverId}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const isConnected = data.status === 'connected'
        server.status = isConnected ? 'connected' : 'error'
        server.lastChecked = new Date()
        return isConnected
      } else {
        server.status = 'error'
        server.lastChecked = new Date()
        return false
      }
    } catch (error) {
      server.status = 'error'
      server.lastChecked = new Date()
      return false
    }
  }
  
  // Get available tools from all connected servers
  getAvailableTools(): MCPTool[] {
    const tools: MCPTool[] = []
    
    this.servers.forEach(server => {
      if (server.status === 'connected') {
        tools.push(...server.tools)
      }
    })
    
    return tools
  }
  
  // Execute MCP tool via API
  async executeTool(
    serverId: string, 
    toolName: string, 
    parameters: Record<string, any>
  ): Promise<any> {
    const server = this.servers.get(serverId)
    if (!server) {
      throw new Error(`Server ${serverId} not found`)
    }
    
    // Use our API endpoint for tool execution
    const response = await fetch(`/api/mcp/tools/${serverId}/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || `Tool execution failed: ${response.statusText}`)
    }
    
    return data.result
  }
}

// Validation functions
export function validateMCPConfig(config: MCPConfigForm): string[] {
  const errors: string[] = []
  
  if (!config.serverId) {
    errors.push('Server ID is required')
  }
  
  if (!config.endpoint) {
    errors.push('Endpoint URL is required')
  }
  
  // Validate URL format
  try {
    new URL(config.endpoint)
  } catch {
    errors.push('Invalid endpoint URL format')
  }
  
  // Validate credentials based on type
  if (config.credentials.type === 'api_key' && !config.credentials.apiKey) {
    errors.push('API Key is required for this authentication type')
  }
  
  if (config.credentials.type === 'basic_auth') {
    if (!config.credentials.username) {
      errors.push('Username is required for basic auth')
    }
    if (!config.credentials.password) {
      errors.push('Password is required for basic auth')
    }
  }
  
  return errors
}

// Export singleton instance
export const mcpManager = new MCPManager()