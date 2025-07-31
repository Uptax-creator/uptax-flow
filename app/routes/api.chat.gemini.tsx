import { json, type ActionFunctionArgs } from '@remix-run/cloudflare'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
    
    // Log API key info (safely)
    console.log('Gemini API - Using key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NO KEY')
    console.log('Gemini API - Model:', model)
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({ 
      model: model,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      }
    })
    
    // Debug logging
    console.log('Gemini API - Input messages:', JSON.stringify(messages, null, 2))
    
    // Get system message if exists
    const systemMessage = messages.find((m: any) => m.role === 'system')
    const lastUserMessage = messages[messages.length - 1].content
    
    // Filter out system messages and convert to Gemini format
    const chatMessages = messages.filter((m: any) => m.role !== 'system')
    
    console.log('Gemini API - Chat messages:', JSON.stringify(chatMessages, null, 2))
    
    // Build history properly - must start with user message
    const history = []
    for (let i = 0; i < chatMessages.length - 1; i++) {
      const msg = chatMessages[i]
      history.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })
    }
    
    // Ensure history starts with user message
    if (history.length > 0 && history[0].role === 'model') {
      // Remove the first model message if it exists
      history.shift()
    }
    
    // Prepare final prompt with system message
    const finalPrompt = systemMessage 
      ? `${systemMessage.content}\n\n${lastUserMessage}`
      : lastUserMessage
    
    console.log('Gemini API - Final history:', JSON.stringify(history, null, 2))
    console.log('Gemini API - Final prompt:', finalPrompt)
    
    // Create chat and send message
    const chat = geminiModel.startChat({
      history: history
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