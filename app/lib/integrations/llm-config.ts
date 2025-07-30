/**
 * LLM Integration Configuration for UpTax Flow
 * Supports OpenRouter, OpenAI, and Gemini
 */

export interface LLMProvider {
  id: string
  name: string
  baseUrl: string
  models: LLMModel[]
  requiresAuth: boolean
  defaultModel?: string
}

export interface LLMModel {
  id: string
  name: string
  contextLength: number
  inputPrice: number  // per 1M tokens
  outputPrice: number // per 1M tokens
  capabilities: string[]
}

export const LLM_PROVIDERS: Record<string, LLMProvider> = {
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    requiresAuth: true,
    defaultModel: 'anthropic/claude-3.5-sonnet',
    models: [
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        contextLength: 200000,
        inputPrice: 3.00,
        outputPrice: 15.00,
        capabilities: ['reasoning', 'coding', 'analysis']
      },
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        contextLength: 128000,
        inputPrice: 2.50,
        outputPrice: 10.00,
        capabilities: ['reasoning', 'coding', 'vision']
      },
      {
        id: 'google/gemini-pro-1.5',
        name: 'Gemini Pro 1.5',
        contextLength: 1000000,
        inputPrice: 1.25,
        outputPrice: 3.75,
        capabilities: ['reasoning', 'coding', 'long-context']
      }
    ]
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    requiresAuth: true,
    defaultModel: 'gpt-4o',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        contextLength: 128000,
        inputPrice: 2.50,
        outputPrice: 10.00,
        capabilities: ['reasoning', 'coding', 'vision']
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        contextLength: 128000,
        inputPrice: 0.15,
        outputPrice: 0.60,
        capabilities: ['reasoning', 'coding']
      }
    ]
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    requiresAuth: true,
    defaultModel: 'gemini-1.5-pro',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        contextLength: 1000000,
        inputPrice: 1.25,
        outputPrice: 3.75,
        capabilities: ['reasoning', 'coding', 'long-context']
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        contextLength: 1000000,
        inputPrice: 0.075,
        outputPrice: 0.30,
        capabilities: ['reasoning', 'speed']
      }
    ]
  }
}

// Frontend LLM Configuration Interface
export interface LLMConfigForm {
  provider: string
  model: string
  apiKey: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

// Default configuration for workflow suggestions
export const DEFAULT_LLM_CONFIG: LLMConfigForm = {
  provider: 'openrouter',
  model: 'anthropic/claude-3.5-sonnet',
  apiKey: '',
  temperature: 0.7,
  maxTokens: 4000,
  systemPrompt: `You are an AI assistant specialized in business workflow automation. 
Help users create efficient workflows for their business processes using UpTax Flow platform.`
}

// Validation functions
export function validateLLMConfig(config: LLMConfigForm): string[] {
  const errors: string[] = []
  
  if (!config.provider) {
    errors.push('Provider is required')
  }
  
  if (!config.model) {
    errors.push('Model is required')
  }
  
  if (!config.apiKey) {
    errors.push('API Key is required')
  }
  
  if (config.temperature && (config.temperature < 0 || config.temperature > 2)) {
    errors.push('Temperature must be between 0 and 2')
  }
  
  if (config.maxTokens && (config.maxTokens < 1 || config.maxTokens > 100000)) {
    errors.push('Max tokens must be between 1 and 100,000')
  }
  
  return errors
}

// Cost estimation
export function estimateCost(
  provider: string, 
  model: string, 
  inputTokens: number, 
  outputTokens: number
): number {
  const providerConfig = LLM_PROVIDERS[provider]
  if (!providerConfig) return 0
  
  const modelConfig = providerConfig.models.find(m => m.id === model)
  if (!modelConfig) return 0
  
  const inputCost = (inputTokens / 1000000) * modelConfig.inputPrice
  const outputCost = (outputTokens / 1000000) * modelConfig.outputPrice
  
  return inputCost + outputCost
}