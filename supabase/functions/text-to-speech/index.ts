
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
        JSON.stringify({ error: 'Text-to-speech service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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

    if (!response.ok) {
      throw new Error('Text-to-speech API error')
    }

    const audioBuffer = await response.arrayBuffer()
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))

    return new Response(
      JSON.stringify({ 
        audioData: base64Audio,
        contentType: 'audio/mpeg'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Text-to-speech error:', error)
    return new Response(
      JSON.stringify({ error: 'Text-to-speech failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
