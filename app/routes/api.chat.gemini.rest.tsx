import { json, type ActionFunctionArgs } from '@remix-run/cloudflare'

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    const body = await request.json()
    const { model, messages, temperature = 0.7, maxTokens = 1000 } = body
    
    // Use server-side API key from environment
    const apiKey = context.cloudflare.env.GOOGLE_GENERATIVE_AI_API_KEY
    
    if (!apiKey) {
      return json({ error: 'Gemini API key not configured on server' }, { status: 500 })
    }
    
    if (!model || !messages) {
      return json({ error: 'Model and messages are required' }, { status: 400 })
    }
    
    // Get system message if exists
    const systemMessage = messages.find((m: any) => m.role === 'system')
    const chatMessages = messages.filter((m: any) => m.role !== 'system')
    
    // Convert messages to Gemini REST format
    const contents = chatMessages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
    
    // Ensure first message is from user
    if (contents.length > 0 && contents[0].role === 'model') {
      contents.shift()
    }
    
    // If system message exists, prepend to first user message
    if (systemMessage && contents.length > 0) {
      contents[0].parts[0].text = `${systemMessage.content}\n\n${contents[0].parts[0].text}`
    }
    
    // Call Gemini REST API directly
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        }
      })
    })
    
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini REST API error:', errorText)
      
      return json({ 
        error: `Gemini API error: ${geminiResponse.status}`,
        details: errorText 
      }, { status: geminiResponse.status })
    }
    
    const result = await geminiResponse.json()
    
    return json({
      success: true,
      response: result.candidates?.[0]?.content?.parts?.[0]?.text || '',
      usage: {
        prompt_tokens: result.usageMetadata?.promptTokenCount || 0,
        completion_tokens: result.usageMetadata?.candidatesTokenCount || 0,
        total_tokens: result.usageMetadata?.totalTokenCount || 0
      },
      model: model,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Gemini REST error:', error)
    
    return json({ 
      error: 'Failed to process Gemini request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}