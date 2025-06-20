
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const language = formData.get('language') as string || 'en'

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: 'No audio file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const assemblyAiApiKey = Deno.env.get('ASSEMBLYAI_API_KEY')
    if (!assemblyAiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Speech-to-text service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Convert audio file to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Upload audio to AssemblyAI
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': assemblyAiApiKey,
        'Content-Type': 'application/octet-stream',
      },
      body: arrayBuffer,
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload audio')
    }

    const { upload_url } = await uploadResponse.json()

    // Create transcription job
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': assemblyAiApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: upload_url,
        language_code: language === 'auto' ? 'en' : language,
      }),
    })

    if (!transcriptResponse.ok) {
      throw new Error('Failed to create transcription job')
    }

    const { id: transcriptId } = await transcriptResponse.json()

    // Poll for completion
    let transcript
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max

    while (attempts < maxAttempts) {
      const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': assemblyAiApiKey,
        },
      })

      transcript = await pollResponse.json()

      if (transcript.status === 'completed') {
        break
      } else if (transcript.status === 'error') {
        throw new Error('Transcription failed')
      }

      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
      attempts++
    }

    if (transcript.status !== 'completed') {
      throw new Error('Transcription timeout')
    }

    return new Response(
      JSON.stringify({ text: transcript.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Speech-to-text error:', error)
    return new Response(
      JSON.stringify({ error: 'Speech-to-text failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
