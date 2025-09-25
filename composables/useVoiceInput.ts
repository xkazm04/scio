export const useVoiceInput = () => {
  const isRecording = ref(false)
  const isProcessing = ref(false)
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const audioChunks = ref<Blob[]>([])

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })
      
      // Create MediaRecorder
      mediaRecorder.value = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      audioChunks.value = []
      
      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data)
        }
      }
      
      mediaRecorder.value.start()
      isRecording.value = true
      
      return true
    } catch (error) {
      console.error('Error starting recording:', error)
      return false
    }
  }

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder.value || !isRecording.value) {
        reject(new Error('No active recording'))
        return
      }

      mediaRecorder.value.onstop = () => {
        // Stop all tracks to release the microphone
        const stream = mediaRecorder.value?.stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }

        // Create audio blob
        const audioBlob = new Blob(audioChunks.value, { 
          type: 'audio/webm;codecs=opus' 
        })
        
        isRecording.value = false
        mediaRecorder.value = null
        
        resolve(audioBlob)
      }

      mediaRecorder.value.onerror = (error) => {
        reject(error)
      }

      mediaRecorder.value.stop()
    })
  }

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    isProcessing.value = true
    
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer()
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      )

      // Send to API
      const response = await fetch('/api/speech-to-text-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio: base64Audio
        })
      })

      const result = await response.json()

      if (result.success) {
        return result.transcription
      } else {
        throw new Error('Transcription failed')
      }
    } catch (error) {
      console.error('Transcription error:', error)
      throw error
    } finally {
      isProcessing.value = false
    }
  }

  const toggleRecording = async (): Promise<string | null> => {
    if (isRecording.value) {
      // Stop recording and transcribe
      try {
        const audioBlob = await stopRecording()
        const transcription = await transcribeAudio(audioBlob)
        return transcription
      } catch (error) {
        console.error('Error processing audio:', error)
        return null
      }
    } else {
      // Start recording
      const success = await startRecording()
      return success ? '' : null
    }
  }

  return {
    isRecording,
    isProcessing,
    toggleRecording,
    startRecording,
    stopRecording,
    transcribeAudio
  }
}
