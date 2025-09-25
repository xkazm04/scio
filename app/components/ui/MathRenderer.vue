<template>
  <div v-html="renderedContent"></div>
</template>

<script setup lang="ts">
interface Props {
  content: string
}

const props = defineProps<Props>()

// Enhanced math rendering function
const renderedContent = computed(() => {
  let content = props.content

  // Code blocks (triple backticks)
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text'
    return `<div class="my-4">
      <div class="bg-gray-800 text-gray-200 text-xs px-3 py-1 rounded-t-lg font-mono">${language}</div>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto font-mono text-sm"><code class="language-${language}">${code.trim()}</code></pre>
    </div>`
  })

  // Inline code (single backticks) - but not if it's part of a code block
  content = content.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-gray-800/30 rounded text-sm font-mono text-blue-300">$1</code>')

  // Basic markdown-like formatting
  content = content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-gray-200 italic">$1</em>')
    
  // Enhanced mathematical notation rendering
  content = content
    // Complex equations with highlighting (quadratic formula, etc.)
    .replace(/(ax²\s*\+\s*bx\s*\+\s*c\s*=\s*0)/gi, '<span class="inline-block bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-lg font-mono text-blue-200 mx-1">$1</span>')
    .replace(/(x\s*=\s*\(-b\s*±\s*√\(b²\s*-\s*4ac\)\)\s*\/\s*\(2a\))/gi, '<span class="inline-block bg-green-500/20 border border-green-400/30 px-3 py-1 rounded-lg font-mono text-green-200 mx-1">$1</span>')
    .replace(/(D\s*=\s*b²\s*-\s*4ac)/gi, '<span class="inline-block bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-lg font-mono text-purple-200 mx-1">$1</span>')
    
    // Superscripts and subscripts with better styling
    .replace(/([a-zA-Z0-9]+)²/g, '$1<sup class="text-blue-300">2</sup>')
    .replace(/([a-zA-Z0-9]+)³/g, '$1<sup class="text-blue-300">3</sup>')
    .replace(/\^(\d+)/g, '<sup class="text-blue-300">$1</sup>')
    .replace(/\^{([^}]+)}/g, '<sup class="text-blue-300">$1</sup>')
    .replace(/_(\d+)/g, '<sub class="text-blue-300">$1</sub>')
    .replace(/_{([^}]+)}/g, '<sub class="text-blue-300">$1</sub>')
    
    // Mathematical symbols with enhanced styling
    .replace(/\+\-/g, '<span class="text-yellow-300 mx-1">±</span>')
    .replace(/\+-/g, '<span class="text-yellow-300 mx-1">±</span>')
    .replace(/>=|≥/g, '<span class="text-emerald-300 mx-1 font-bold">≥</span>')
    .replace(/<=|≤/g, '<span class="text-emerald-300 mx-1 font-bold">≤</span>')
    .replace(/!=/g, '<span class="text-red-300 mx-1 font-bold">≠</span>')
    .replace(/sqrt\((.*?)\)/g, '<span class="text-yellow-300">√</span>(<span class="text-white">$1</span>)')
    .replace(/\\sqrt/g, '<span class="text-yellow-300">√</span>')
    
    // Square root with overline styling
    .replace(/√\((.*?)\)/g, '<span class="font-mono text-yellow-300">√<span class="border-t border-yellow-300/60 px-1">$1</span></span>')
    
    // Greek letters commonly used in math with color coding
    .replace(/\\alpha/g, '<span class="text-purple-300">α</span>')
    .replace(/\\beta/g, '<span class="text-purple-300">β</span>')
    .replace(/\\gamma/g, '<span class="text-purple-300">γ</span>')
    .replace(/\\delta/g, '<span class="text-purple-300">δ</span>')
    .replace(/\\pi/g, '<span class="text-purple-300">π</span>')
    .replace(/\\theta/g, '<span class="text-purple-300">θ</span>')
    .replace(/\\lambda/g, '<span class="text-purple-300">λ</span>')
    .replace(/\\mu/g, '<span class="text-purple-300">μ</span>')
    .replace(/\\sigma/g, '<span class="text-purple-300">σ</span>')
    
    // Enhanced fraction notation
    .replace(/(\d+)\/(\d+)/g, '<span class="inline-flex flex-col items-center text-sm leading-tight mx-1"><span class="text-white">$1</span><span class="border-b border-current w-full border-gray-400"></span><span class="text-white">$2</span></span>')
    
    // Mathematical operators with enhanced spacing and coloring
    .replace(/(=|≠|≤|≥|<|>)/g, '<span class="text-emerald-300 font-bold mx-2">$1</span>')
    .replace(/(\+)/g, '<span class="text-blue-300 mx-1">$1</span>')
    .replace(/(-)/g, '<span class="text-red-300 mx-1">$1</span>')
    .replace(/(\*|×)/g, '<span class="text-purple-300 mx-1">×</span>')
    .replace(/(÷)/g, '<span class="text-orange-300 mx-1">÷</span>')
    
    // Variables highlighting (mathematical variables, typically single letters)
    .replace(/\b([a-z])\b(?![^<]*>)/g, '<span class="text-cyan-300 font-semibold">$1</span>')
    
    // Numbers highlighting in mathematical context
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-amber-300 font-medium">$1</span>')
    
    // Mathematical functions
    .replace(/\b(sin|cos|tan|log|ln|exp|sqrt|abs)\b/g, '<span class="text-teal-300 font-mono">$1</span>')
    
    // Line breaks
    .replace(/\n/g, '<br>')

  return content
})
</script>

<style scoped>
/* Enhanced math styling */
:deep(sup) {
  font-size: 0.7em;
  vertical-align: super;
  color: rgb(147 197 253); /* blue-300 */
}

:deep(sub) {
  font-size: 0.7em;
  vertical-align: sub;
  color: rgb(147 197 253); /* blue-300 */
}

/* Fraction styling improvements */
:deep(.inline-flex) {
  font-size: 0.9em;
  margin: 0 2px;
}
</style>