import { useEffect, useState } from 'react'
import type { LLMConfigForm } from '~/lib/integrations/llm-config'

interface AutoConfigLoaderProps {
  onConfigLoaded: (config: LLMConfigForm) => void
  onError: (error: string) => void
}

interface CredentialsData {
  openrouter?: {
    api_key: string
    project_id: string
  }
  omie_app_key?: string
  omie_app_secret?: string
  n8n?: {
    webhook_url: string
    auth_token: string
  }
  jira?: {
    url: string
    user_email: string
    api_token: string
  }
  confluence?: {
    url: string
    user_email: string
    api_token: string
  }
  composio?: {
    api_key: string
    workspace_id: string
  }
}

export default function AutoConfigLoader({ onConfigLoaded, onError }: AutoConfigLoaderProps) {
  const [loading, setLoading] = useState(true)
  const [credentialsFound, setCredentialsFound] = useState(false)

  useEffect(() => {
    loadCredentialsConfig()
  }, [])

  const loadCredentialsConfig = async () => {
    try {
      // Try to load from local endpoint (in production this would be secured)
      const response = await fetch('/api/credentials/load', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const credentials: CredentialsData = await response.json()
        
        if (credentials.openrouter?.api_key) {
          const autoConfig: LLMConfigForm = {
            provider: 'openrouter',
            model: 'anthropic/claude-3.5-sonnet',
            apiKey: credentials.openrouter.api_key,
            temperature: 0.7,
            maxTokens: 4000,
            systemPrompt: `You are an AI assistant specialized in business workflow automation and MCP integration. 
Help users create efficient workflows for their business processes using UpTax Flow platform.

Available Systems:
- Omie ERP: Financial management and customer relations
- Nibo: Accounting and tax compliance
- N8N: Workflow automation
- Jira: Issue tracking and project management
- Confluence: Documentation and knowledge management
- Composio: API integration platform

Context: You have access to Brazilian business systems and should understand Portuguese business terms.`
          }
          
          onConfigLoaded(autoConfig)
          setCredentialsFound(true)
        } else {
          onError('OpenRouter API key not found in credentials')
        }
      } else {
        // Fallback to manual configuration
        onError('No credentials file found - manual configuration required')
      }
    } catch (error) {
      onError(`Failed to load credentials: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800 text-sm">Loading configuration from credentials.json...</span>
        </div>
      </div>
    )
  }

  if (credentialsFound) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span className="text-green-800 text-sm font-medium">✅ Auto-configured from credentials.json</span>
        </div>
        <div className="mt-2 text-green-700 text-xs">
          <p>• OpenRouter API configured</p>
          <p>• Claude 3.5 Sonnet model selected</p>
          <p>• Business context prompt loaded</p>
          <p>• Ready for MCP integration testing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
        <span className="text-yellow-800 text-sm font-medium">⚠️ Manual configuration required</span>
      </div>
      <div className="mt-2 text-yellow-700 text-xs">
        <p>Create a credentials.json file with your OpenRouter API key to enable auto-configuration.</p>
      </div>
    </div>
  )
}