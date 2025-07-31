/**
 * MCP Daily Context & Enhanced Server Information
 * Integrates with Business Integration Graph patterns and Neo4j tagging
 */

export interface MCPDailyContext {
  serverId: string
  dailyUpdate: Date
  healthStatus: 'healthy' | 'degraded' | 'unhealthy' | 'unknown'
  performanceMetrics: {
    averageResponseTime: number
    successRate: number
    totalRequests: number
    errorCount: number
  }
  businessContext: {
    primaryUseCase: string
    businessValue: string
    integrationPoints: string[]
    complianceLevel: 'basic' | 'enterprise' | 'critical'
  }
  technicalContext: {
    version: string
    dependencies: string[]
    resourceUsage: {
      cpu: number
      memory: number
      connections: number
    }
  }
  tags: string[] // Neo4j compatible tags
}

export interface EnhancedMCPServer {
  id: string
  name: string
  description: string
  endpoint: string
  status: 'connected' | 'disconnected' | 'error' | 'starting' | 'stopping'
  
  // Enhanced metadata
  category: 'business' | 'development' | 'automation' | 'projectMgmt'
  priority: 'critical' | 'high' | 'medium' | 'low'
  businessOwner: string
  technicalOwner: string
  
  // Daily context
  dailyContext: MCPDailyContext
  
  // Neo4j tags for relationship mapping
  tags: string[]
  
  // Detailed service information
  serviceDetails: {
    dockerImage?: string
    localPath?: string
    startCommand?: string
    stopCommand?: string
    healthCheckUrl: string
    documentationUrl?: string
    apiVersion: string
    supportedProtocols: string[]
  }
  
  // Business integration patterns
  integrationPatterns: {
    dataFlowIn: string[]
    dataFlowOut: string[]
    dependencies: string[]
    consumers: string[]
  }
  
  // SLA and monitoring
  sla: {
    uptimeTarget: number
    responseTimeTarget: number
    errorRateTarget: number
  }
  
  tools: Array<{
    name: string
    description: string
    category: 'query' | 'create' | 'update' | 'delete'
    businessImpact: 'low' | 'medium' | 'high' | 'critical'
    storyPoints: number
    tags: string[]
    parameters: Array<{
      name: string
      type: string
      required: boolean
      description: string
      businessMeaning: string
      default?: any
    }>
  }>
}

// Enhanced MCP server configurations with daily context
export const ENHANCED_MCP_SERVERS: EnhancedMCPServer[] = [
  {
    id: 'omie',
    name: 'Omie ERP',
    description: 'Brazilian ERP system for financial management, customer relations, and business operations',
    endpoint: 'http://localhost:3000',
    status: 'disconnected',
    category: 'business',
    priority: 'critical',
    businessOwner: 'Finance Team',
    technicalOwner: 'Integration Team',
    
    dailyContext: {
      serverId: 'omie',
      dailyUpdate: new Date(),
      healthStatus: 'unknown',
      performanceMetrics: {
        averageResponseTime: 627,
        successRate: 100,
        totalRequests: 0,
        errorCount: 0
      },
      businessContext: {
        primaryUseCase: 'Financial operations and customer management',
        businessValue: 'Core business system for invoicing, payments, and customer data',
        integrationPoints: ['nibo', 'n8n-mcp', 'composio'],
        complianceLevel: 'critical'
      },
      technicalContext: {
        version: '2.0.0',
        dependencies: ['Python 3.12', 'FastMCP 2.10.6'],
        resourceUsage: {
          cpu: 0,
          memory: 0,
          connections: 0
        }
      },
      tags: ['financial', 'erp', 'brazilian', 'critical-path']
    },
    
    tags: ['financial', 'erp', 'omie', 'brazilian-compliance', 'revenue-critical'],
    
    serviceDetails: {
      localPath: '~/omie-mcp',
      startCommand: 'python omie_fastmcp_conjunto_2_complete.py',
      stopCommand: 'pkill -f omie_fastmcp',
      healthCheckUrl: '/health',
      documentationUrl: 'https://developer.omie.com.br/',
      apiVersion: 'v1',
      supportedProtocols: ['HTTP', 'JSON-RPC']
    },
    
    integrationPatterns: {
      dataFlowIn: [],
      dataFlowOut: ['nibo', 'n8n-mcp'],
      dependencies: [],
      consumers: ['dashboard', 'reporting', 'compliance']
    },
    
    sla: {
      uptimeTarget: 99.9,
      responseTimeTarget: 1000,
      errorRateTarget: 0.1
    },
    
    tools: [
      {
        name: 'consultar_categorias',
        description: 'Query product/service categories',
        category: 'query',
        businessImpact: 'medium',
        storyPoints: 2,
        tags: ['catalog', 'products', 'query'],
        parameters: [
          {
            name: 'pagina',
            type: 'number',
            required: false,
            description: 'Page number for pagination',
            businessMeaning: 'Controls data pagination for large datasets',
            default: 1
          }
        ]
      },
      {
        name: 'listar_clientes',
        description: 'List customers from Omie',
        category: 'query',
        businessImpact: 'high',
        storyPoints: 3,
        tags: ['customers', 'crm', 'query'],
        parameters: [
          {
            name: 'filtro',
            type: 'string',
            required: false,
            description: 'Filter customers by name or code',
            businessMeaning: 'Enables targeted customer searches for sales/support teams'
          }
        ]
      },
      {
        name: 'consultar_contas_pagar',
        description: 'Query accounts payable with advanced filters',
        category: 'query',
        businessImpact: 'critical',
        storyPoints: 5,
        tags: ['finance', 'accounts-payable', 'cash-flow'],
        parameters: [
          {
            name: 'status_titulo',
            type: 'string',
            required: false,
            description: 'Filter by status: aberto, a_pagar, vencido, todos',
            businessMeaning: 'Critical for cash flow management and overdue analysis',
            default: 'todos'
          }
        ]
      }
    ]
  },
  
  {
    id: 'nibo',
    name: 'Nibo Accounting',
    description: 'Brazilian accounting and tax compliance system',
    endpoint: 'http://localhost:3001',
    status: 'disconnected',
    category: 'business',
    priority: 'critical',
    businessOwner: 'Accounting Team',
    technicalOwner: 'Compliance Team',
    
    dailyContext: {
      serverId: 'nibo',
      dailyUpdate: new Date(),
      healthStatus: 'unknown',
      performanceMetrics: {
        averageResponseTime: 800,
        successRate: 100,
        totalRequests: 0,
        errorCount: 0
      },
      businessContext: {
        primaryUseCase: 'Tax compliance, accounting, and regulatory reporting',
        businessValue: 'Legal compliance and financial reporting for Brazilian regulations',
        integrationPoints: ['omie', 'n8n-mcp'],
        complianceLevel: 'critical'
      },
      technicalContext: {
        version: '1.5.0',
        dependencies: ['Python 3.12', 'MCP SDK'],
        resourceUsage: {
          cpu: 0,
          memory: 0,
          connections: 0
        }
      },
      tags: ['accounting', 'compliance', 'tax', 'brazilian-law']
    },
    
    tags: ['accounting', 'tax-compliance', 'nibo', 'brazilian-sped', 'regulatory'],
    
    serviceDetails: {
      localPath: '~/nibo-mcp',
      startCommand: 'python nibo_mcp_server_hybrid.py',
      stopCommand: 'pkill -f nibo_mcp',
      healthCheckUrl: '/health',
      documentationUrl: 'https://nibo.com.br/api-docs',
      apiVersion: 'v2',
      supportedProtocols: ['HTTP', 'REST']
    },
    
    integrationPatterns: {
      dataFlowIn: ['omie'],
      dataFlowOut: ['reporting', 'compliance-dashboard'],
      dependencies: ['omie'],
      consumers: ['accounting-team', 'tax-advisors', 'auditors']
    },
    
    sla: {
      uptimeTarget: 99.5,
      responseTimeTarget: 1500,
      errorRateTarget: 0.5
    },
    
    tools: [
      {
        name: 'listar_empresas',
        description: 'List companies from Nibo',
        category: 'query',
        businessImpact: 'high',
        storyPoints: 2,
        tags: ['companies', 'entities', 'structure'],
        parameters: []
      },
      {
        name: 'consultar_financeiro',
        description: 'Query financial data for compliance reporting',
        category: 'query',
        businessImpact: 'critical',
        storyPoints: 8,
        tags: ['financial-reports', 'compliance', 'tax-data'],
        parameters: [
          {
            name: 'empresa_id',
            type: 'string',
            required: true,
            description: 'Company ID',
            businessMeaning: 'Identifies which legal entity to report on'
          },
          {
            name: 'periodo',
            type: 'string',
            required: false,
            description: 'Period filter (YYYY-MM)',
            businessMeaning: 'Defines reporting period for tax compliance'
          }
        ]
      }
    ]
  },
  
  {
    id: 'n8n-mcp',
    name: 'N8N Workflow Automation',
    description: 'Visual workflow automation and integration platform',
    endpoint: 'http://localhost:5678/api/v1',
    status: 'disconnected',
    category: 'automation',
    priority: 'high',
    businessOwner: 'Operations Team',
    technicalOwner: 'DevOps Team',
    
    dailyContext: {
      serverId: 'n8n-mcp',
      dailyUpdate: new Date(),
      healthStatus: 'unknown',
      performanceMetrics: {
        averageResponseTime: 1200,
        successRate: 95,
        totalRequests: 0,
        errorCount: 0
      },
      businessContext: {
        primaryUseCase: 'Business process automation and system integration',
        businessValue: 'Reduces manual work and ensures consistent process execution',
        integrationPoints: ['omie', 'nibo', 'jira', 'confluence'],
        complianceLevel: 'enterprise'
      },
      technicalContext: {
        version: '1.0.0',
        dependencies: ['Node.js 20', 'N8N Server'],
        resourceUsage: {
          cpu: 0,
          memory: 0,
          connections: 0
        }
      },
      tags: ['workflow', 'automation', 'integration', 'visual-programming']
    },
    
    tags: ['workflow-automation', 'n8n', 'integration-platform', 'visual-programming', 'business-process'],
    
    serviceDetails: {
      startCommand: 'n8n start',
      stopCommand: 'pkill -f n8n',
      healthCheckUrl: '/healthz',
      documentationUrl: 'https://docs.n8n.io/',
      apiVersion: 'v1',
      supportedProtocols: ['HTTP', 'WebSocket', 'Webhook']
    },
    
    integrationPatterns: {
      dataFlowIn: ['omie', 'nibo', 'jira'],
      dataFlowOut: ['email', 'slack', 'reports'],
      dependencies: [],
      consumers: ['all-teams', 'automation']
    },
    
    sla: {
      uptimeTarget: 99.0,
      responseTimeTarget: 2000,
      errorRateTarget: 5.0
    },
    
    tools: [
      {
        name: 'list_workflows',
        description: 'List all available workflows',
        category: 'query',
        businessImpact: 'medium',
        storyPoints: 1,
        tags: ['workflow-management', 'discovery'],
        parameters: [
          {
            name: 'active',
            type: 'boolean',
            required: false,
            description: 'Filter by active workflows only',
            businessMeaning: 'Shows only running automation processes'
          }
        ]
      },
      {
        name: 'execute_workflow',
        description: 'Execute a workflow by ID',
        category: 'update',
        businessImpact: 'high',
        storyPoints: 5,
        tags: ['workflow-execution', 'automation-trigger'],
        parameters: [
          {
            name: 'workflow_id',
            type: 'string',
            required: true,
            description: 'Workflow ID to execute',
            businessMeaning: 'Triggers specific business process automation'
          }
        ]
      }
    ]
  }
]

// Daily context update functions
export class MCPDailyContextManager {
  
  static updateDailyContext(serverId: string, context: Partial<MCPDailyContext>): void {
    const server = ENHANCED_MCP_SERVERS.find(s => s.id === serverId)
    if (server) {
      server.dailyContext = {
        ...server.dailyContext,
        ...context,
        dailyUpdate: new Date()
      }
    }
  }
  
  static getDailyReport(): {
    totalServers: number
    healthyServers: number
    criticalServices: string[]
    topPerformers: string[]
    needsAttention: string[]
  } {
    const servers = ENHANCED_MCP_SERVERS
    
    return {
      totalServers: servers.length,
      healthyServers: servers.filter(s => s.dailyContext.healthStatus === 'healthy').length,
      criticalServices: servers.filter(s => s.priority === 'critical').map(s => s.id),
      topPerformers: servers
        .filter(s => s.dailyContext.performanceMetrics.successRate > 95)
        .map(s => s.id),
      needsAttention: servers
        .filter(s => 
          s.dailyContext.healthStatus === 'degraded' || 
          s.dailyContext.performanceMetrics.successRate < 90
        )
        .map(s => s.id)
    }
  }
  
  // Neo4j tag relationships for Business Integration Graph
  static getTagRelationships(): Array<{
    source: string
    target: string
    relationship: string
    weight: number
  }> {
    const relationships: Array<{
      source: string
      target: string
      relationship: string
      weight: number
    }> = []
    
    ENHANCED_MCP_SERVERS.forEach(server => {
      server.integrationPatterns.dataFlowOut.forEach(target => {
        server.tags.forEach(sourceTag => {
          const targetServer = ENHANCED_MCP_SERVERS.find(s => s.id === target)
          if (targetServer) {
            targetServer.tags.forEach(targetTag => {
              relationships.push({
                source: sourceTag,
                target: targetTag,
                relationship: 'INTEGRATES_WITH',
                weight: server.priority === 'critical' ? 1.0 : 0.5
              })
            })
          }
        })
      })
    })
    
    return relationships
  }
}