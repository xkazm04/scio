export default defineEventHandler(async (event) => {
  try {
    if (event.node.req.method !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
    }

    const config = useRuntimeConfig()
    const elevenLabsApiKey = config.elevenLabsApiKey

    if (!elevenLabsApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'ElevenLabs API key not configured'
      })
    }

    // Get the audio file from the request
    const body = await readBody(event)
    
    if (!body.audio) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Audio data is required'
      })
    }

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(body.audio, 'base64')

    // Prepare form data for ElevenLabs API
    const formData = new FormData()
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' })
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model_id', 'scribe_v1')
    formData.append('language_code', 'cs')

    // Call ElevenLabs Speech-to-Text API directly
    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': elevenLabsApiKey
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw createError({
        statusCode: response.status,
        statusMessage: `ElevenLabs API error: ${errorText}`
      })
    }

    const result = await response.json()

    return {
      success: true,
      transcription: result.text,
      language: result.language_code || 'cs'
    }

  } catch (error: any) {
    console.error('Speech-to-text error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to process speech-to-text'
    })
  }
})