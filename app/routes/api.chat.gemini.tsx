import { json, type ActionFunctionArgs } from '@remix-run/cloudflare'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json()
    const { model, messages, apiKey, temperature = 0.7, maxTokens = 1000 } = body
    
    if (!apiKey) {
      return json({ error: 'Gemini API key is required' }, { status: 400 })
    }
    
    if (!model || !messages) {
      return json({ error: 'Model and messages are required' }, { status: 400 })
    }
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({ 
      model: model,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    })
    
    // Convert messages to Gemini format
    const history = messages
      .filter((m: any) => m.role !== 'system')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    
    // Get system message if exists
    const systemMessage = messages.find((m: any) => m.role === 'system')
    const lastUserMessage = messages[messages.length - 1].content
    
    // Prepend system message to the last user message
    const finalPrompt = systemMessage 
      ? `${systemMessage.content}\n\nUser: ${lastUserMessage}`
      : lastUserMessage
    
    // Create chat and send message
    const chat = geminiModel.startChat({
      history: history.slice(0, -1), // All except last message
    })
    
    const result = await chat.sendMessage(finalPrompt)
    const response = await result.response
    
    return json({
      success: true,
      response: response.text(),
      usage: {
        prompt_tokens: 0, // Gemini doesn't provide token counts in the same way
        completion_tokens: 0,
        total_tokens: 0
      },
      model: model,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Gemini chat error:', error)
    
    return json({ 
      error: 'Failed to process Gemini request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}