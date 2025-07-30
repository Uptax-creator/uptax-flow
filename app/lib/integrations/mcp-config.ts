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
  
  // Test connection to MCP server
  async testConnection(serverId: string): Promise<boolean> {
    const server = this.servers.get(serverId)
    if (!server) return false
    
    try {
      const response = await fetch(`${server.endpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const isConnected = response.ok
      server.status = isConnected ? 'connected' : 'error'
      server.lastChecked = new Date()
      
      return isConnected
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
  
  // Execute MCP tool
  async executeTool(
    serverId: string, 
    toolName: string, 
    parameters: Record<string, any>
  ): Promise<any> {
    const server = this.servers.get(serverId)
    if (!server || server.status !== 'connected') {
      throw new Error(`Server ${serverId} is not connected`)
    }
    
    const response = await fetch(`${server.endpoint}/tools/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters)
    })
    
    if (!response.ok) {
      throw new Error(`Tool execution failed: ${response.statusText}`)
    }
    
    return response.json()
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