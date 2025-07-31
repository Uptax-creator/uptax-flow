import { json, type ActionFunctionArgs } from '@remix-run/cloudflare'

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const body = await request.json()
    const { model, messages, temperature = 0.7, maxTokens = 1000 } = body
    
    // Use server-side API key from environment
    const apiKey = context.cloudflare.env.OPENROUTER_API_KEY
    
    if (!apiKey) {
      return json({ error: 'OpenRouter API key not configured on server' }, { status: 500 })
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
        'HTTP-Referer': 'https://uptax-flow.pages.dev',
        'X-Title': 'UpTax Flow Chat'
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
        error: `OpenRouter API error: ${openRouterResponse.status}`,
        details: errorText 
      }, { status: openRouterResponse.status })
    }
    
    const result = await openRouterResponse.json()
    
    return json({
      success: true,
      response: result.choices[0]?.message?.content || '',
      usage: result.usage,
      model: result.model,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('OpenRouter chat error:', error)
    
    return json({ 
      error: 'Failed to process chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}