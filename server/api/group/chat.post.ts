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
    const { message, mode = 'standard', context } = await readBody(event)

    if (!message?.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
    }

    // For AI mode, delegate to the AI teacher API
    if (mode === 'ai') {
      try {
        const aiResponse = await $fetch('/api/group/ai-teacher', {
          method: 'POST',
          body: {
            message,
            context
          }
        })
        return aiResponse
      } catch (error) {
        console.error('AI Teacher API error:', error)
        // Fallback to standard mode if AI fails
        return {
          content: 'Omlouvám se, AI učitel momentálně není dostupný. Zkusme to standardním způsobem.',
          mode: 'standard',
          error: 'AI Teacher temporarily unavailable'
        }
      }
    }

    // For standard mode, use human teacher/student communication logic
    if (mode === 'standard') {
      return generateStandardResponse(message, context)
    }

    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid mode specified'
    })

  } catch (error: any) {
    console.error('Chat API error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

// Standard response generation for human teacher/student communication
function generateStandardResponse(message: string, context: any) {
  const isRelevant = checkMessageRelevance(message)
  
  if (!isRelevant) {
    return {
      content: `Rozumím vaší otázce, ale zdá se, že nesouvisí s aktuálním cílem skupiny. Pojďme se zaměřit na kvadratické rovnice! 

Můžete se mě zeptat například:
• Jak vypočítám diskriminant?
• Jaký je rozdíl mezi lineární a kvadratickou rovnicí?
• Můžete mi ukázat příklad řešení?`,
      warning: 'Tato zpráva nesouvisí s cíli skupiny. Zaměřte se na kvadratické rovnice.',
      mode: 'standard'
    }
  }

  // Generate standard response
  const responses = [
    `Výborná otázka! Kvadratické rovnice mají tvar ax² + bx + c = 0, kde a ≠ 0.

**Diskriminant** se počítá jako D = b² - 4ac:
• Pokud D > 0, rovnice má 2 různé reálné kořeny
• Pokud D = 0, rovnice má 1 dvojnásobný kořen  
• Pokud D < 0, rovnice nemá reálné kořeny

Chcete si vyzkoušet konkrétní příklad?`,

    `Skvěle! Hlavní rozdíl mezi lineární a kvadratickou rovnicí:

**Lineární rovnice (ax + b = 0):**
• Graf je přímka
• Maximálně 1 řešení
• Stupeň 1

**Kvadratické rovnice (ax² + bx + c = 0):**
• Graf je parabola  
• Maximálně 2 řešení
• Stupeň 2

Které téma byste chtěli probrat podrobněji?`,

    `Perfekt! Pojďme si ukázat řešení kvadratické rovnice krok za krokem:

**Příklad:** x² - 5x + 6 = 0

1) Identifikujeme: a = 1, b = -5, c = 6
2) Spočítáme diskriminant: D = (-5)² - 4·1·6 = 25 - 24 = 1
3) D > 0, takže má 2 kořeny
4) x₁,₂ = (5 ± √1) / 2 = (5 ± 1) / 2
5) x₁ = 3, x₂ = 2

Zkuste si sami řešit: **2x² - 7x + 3 = 0**`
  ]

  return {
    content: responses[Math.floor(Math.random() * responses.length)] || responses[0],
    mode: 'standard'
  }
}

// Message relevance check for standard mode
function checkMessageRelevance(message: string): boolean {
  const relevantKeywords = [
    'kvadratická', 'rovnice', 'diskriminant', 'lineární', 'ax²', 'bx', 'matematika',
    'řešení', 'kořen', 'graf', 'parabola', 'vzorec', 'funkce', 'výpočet'
  ]
  
  return relevantKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  )
}