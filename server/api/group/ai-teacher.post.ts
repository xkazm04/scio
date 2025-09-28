import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const { message, context } = await readBody(event)

    if (!message?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
    }

    // Get OpenAI API key from environment
    const openaiApiKey = useRuntimeConfig().openaiApiKey
    if (!openaiApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'OpenAI API key not configured'
      })
    }

    // Load the AI math teacher prompt
    const promptPath = join(process.cwd(), 'app/prompts/ai-math-teacher.md')
    const systemPrompt = await readFile(promptPath, 'utf-8')

    // Construct context information
    let contextInfo = ''
    if (context?.groupData) {
      contextInfo = `\n\nKONTEXT SKUPINY:\n- Název: ${context.groupData.name}\n- Cíl: ${context.groupData.description}`
    }

    if (context?.goals && context.goals.length > 0) {
      contextInfo += '\n\nAKTUÁLNÍ CÍLE STUDENTA:\n'
      context.goals.forEach((goal: any, index: number) => {
        const status = goal.type === 'boolean' 
          ? (goal.completed ? '✅ Splněno' : '❌ Nesplněno')
          : `📊 ${goal.progress || 0}% (${goal.current || 0}/${goal.target || 0})`
        contextInfo += `${index + 1}. ${goal.title} - ${status}\n`
      })
    }

    if (context?.previousMessages && context.previousMessages.length > 0) {
      contextInfo += '\n\nPOSLEDNÍ ZPRÁVY V KONVERZACI:\n'
      context.previousMessages.forEach((msg: any) => {
        const role = msg.type === 'user' ? 'Student' : 'Učitel'
        contextInfo += `${role}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}\n`
      })
    }

    // Call OpenAI API using gpt-5
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // TODO: Change to 'gpt-5' when available, currently using GPT-4 Omni
        messages: [
          {
            role: 'system',
            content: systemPrompt + contextInfo
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      
      // Fallback response
      throw createError({
        statusCode: openaiResponse.status,
        statusMessage: 'AI Teacher temporarily unavailable'
      })
    }

    const responseData = await openaiResponse.json()
    
    const aiMessage = responseData.choices?.[0]?.message?.content

    if (!aiMessage) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid response from AI teacher'
      })
    }

    return {
      content: aiMessage,
      mode: 'ai',
      context: 'AI Teacher mode active',
      usage: {
        prompt_tokens: responseData.usage?.prompt_tokens,
        completion_tokens: responseData.usage?.completion_tokens,
        total_tokens: responseData.usage?.total_tokens
      }
    }

  } catch (error: any) {
    console.error('LLM API error:', error)
    
    if (error.statusCode) {
      throw error
    }

    // Fallback response when OpenAI fails
    return {
      content: 'Omlouvám se, AI učitel momentálně není dostupný. Zkusíme to za chvilku znovu, nebo můžete přepnout na standardní režim.',
      mode: 'ai',
      error: 'AI Teacher temporarily unavailable',
      fallback: true
    }
  }
})