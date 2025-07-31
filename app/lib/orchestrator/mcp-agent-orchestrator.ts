/**
 * MCP Agent Orchestrator - AI-First Integration Management
 * 
 * Inspired by:
 * - Supabase MCP patterns (auto-discovery)
 * - Business Integrations Graph (tool relationships)
 * - LLM Suite context patterns
 * 
 * This orchestrator coordinates multiple MCP servers using AI intelligence
 */

import { mcpContextMapper, type MCPContextMapping } from '../integrations/mcp-context-mapper'
import { mcpManager } from '../integrations/mcp-config'

export interface WorkflowStep {
  id: string
  serverId: string
  toolName: string
  parameters: Record<string, any>
  dependsOn?: string[] // Dependencies on other steps
  output?: any
  status: 'pending' | 'running' | 'completed' | 'failed'
  error?: string
}

export interface MCPWorkflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  status: 'draft' | 'running' | 'completed' | 'failed' 
  results: Record<string, any>
  createdAt: Date
  executedAt?: Date
  completedAt?: Date
}

export interface MCPIntegrationRelationship {
  fromServer: string
  fromTool: string
  toServer: string
  toTool: string
  relationshipType: 'data_flow' | 'dependency' | 'complement' | 'alternative'
  description: string
  confidence: number
}

// Business Integration Graph - Known Tool Relationships
const TOOL_RELATIONSHIPS: MCPIntegrationRelationship[] = [
  // Omie → Nibo Integration Flow
  {
    fromServer: 'omie',
    fromTool: 'listar_clientes',
    toServer: 'nibo',
    toTool: 'incluir_cliente_nibo',
    relationshipType: 'data_flow',
    description: 'Export Omie clients to Nibo for accounting',
    confidence: 90
  },
  {
    fromServer: 'omie',
    fromTool: 'consultar_contas_pagar',
    toServer: 'nibo',
    toTool: 'consultar_financeiro_nibo',
    relationshipType: 'complement',
    description: 'Cross-reference accounts payable data',
    confidence: 85
  },
  
  // Atlas Tasks → Jira Integration
  {
    fromServer: 'atlas-task',
    fromTool: 'create_task',
    toServer: 'jira',
    toTool: 'create_issue',
    relationshipType: 'data_flow',
    description: 'Sync Atlas tasks to Jira issues',
    confidence: 88
  },
  
  // N8N Workflow Orchestration
  {
    fromServer: 'n8n-mcp',
    fromTool: 'execute_workflow',
    toServer: 'omie',
    toTool: 'consultar_categorias',
    relationshipType: 'dependency',
    description: 'N8N workflows can trigger Omie queries',
    confidence: 80
  },
  
  // Documentation & Knowledge Flow
  {
    fromServer: 'jira',
    fromTool: 'search_issues',
    toServer: 'confluence',
    toTool: 'create_page',
    relationshipType: 'complement',
    description: 'Document Jira issues as Confluence pages',
    confidence: 75
  },
  
  // Composio API Orchestration
  {
    fromServer: 'composio',
    fromTool: 'execute_action',
    toServer: 'omie',
    toTool: 'incluir_projeto',
    relationshipType: 'data_flow',
    description: 'Composio can create Omie projects via API',
    confidence: 85
  }
]

export class MCPAgentOrchestrator {
  private workflows: Map<string, MCPWorkflow> = new Map()
  private executionQueue: WorkflowStep[] = []
  private isProcessing = false
  
  // AI-powered workflow creation from natural language
  async createWorkflowFromIntent(
    userIntent: string,
    openRouterApiKey?: string
  ): Promise<MCPWorkflow> {
    
    if (openRouterApiKey) {
      mcpContextMapper.setApiKey(openRouterApiKey)
    }
    
    // Step 1: Parse user intent with AI
    const primaryMapping = await mcpContextMapper.mapUserIntentToMCP(userIntent)
    
    // Step 2: Find related tools using Business Integration Graph
    const relatedMappings = this.findRelatedTools(primaryMapping)
    
    // Step 3: Create workflow steps
    const steps: WorkflowStep[] = [
      {
        id: 'primary',
        serverId: primaryMapping.suggestedServer,
        toolName: primaryMapping.suggestedTool,
        parameters: primaryMapping.parameters,
        status: 'pending'
      }
    ]
    
    // Add related steps based on relationships
    relatedMappings.forEach((mapping, index) => {
      steps.push({
        id: `related_${index}`,
        serverId: mapping.toServer,
        toolName: mapping.toTool,
        parameters: {},
        dependsOn: ['primary'], // Depend on primary step
        status: 'pending'
      })
    })
    
    // Step 4: Create workflow
    const workflow: MCPWorkflow = {
      id: `workflow_${Date.now()}`,
      name: `AI Workflow: ${userIntent}`,
      description: `Auto-generated workflow based on: "${userIntent}"`,
      steps,
      status: 'draft',
      results: {},
      createdAt: new Date()
    }
    
    this.workflows.set(workflow.id, workflow)
    return workflow
  }
  
  // Find related tools using Business Integration Graph patterns
  private findRelatedTools(primaryMapping: MCPContextMapping): MCPIntegrationRelationship[] {
    return TOOL_RELATIONSHIPS.filter(rel => 
      rel.fromServer === primaryMapping.suggestedServer &&
      rel.fromTool === primaryMapping.suggestedTool
    ).sort((a, b) => b.confidence - a.confidence) // Sort by confidence
  }
  
  // Execute workflow with dependency management
  async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`)
    }
    
    workflow.status = 'running'
    workflow.executedAt = new Date()
    
    try {
      // Execute steps respecting dependencies
      await this.executeStepsWithDependencies(workflow.steps)
      
      workflow.status = 'completed'
      workflow.completedAt = new Date()
      
    } catch (error) {
      workflow.status = 'failed'
      console.error(`Workflow ${workflowId} execution failed:`, error)
      throw error
    }
  }
  
  private async executeStepsWithDependencies(steps: WorkflowStep[]): Promise<void> {
    const completedSteps = new Set<string>()
    const remainingSteps = [...steps]
    
    while (remainingSteps.length > 0) {
      // Find steps that can be executed (dependencies satisfied)
      const readySteps = remainingSteps.filter(step => 
        !step.dependsOn || step.dependsOn.every(dep => completedSteps.has(dep))
      )
      
      if (readySteps.length === 0) {
        throw new Error('Circular dependency detected in workflow')
      }
      
      // Execute ready steps in parallel
      await Promise.all(
        readySteps.map(async (step) => {
          try {
            step.status = 'running'
            step.output = await mcpManager.executeTool(
              step.serverId,
              step.toolName,
              step.parameters
            )
            step.status = 'completed'
            completedSteps.add(step.id)
          } catch (error) {
            step.status = 'failed'
            step.error = error instanceof Error ? error.message : 'Unknown error'
            throw error
          }
        })
      )
      
      // Remove completed steps from remaining
      readySteps.forEach(step => {
        const index = remainingSteps.indexOf(step)
        if (index > -1) {
          remainingSteps.splice(index, 1)
        }
      })
    }
  }
  
  // Get workflow suggestions based on Business Integration Graph
  async suggestWorkflows(userQuery: string, openRouterApiKey?: string): Promise<string[]> {
    if (openRouterApiKey) {
      mcpContextMapper.setApiKey(openRouterApiKey)
    }
    
    const mapping = await mcpContextMapper.mapUserIntentToMCP(userQuery)
    const suggestions: string[] = []
    
    // Find common workflow patterns
    const relatedTools = this.findRelatedTools(mapping)
    
    if (relatedTools.length > 0) {
      relatedTools.forEach(rel => {
        suggestions.push(
          `${mapping.intent} → then ${rel.description} (${rel.confidence}% confidence)`
        )
      })
    }
    
    // Add LLM Suite patterns (context-aware suggestions)
    suggestions.push(
      `Create N8N automation workflow for: ${mapping.intent}`,
      `Generate compliance report combining: ${mapping.suggestedServer} + Nibo data`,
      `Set up Atlas task tracking for: ${mapping.intent}`
    )
    
    return suggestions.slice(0, 5) // Return top 5 suggestions
  }
  
  // Analytics and performance tracking (Business Integration Graph patterns)
  getWorkflowAnalytics() {
    const workflows = Array.from(this.workflows.values())
    
    return {
      totalWorkflows: workflows.length,
      completedWorkflows: workflows.filter(w => w.status === 'completed').length,
      failedWorkflows: workflows.filter(w => w.status === 'failed').length,
      averageExecutionTime: this.calculateAverageExecutionTime(workflows),
      mostUsedServers: this.getMostUsedServers(workflows),
      mostUsedTools: this.getMostUsedTools(workflows),
      successRate: workflows.length > 0 
        ? (workflows.filter(w => w.status === 'completed').length / workflows.length) * 100 
        : 0
    }
  }
  
  private calculateAverageExecutionTime(workflows: MCPWorkflow[]): number {
    const completedWorkflows = workflows.filter(w => w.executedAt && w.completedAt)
    if (completedWorkflows.length === 0) return 0
    
    const totalTime = completedWorkflows.reduce((sum, w) => {
      const duration = w.completedAt!.getTime() - w.executedAt!.getTime()
      return sum + duration
    }, 0)
    
    return totalTime / completedWorkflows.length
  }
  
  private getMostUsedServers(workflows: MCPWorkflow[]): Record<string, number> {
    const serverCount: Record<string, number> = {}
    
    workflows.forEach(workflow => {
      workflow.steps.forEach(step => {
        serverCount[step.serverId] = (serverCount[step.serverId] || 0) + 1
      })
    })
    
    return serverCount
  }
  
  private getMostUsedTools(workflows: MCPWorkflow[]): Record<string, number> {
    const toolCount: Record<string, number> = {}
    
    workflows.forEach(workflow => {
      workflow.steps.forEach(step => {
        const toolKey = `${step.serverId}.${step.toolName}`
        toolCount[toolKey] = (toolCount[toolKey] || 0) + 1
      })
    })
    
    return toolCount
  }
  
  // Get workflow by ID
  getWorkflow(id: string): MCPWorkflow | undefined {
    return this.workflows.get(id)
  }
  
  // Get all workflows
  getAllWorkflows(): MCPWorkflow[] {
    return Array.from(this.workflows.values())
  }
  
  // Delete workflow
  deleteWorkflow(id: string): boolean {
    return this.workflows.delete(id)
  }
}

// Export singleton instance
export const mcpOrchestrator = new MCPAgentOrchestrator()