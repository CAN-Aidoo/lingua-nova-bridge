
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('TTS Edge Function: Request received');
    
    const requestBody = await req.json();
    console.log('TTS: Parsed Request Body:', requestBody);

    const { text, languageCode } = requestBody;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.error('TTS: Missing or invalid text parameter:', text);
      return new Response(JSON.stringify({ 
        error: 'Text parameter is required and must be a non-empty string'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the ElevenLabs API key from environment
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

    if (!ELEVENLABS_API_KEY) {
      console.error('TTS: ElevenLabs API key not configured');
      return new Response(JSON.stringify({ 
        error: 'Text-to-speech service not configured. Please add your ElevenLabs API key in the Supabase secrets.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('TTS: Making request to ElevenLabs API');
    
    // Use a default voice (Alice)
    const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice voice
    const elevenlabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const elevenlabsPayload = {
      text: text.trim(),
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    };

    console.log('TTS: ElevenLabs API payload:', elevenlabsPayload);

    const response = await fetch(elevenlabsUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify(elevenlabsPayload),
    });

    console.log('TTS: ElevenLabs API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS: ElevenLabs API error response:', errorText);
      
      return new Response(JSON.stringify({
        error: `ElevenLabs API error (${response.status}): ${errorText}`,
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the audio data as arrayBuffer
    const audioBuffer = await response.arrayBuffer();
    console.log('TTS: Audio buffer size:', audioBuffer.byteLength);

    // Convert to base64 for easier handling in the frontend
    const audioArray = new Uint8Array(audioBuffer);
    const audioBase64 = btoa(String.fromCharCode.apply(null, Array.from(audioArray)));

    // Create a data URL for immediate playback
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;

    console.log('TTS: Returning successful response');
    return new Response(
      JSON.stringify({ 
        audioUrl: audioUrl,
        success: true
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('TTS: Edge Function unexpected error:', error);
    console.error('TTS: Error stack:', error.stack);
    return new Response(
      JSON.stringify({
        error: `Internal server error: ${error.message}`,
        type: error.constructor.name
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
