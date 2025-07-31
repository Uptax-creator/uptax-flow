import { json, type LoaderFunctionArgs } from '@remix-run/cloudflare'

export async function loader({ context }: LoaderFunctionArgs) {
  try {
    // Get API keys from environment variables
    const env = context.cloudflare.env
    
    return json({
      openrouter: env.OPENROUTER_API_KEY || '',
      gemini: env.GOOGLE_GENERATIVE_AI_API_KEY || '',
      openai: env.OPENAI_API_KEY || '',
      anthropic: env.ANTHROPIC_API_KEY || ''
    })
    
  } catch (error) {
    console.error('Failed to load credentials:', error)
    
    return json({ 
      error: 'Failed to load credentials',
      openrouter: '',
      gemini: '',
      openai: '',
      anthropic: ''
    }, { status: 500 })
  }
}