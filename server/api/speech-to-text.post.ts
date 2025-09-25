import { ElevenLabsClient } from "elevenlabs";

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

    // Initialize ElevenLabs client
    const elevenLabs = new ElevenLabsClient({
      apiKey: elevenLabsApiKey
    })

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(body.audio, 'base64')

    // Create a blob-like object for the API
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' })

    // Call ElevenLabs Speech-to-Text API
    const transcription = await elevenLabs.speechToText.createSpeechToText({
      audio: audioBlob,
      model_id: "eleven_multilingual_v2", // Supports Czech language
      language_code: "cs", // Czech language code
    })

    return {
      success: true,
      transcription: transcription.text,
      language: transcription.language_code
    }

  } catch (error: any) {
    console.error('Speech-to-text error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to process speech-to-text'
    })
  }
})
