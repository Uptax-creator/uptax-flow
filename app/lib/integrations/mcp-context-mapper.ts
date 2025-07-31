/**
 * MCP Context Mapper - AI-Powered Tool Discovery
 * Inspired by Supabase MCP Server best practices
 * Uses OpenRouter for context-aware tool selection
 */

export interface MCPContextMapping {
  intent: string
  confidence: number
  suggestedServer: string
  suggestedTool: string
  parameters: Record<string, any>
  reasoning: string
}

export interface MCPServerContext {
  id: string
  name: string
  category: 'development' | 'automation' | 'projectMgmt' | 'business'
  description: string
  capabilities: string[]
  contextPrompt: string
  endpoint: string
  discoveryEndpoint?: string // For auto-discovery like Supabase MCP
}

// Enhanced MCP server definitions with context-aware descriptions
export const MCP_SERVERS_CONTEXT: MCPServerContext[] = [
  {
    id: 'omie',
    name: 'Omie ERP',
    category: 'business',
    description: 'Brazilian ERP system for financial management, customer relations, and business operations',
    capabilities: [
      'financial_queries', 'customer_management', 'accounts_payable', 
      'accounts_receivable', 'project_management', 'inventory_control'
    ],
    contextPrompt: `
      Omie ERP specializes in:
      - Consultar clientes (customer queries)
      - Contas a pagar/receber (accounts payable/receivable)
      - Categorias de produtos (product categories)
      - Projetos e lançamentos (projects and entries)
      - Relatórios financeiros (financial reports)
      
      Use when user mentions: clients, customers, invoices, payments, financial data, ERP, Brazilian accounting
    `,
    endpoint: 'http://localhost:3000',
    discoveryEndpoint: '/tools/list'
  },
  {
    id: 'nibo',
    name: 'Nibo Accounting',
    category: 'business',
    description: 'Brazilian accounting and tax compliance system',
    capabilities: [
      'accounting_queries', 'tax_compliance', 'financial_reports',
      'company_management', 'fiscal_documents'
    ],
    contextPrompt: `
      Nibo Accounting specializes in:
      - Contabilidade (accounting)
      - Compliance fiscal (tax compliance)
      - Relatórios contábeis (accounting reports)
      - Gestão de empresas (company management)
      - Documentos fiscais (fiscal documents)
      
      Use when user mentions: accounting, taxes, compliance, fiscal, contabilidade, impostos
    `,
    endpoint: 'http://localhost:3001',
    discoveryEndpoint: '/tools/list'
  },
  {
    id: 'atlas-task',
    name: 'Atlas Task System',
    category: 'development',
    description: 'Advanced task management and project coordination system',
    capabilities: [
      'task_management', 'project_planning', 'team_coordination',
      'progress_tracking', 'deadline_management'
    ],
    contextPrompt: `
      Atlas Task System specializes in:
      - Task creation and management
      - Project planning and tracking
      - Team coordination and assignments
      - Progress monitoring and reporting
      - Deadline and milestone management
      
      Use when user mentions: tasks, projects, planning, deadlines, team management, coordination
    `,
    endpoint: 'http://localhost:3002',
    discoveryEndpoint: '/tools/list'
  },
  {
    id: 'n8n-mcp',
    name: 'N8N Workflow Automation',
    category: 'automation',
    description: 'Visual workflow automation and integration platform',
    capabilities: [
      'workflow_automation', 'api_integration', 'data_transformation',
      'trigger_management', 'batch_processing'
    ],
    contextPrompt: `
      N8N Workflow Automation specializes in:
      - Creating and managing workflows
      - API integrations and connections
      - Data transformation and processing
      - Automated triggers and schedules
      - Batch processing and bulk operations
      
      Use when user mentions: automation, workflows, integrations, triggers, data processing, N8N
    `,
    endpoint: 'http://localhost:5678/api/v1',
    discoveryEndpoint: '/workflows'
  },
  {
    id: 'jira',
    name: 'Jira Project Management',
    category: 'projectMgmt',
    description: 'Issue tracking, project management, and agile development',
    capabilities: [
      'issue_tracking', 'sprint_management', 'project_planning',
      'team_collaboration', 'reporting_analytics'
    ],
    contextPrompt: `
      Jira Project Management specializes in:
      - Issue tracking and bug management
      - Sprint planning and agile workflows
      - Project management and planning
      - Team collaboration and assignments
      - Reporting and analytics
      
      Use when user mentions: issues, bugs, sprints, agile, tickets, project management, Jira
    `,
    endpoint: 'http://localhost:3003',
    discoveryEndpoint: '/rest/api/2/issue/createmeta'
  },
  {
    id: 'confluence',
    name: 'Confluence Documentation',
    category: 'projectMgmt',
    description: 'Knowledge base, documentation, and team collaboration',
    capabilities: [
      'documentation', 'knowledge_management', 'content_creation',
      'team_collaboration', 'search_discovery'
    ],
    contextPrompt: `
      Confluence Documentation specializes in:
      - Creating and managing documentation
      - Knowledge base and wiki management
      - Content creation and editing
      - Team collaboration on documents
      - Search and content discovery
      
      Use when user mentions: documentation, wiki, knowledge base, content, articles, Confluence
    `,
    endpoint: 'http://localhost:3004',
    discoveryEndpoint: '/rest/api/content'
  },
  {
    id: 'composio',
    name: 'Composio Integration Platform',
    category: 'automation',
    description: 'Multi-platform integrations and API orchestration',
    capabilities: [
      'api_orchestration', 'multi_platform_integration', 'data_sync',
      'webhook_management', 'auth_management'
    ],
    contextPrompt: `
      Composio Integration Platform specializes in:
      - API orchestration and management
      - Multi-platform integrations
      - Data synchronization between systems
      - Webhook and event management
      - Authentication and authorization
      
      Use when user mentions: integrations, APIs, data sync, webhooks, orchestration, Composio
    `,
    endpoint: 'http://localhost:3005',
    discoveryEndpoint: '/api/apps'
  },
  {
    id: 'context7',
    name: 'Context7 Development Standards',
    category: 'development',
    description: 'Development standards, templates, and best practices',
    capabilities: [
      'code_standards', 'template_management', 'best_practices',
      'code_review', 'development_guidelines'
    ],
    contextPrompt: `
      Context7 Development Standards specializes in:
      - Code standards and guidelines
      - Template creation and management
      - Best practices enforcement
      - Code review and quality assurance
      - Development methodology guidance
      
      Use when user mentions: standards, templates, best practices, code quality, guidelines, Context7
    `,
    endpoint: 'http://localhost:3006',
    discoveryEndpoint: '/api/templates'
  }
]

export class MCPContextMapper {
  private openRouterApiKey: string = ''
  
  constructor(apiKey?: string) {
    if (apiKey) {
      this.openRouterApiKey = apiKey
    }
  }
  
  setApiKey(apiKey: string) {
    this.openRouterApiKey = apiKey
  }
  
  // Main context mapping function using OpenRouter AI
  async mapUserIntentToMCP(
    userQuery: string,
    availableServers: string[] = []
  ): Promise<MCPContextMapping> {
    
    if (!this.openRouterApiKey) {
      throw new Error('OpenRouter API key not configured')
    }
    
    // Filter available servers or use all
    const servers = availableServers.length > 0 
      ? MCP_SERVERS_CONTEXT.filter(s => availableServers.includes(s.id))
      : MCP_SERVERS_CONTEXT
    
    const systemPrompt = this.buildContextMappingPrompt(servers)
    
    try {
      const response = await fetch('/api/llm/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          apiKey: this.openRouterApiKey,
          temperature: 0.3, // Lower temperature for more consistent mapping
          maxTokens: 1000,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Analyze this user query and map it to the most appropriate MCP server and tool: "${userQuery}"`
            }
          ]
        })
      })
      
      if (!response.ok) {
        throw new Error(`OpenRouter API failed: ${response.statusText}`)
      }
      
      const result = await response.json()
      const aiResponse = result.response
      
      // Parse AI response to extract mapping
      return this.parseAIResponse(aiResponse, userQuery)
    } catch (error) {
      console.error('Context mapping failed:', error)
      
      // Fallback to keyword-based mapping
      return this.fallbackKeywordMapping(userQuery, servers)
    }
  }
  
  private buildContextMappingPrompt(servers: MCPServerContext[]): string {
    const serverDescriptions = servers.map(server => 
      `${server.id}: ${server.name} - ${server.description}\nCapabilities: ${server.capabilities.join(', ')}\nContext: ${server.contextPrompt}`
    ).join('\n\n')
    
    return `
You are an expert MCP (Model Context Protocol) context mapper for UpTax Flow platform.

Your job is to analyze user queries and map them to the most appropriate MCP server and tool.

Available MCP Servers:
${serverDescriptions}

INSTRUCTIONS:
1. Analyze the user's intent and keywords
2. Match the query to the most appropriate server based on capabilities and context
3. Suggest the most likely tool name (even if you're not 100% sure about the exact name)
4. Provide confidence score (0-100)
5. Extract likely parameters from the user query
6. Explain your reasoning

RESPONSE FORMAT (JSON):
{
  "intent": "brief description of user intent",
  "confidence": 85,
  "suggestedServer": "server_id",
  "suggestedTool": "likely_tool_name",
  "parameters": {"param1": "value1"},
  "reasoning": "why this server/tool was chosen"
}

EXAMPLES:
- "Show me overdue invoices" → omie server, consultar_contas_receber tool
- "Create a new task for the team" → atlas-task server, create_task tool
- "List all companies in the system" → nibo server, listar_empresas tool
- "Set up automation workflow" → n8n-mcp server, create_workflow tool
    `.trim()
  }
  
  private parseAIResponse(aiResponse: string, originalQuery: string): MCPContextMapping {
    try {
      // Try to extract JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          intent: parsed.intent || originalQuery,
          confidence: parsed.confidence || 50,
          suggestedServer: parsed.suggestedServer || '',
          suggestedTool: parsed.suggestedTool || '',
          parameters: parsed.parameters || {},
          reasoning: parsed.reasoning || 'AI mapping'
        }
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
    }
    
    // Fallback parsing
    return this.fallbackKeywordMapping(originalQuery, MCP_SERVERS_CONTEXT)
  }
  
  private fallbackKeywordMapping(query: string, servers: MCPServerContext[]): MCPContextMapping {
    const lowerQuery = query.toLowerCase()
    
    // Simple keyword matching as fallback
    const keywordMappings = [
      { keywords: ['client', 'customer', 'invoice', 'payment', 'financial'], server: 'omie', tool: 'listar_clientes' },
      { keywords: ['accounting', 'tax', 'compliance', 'fiscal'], server: 'nibo', tool: 'listar_empresas' },
      { keywords: ['task', 'project', 'planning', 'deadline'], server: 'atlas-task', tool: 'list_tasks' },
      { keywords: ['workflow', 'automation', 'n8n'], server: 'n8n-mcp', tool: 'list_workflows' },
      { keywords: ['issue', 'bug', 'sprint', 'jira'], server: 'jira', tool: 'search_issues' },
      { keywords: ['documentation', 'wiki', 'confluence'], server: 'confluence', tool: 'search_content' },
      { keywords: ['integration', 'api', 'composio'], server: 'composio', tool: 'list_integrations' },
      { keywords: ['template', 'standard', 'guideline'], server: 'context7', tool: 'list_templates' }
    ]
    
    for (const mapping of keywordMappings) {
      if (mapping.keywords.some(keyword => lowerQuery.includes(keyword))) {
        return {
          intent: `Query about ${mapping.keywords[0]}`,
          confidence: 60,
          suggestedServer: mapping.server,
          suggestedTool: mapping.tool,
          parameters: {},
          reasoning: `Keyword-based mapping using: ${mapping.keywords.join(', ')}`
        }
      }
    }
    
    // Default fallback
    return {
      intent: query,
      confidence: 30,
      suggestedServer: 'omie',
      suggestedTool: 'listar_clientes',
      parameters: {},
      reasoning: 'Default fallback mapping'
    }
  }
  
  // Get server context by ID
  getServerContext(serverId: string): MCPServerContext | undefined {
    return MCP_SERVERS_CONTEXT.find(s => s.id === serverId)
  }
  
  // Get servers by category
  getServersByCategory(category: MCPServerContext['category']): MCPServerContext[] {
    return MCP_SERVERS_CONTEXT.filter(s => s.category === category)
  }
  
  // Auto-discover tools from a server (Supabase MCP pattern)
  async discoverServerTools(serverId: string): Promise<any[]> {
    const server = this.getServerContext(serverId)
    if (!server || !server.discoveryEndpoint) {
      return []
    }
    
    try {
      const response = await fetch(`${server.endpoint}${server.discoveryEndpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const tools = await response.json()
        return Array.isArray(tools) ? tools : []
      }
    } catch (error) {
      console.error(`Failed to discover tools for ${serverId}:`, error)
    }
    
    return []
  }
}

// Export singleton instance
export const mcpContextMapper = new MCPContextMapper()