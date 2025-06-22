
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
    console.log('TTS: Request Method:', req.method);
    console.log('TTS: Request Headers:', Object.fromEntries(req.headers.entries()));

    const contentType = req.headers.get('content-type');
    const contentLength = req.headers.get('content-length');

    console.log('TTS: Content-Type:', contentType);
    console.log('TTS: Content-Length:', contentLength);

    if (contentLength === '0' || contentLength === null) {
      console.error('TTS: Received request with empty body (Content-Length: 0)');
      return new Response(JSON.stringify({ 
        error: 'Request body is empty. Please provide text, languageCode, and voiceId.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestBody;
    try {
      const rawBody = await req.text();
      console.log('TTS: Raw Request Body:', rawBody);

      if (!rawBody) {
        console.error('TTS: Empty request body received');
        return new Response(JSON.stringify({ error: 'Empty request body' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      requestBody = JSON.parse(rawBody);
      console.log('TTS: Parsed Request Body:', requestBody);
    } catch (parseError) {
      console.error('TTS: JSON parsing error:', parseError);
      return new Response(JSON.stringify({ 
        error: `Invalid JSON in request body: ${parseError.message}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text, languageCode, voiceId } = requestBody;

    if (!text || text.trim().length === 0) {
      console.error('TTS: Missing or empty text parameter');
      return new Response(JSON.stringify({ error: 'Text parameter is required and cannot be empty' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the Speechify API key from environment
    const SPEECHIFY_API_KEY = Deno.env.get('SPEECHIFY_API_KEY');

    if (!SPEECHIFY_API_KEY) {
      console.error('TTS: Speechify API key not configured');
      return new Response(JSON.stringify({ error: 'Text-to-speech service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('TTS: Making request to Speechify API with:', {
      text: text.substring(0, 50) + '...',
      languageCode,
      voiceId: voiceId?.substring(0, 50) + '...'
    });

    const speechifyApiUrl = 'https://api.speechify.com/v1/text-to-speech/generate-audio';

    const response = await fetch(speechifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SPEECHIFY_API_KEY}`,
      },
      body: JSON.stringify({
        text: text.trim(),
        languageCode: languageCode || 'en',
        voiceId: voiceId || 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b046-324a1749103b/alice/manifest.json',
      }),
    });

    console.log('TTS: Speechify API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS: Speechify API error:', response.status, errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Unknown API error' };
      }
      
      throw new Error(`Speechify API error: ${response.status} - ${errorData.message || JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('TTS: Speechify API success response received');

    if (!data.audioUrl) {
      console.error('TTS: No audioUrl in Speechify response:', data);
      throw new Error('No audio URL received from Speechify API');
    }

    return new Response(
      JSON.stringify({ 
        audioUrl: data.audioUrl,
        debug: { 
          text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          languageCode, 
          voiceId: voiceId?.substring(0, 50) + (voiceId && voiceId.length > 50 ? '...' : '') 
        } 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('TTS: Edge Function error:', error.message, error.stack);
    return new Response(
      JSON.stringify({
        error: error.message || 'Text-to-speech service encountered an error',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
