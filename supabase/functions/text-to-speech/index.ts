
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
    const { text, language = 'en', voice = 'Alice' } = await req.json()

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const voiceRssApiKey = Deno.env.get('VOICERSS_API_KEY')
    if (!voiceRssApiKey) {
      return new Response(
        JSON.stringify({ error: 'VoiceRSS API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Making VoiceRSS API call for text:', text.substring(0, 50))

    // VoiceRSS API call
    const voiceRssUrl = 'http://api.voicerss.org/'
    const params = new URLSearchParams({
      key: voiceRssApiKey,
      src: text,
      hl: language,
      v: voice,
      f: '48khz_16bit_stereo',
      c: 'mp3',
    })

    const response = await fetch(`${voiceRssUrl}?${params}`)
    
    console.log('VoiceRSS response status:', response.status)
    console.log('VoiceRSS response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('VoiceRSS API error:', errorText)
      throw new Error(`VoiceRSS API error: ${response.status} - ${errorText}`)
    }

    // Check if response is actually audio or an error message
    const contentType = response.headers.get('content-type') || ''
    console.log('Response content type:', contentType)
    
    if (!contentType.includes('audio') && !contentType.includes('mpeg')) {
      const errorText = await response.text()
      console.error('VoiceRSS returned non-audio response:', errorText)
      
      // Common VoiceRSS error messages
      if (errorText.includes('ERROR')) {
        throw new Error(`VoiceRSS API Error: ${errorText}`)
      }
      
      throw new Error('VoiceRSS returned invalid response format')
    }

    const audioBuffer = await response.arrayBuffer()
    console.log('Audio buffer size:', audioBuffer.byteLength)
    
    // Validate audio data size
    if (audioBuffer.byteLength < 1000) {
      throw new Error('Audio data too small - likely an API error')
    }
    
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

    return new Response(
      JSON.stringify({ 
        audioData: base64Audio,
        contentType: 'audio/mpeg',
        size: audioBuffer.byteLength
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Text-to-speech error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Text-to-speech failed',
        details: 'Check VoiceRSS API key and service status'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
