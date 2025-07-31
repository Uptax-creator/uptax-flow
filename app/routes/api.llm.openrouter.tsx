import { json, type ActionFunctionArgs } from '@remix-run/cloudflare'
import { createSessionStorage, requireUser } from '~/lib/auth/session'

export async function action({ request, context }: ActionFunctionArgs) {
  const sessionStorage = createSessionStorage(context.cloudflare.env.AUTH_SECRET)
  
  try {
    // Require authentication
    await requireUser(sessionStorage, request)
    
    const body = await request.json()
    const { model, messages, apiKey, temperature = 0.7, maxTokens = 4000 } = body
    
    if (!apiKey) {
      return json({ error: 'OpenRouter API key is required' }, { status: 400 })
    }
    
    if (!model || !messages) {
      return json({ error: 'Model and messages are required' }, { status: 400 })
    }
    
    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://uptax.net', // Required by OpenRouter
        'X-Title': 'UpTax Flow' // Optional title
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false
      })
    })
    
    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text()
      console.error('OpenRouter API error:', errorText)
      
      return json({ 
        error: `OpenRouter API error: ${openRouterResponse.status} ${openRouterResponse.statusText}`,
        details: errorText 
      }, { status: openRouterResponse.status })
    }
    
    const result = await openRouterResponse.json()
    
    // Return the response with usage info
    return json({
      success: true,
      response: result.choices[0]?.message?.content || '',
      usage: result.usage,
      model: result.model,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('OpenRouter integration error:', error)
    
    if (error instanceof Response) {
      throw error // Re-throw auth redirect responses
    }
    
    return json({ 
      error: 'Failed to process OpenRouter request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Test endpoint for OpenRouter connectivity
export async function loader({ request, context }: { request: Request, context: any }) {
  const sessionStorage = createSessionStorage(context.cloudflare.env.AUTH_SECRET)
  
  try {
    await requireUser(sessionStorage, request)
    
    // Return OpenRouter models list
    return json({
      provider: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      status: 'available',
      models: [
        'anthropic/claude-3.5-sonnet',
        'openai/gpt-4o',
        'google/gemini-pro-1.5',
        'meta-llama/llama-3.2-90b-vision-instruct',
        'mistralai/mistral-large'
      ],
      features: ['chat', 'context-aware-mcp-mapping', 'workflow-suggestions'],
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }
    
    return json({ 
      error: 'Authentication required',
      status: 'unauthorized'
    }, { status: 401 })
  }
}