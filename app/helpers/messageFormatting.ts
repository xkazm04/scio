/**
 * Format mathematical expressions with proper HTML formatting
 * Supports superscripts, subscripts, fractions, Greek letters, and mathematical symbols
 */
export function formatMessage(content: string): string {
  let formatted = content
    // Superscripts (powers)
    .replace(/\^(\d+)/g, '<sup>$1</sup>')
    .replace(/\^{([^}]+)}/g, '<sup>$1</sup>')
    
    // Subscripts  
    .replace(/_(\d+)/g, '<sub>$1</sub>')
    .replace(/_{([^}]+)}/g, '<sub>$1</sub>')
    
    // Mathematical expressions with highlighting
    .replace(/ax²\s*\+\s*bx\s*\+\s*c\s*=\s*0/gi, '<span class="bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono text-sm border border-blue-200">ax² + bx + c = 0</span>')
    .replace(/x\s*=\s*\(-b\s*±\s*√\(b²\s*-\s*4ac\)\)\s*\/\s*\(2a\)/gi, '<span class="bg-green-50 text-green-700 px-2 py-1 rounded font-mono text-sm border border-green-200">x = (-b ± √(b² - 4ac)) / (2a)</span>')
    
    // Square roots
    .replace(/√\(([^)]+)\)/g, '<span class="font-mono">√(<span class="border-t border-gray-400">$1</span>)</span>')
    .replace(/√(\w+)/g, '<span class="font-mono">√<span class="border-t border-gray-400">$1</span></span>')
    
    // Fractions (simple)
    .replace(/(\d+)\/(\d+)/g, '<span class="inline-flex flex-col text-center text-sm"><span class="border-b border-gray-400 px-1">$1</span><span class="px-1">$2</span></span>')
    
    // Greek letters
    .replace(/\balpha\b/gi, 'α')
    .replace(/\bbeta\b/gi, 'β')
    .replace(/\bgamma\b/gi, 'γ')
    .replace(/\bdelta\b/gi, 'Δ')
    .replace(/\bpi\b/gi, 'π')
    .replace(/\btheta\b/gi, 'θ')
    .replace(/\blambda\b/gi, 'λ')
    .replace(/\bmu\b/gi, 'μ')
    .replace(/\bsigma\b/gi, 'σ')
    
    // Mathematical operations with better spacing
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s*\*\s*/g, ' × ')
    .replace(/\s*\/\s*/g, ' ÷ ')
    .replace(/\s*=\s*/g, ' = ')
    .replace(/\s*≠\s*/g, ' ≠ ')
    .replace(/\s*≤\s*/g, ' ≤ ')
    .replace(/\s*≥\s*/g, ' ≥ ')
    .replace(/\s*<\s*/g, ' < ')
    .replace(/\s*>\s*/g, ' > ')
    
    // Plus-minus symbol
    .replace(/\+\/-/g, '±')
    .replace(/\+-/g, '±')
    
    // Better formatting for mathematical expressions
    .replace(/\b(\w+)²/g, '$1<sup>2</sup>')
    .replace(/\b(\w+)³/g, '$1<sup>3</sup>')
    
    // Simple markdown-like formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono border">$1</code>')
    .replace(/\n/g, '<br>')

  return formatted
}

/**
 * Format time to Czech locale
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('cs-CZ', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

/**
 * Check if message is relevant to the group's learning objectives
 */
export function checkMessageRelevance(message: string, keywords: string[] = []): boolean {
  const defaultKeywords = [
    'kvadratická', 'rovnice', 'diskriminant', 'lineární', 'ax²', 'bx', 'matematika',
    'řešení', 'kořen', 'graf', 'parabola', 'vzorec'
  ]
  
  const allKeywords = [...defaultKeywords, ...keywords]
  
  return allKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  )
}

/**
 * Generate contextual AI responses for mathematics
 */
export function generateMathResponse(): { content: string } {
  const responses = [
    `Výborná otázka! Kvadratické rovnice mají tvar ax² + bx + c = 0, kde a ≠ 0.

Diskriminant se počítá jako D = b² - 4ac:
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

Zkuste si sami řešit: 2x² - 7x + 3 = 0`
  ]

  const randomIndex = Math.floor(Math.random() * responses.length)
  return {
    content: responses[randomIndex] ?? responses[0] ?? 'Omlouvám se, nastala chyba.'
  }
}

/**
 * Generate off-topic response
 */
export function generateOffTopicResponse(): { content: string; warning: string } {
  return {
    content: `Rozumím vaší otázce, ale zdá se, že nesouvisí s aktuálním cílem skupiny. Pojďme se zaměřit na kvadratické rovnice! 

Můžete se mě zeptat například:
• Jak vypočítám diskriminant?
• Jaký je rozdíl mezi lineární a kvadratickou rovnicí?
• Můžete mi ukázat příklad řešení?`,
    warning: 'Tato zpráva nesouvisí s cíli skupiny. Zaměřte se na kvadratické rovnice.'
  }
}
