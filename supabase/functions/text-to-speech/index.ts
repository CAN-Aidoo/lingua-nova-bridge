
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
  const { text, voiceId } = await req.json();

    console.log('Received text:', text ? text.substring(0, 50) + '...' : 'No text');
    console.log('Received voiceId:', voiceId);

    if (!text || !voiceId) {
      return new Response(
        JSON.stringify({ error: 'No text provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const playAiApiKey = Deno.env.get('PLAYAI_API_KEY')
    const playAiUserId = Deno.env.get('PLAYAI_USER_ID')

    console.log('PlayAI API Key present:', !!playAiApiKey);
    console.log('PlayAI User ID present:', !!playAiUserId);

    if (!playAiApiKey || !playAiUserId) {
      return new Response(
        JSON.stringify({ error: 'PlayAI API key or User ID not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Making PlayAI API call for text:', text.substring(0, 50))

    const playAiResponse = await fetch('https://play.ht/api/v2/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': playAiUserId,
        'Authorization': `Bearer ${playAiApiKey}`,
      },
      body: JSON.stringify({
        text,
        voice_id: voiceId, // Changed to voice_id
        output_format: 'mp3',
        quality: 'medium',
        voice_engine: 'PlayHT2.0',
      }),
    });
    
    console.log('PlayAI response status:', playAiResponse.status)

    if (!playAiResponse.ok) {
      const errorText = await playAiResponse.text();
      console.error('PlayAI API Error:', errorText);
      throw new Error(`PlayAI API request failed with status ${playAiResponse.status}: ${errorText}`);
    }

    // Check if response is actually audio or an error message
    const contentType = playAiResponse.headers.get('content-type') || ''
    console.log('Response content type:', contentType)
    
    if (!contentType.includes('audio') && !contentType.includes('mpeg')) {
      const errorText = await playAiResponse.text()
      console.error('PlayAI returned non-audio response:', errorText)
      
      // Common PlayAI error messages
      if (errorText.includes('error')) {
        throw new Error(`PlayAI API Error: ${errorText}`);
      }
      
      throw new Error('PlayAI returned invalid response format');
    }

    const job = await playAiResponse.json();
    const jobId = job.id;

    // Poll for the result
    let result = null;
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
      const jobResponse = await fetch(`https://api.play.ht/api/v2/tts/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${playAiApiKey}`,
          'X-User-ID': playAiUserId,
          'accept': 'application/json'
        }
      });

      result = await jobResponse.json();
      if (result.output) {
        break;
      }
    }

    const audioUrl = result.output.url;
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.arrayBuffer();

    console.log('Audio buffer size:', audioBuffer.byteLength);
    
    // Validate audio data size
    if (audioBuffer.byteLength < 1000) {
      throw new Error('Audio data too small - likely an API error');
    }
    
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

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
        details: 'Check PlayAI API key and service status'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
