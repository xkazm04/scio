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

    // For standard mode, use the existing logic
    if (mode === 'standard') {
      return generateStandardResponse(message, context)
    }

    // For AI mode, use OpenAI
    if (mode === 'ai') {
      return await generateAIResponse(message, context)
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

// Standard response generation (existing logic)
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
    content: responses[Math.floor(Math.random() * responses.length)],
    mode: 'standard'
  }
}

// AI response generation using OpenAI
async function generateAIResponse(message: string, context: any) {
  try {
    // Load the math teacher prompt
    const promptPath = join(process.cwd(), 'app/server/prompts/math-teacher.md')
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

    // For now, return a mock AI response since we don't have OpenAI configured
    // TODO: Replace with actual OpenAI API call
    const aiResponse = await mockOpenAIResponse(message, systemPrompt + contextInfo)

    return {
      content: aiResponse,
      mode: 'ai',
      context: 'AI Teacher mode active'
    }

  } catch (error) {
    console.error('AI response generation error:', error)
    
    // Fallback to standard response if AI fails
    return {
      content: 'Omlouvám se, AI učitel momentálně není dostupný. Zkusme to standardním způsobem.',
      mode: 'standard',
      error: 'AI mode temporarily unavailable'
    }
  }
}

// Mock OpenAI response - replace with actual API call
async function mockOpenAIResponse(message: string, systemPrompt: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))

  // Generate contextual response based on message content
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('diskriminant')) {
    return `Výborně, ptáte se na **diskriminant**! To je klíčový pojem pro pochopení kvadratických rovnic.

**Diskriminant** (označovaný písmenem D) nám říká, kolik kořenů bude mít kvadratická rovnice.

**Vzorec**: D = b² - 4ac

**Co nám hodnota diskriminantu říká?**
• **D > 0**: Rovnice má dva různé reálné kořeny
• **D = 0**: Rovnice má jeden dvojnásobný kořen  
• **D < 0**: Rovnice nemá reálné kořeny (má komplexní kořeny)

**Praktický příklad:**
Pro rovnici 2x² - 7x + 3 = 0:
1) a = 2, b = -7, c = 3
2) D = (-7)² - 4·2·3 = 49 - 24 = 25
3) D = 25 > 0, takže má dva různé kořeny

Rozumíte tomuto postupu? Chcete si vyzkoušet výpočet kořenů?`
  }

  if (lowerMessage.includes('rozdíl') && lowerMessage.includes('lineární')) {
    return `Skvělá otázka! Pojďme si vysvětlit rozdíl mezi **lineární** a **kvadratickou** rovnicí.

**Lineární rovnice** (stupeň 1):
• **Tvar**: ax + b = 0 (kde a ≠ 0)
• **Graf**: Přímka
• **Počet řešení**: Právě jedno
• **Příklad**: 3x - 6 = 0 → x = 2

**Kvadratická rovnice** (stupeň 2):
• **Tvar**: ax² + bx + c = 0 (kde a ≠ 0)
• **Graf**: Parabola
• **Počet řešení**: 0, 1 nebo 2 (podle diskriminantu)
• **Příklad**: x² - 5x + 6 = 0 → x₁ = 2, x₂ = 3

**Hlavní rozdíly:**
1. **Nejvyšší mocnina**: u lineární je x¹, u kvadratické x²
2. **Tvar grafu**: přímka vs. parabola
3. **Počet řešení**: lineární má vždy jedno, kvadratická 0-2

Co vás zajímá více - řešení lineárních, nebo kvadratických rovnic?`
  }

  // General math teacher response
  const responses = [
    `To je zajímavý pohled na problém! Pojďme si to rozebrat společně krok za krokem.

**Nejprve si ujasníme, co víme:**
- Jaké informace máme k dispozici?
- Co přesně se od nás požaduje?

**Potom navrhneme strategii:**
- Který matematický nástroj použijeme?
- Jakým postupem budeme řešení hledat?

Můžete mi říct, jak byste k tomuto problému přistoupili vy?`,

    `Výborně! Vidím, že se snažíte pochopit tento koncept. To je přesně správný přístup k matematice.

**Zkusme si to vysvětlit na příkladu:**
Matematika je jako stavění domu - každý nový pojem staví na tom, co už umíme.

**Váš problém rozložíme na části:**
1. Co už víme a umíme
2. Co je nového
3. Jak to spojíme dohromady

Která část vám dělá největší problém? Začneme od ní.`
  ]

  return responses[Math.floor(Math.random() * responses.length)] ?? responses[0]
}

// Message relevance check
function checkMessageRelevance(message: string): boolean {
  const relevantKeywords = [
    'kvadratická', 'rovnice', 'diskriminant', 'lineární', 'ax²', 'bx', 'matematika',
    'řešení', 'kořen', 'graf', 'parabola', 'vzorec', 'funkce', 'výpočet'
  ]
  
  return relevantKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  )
}