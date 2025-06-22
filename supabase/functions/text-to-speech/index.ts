
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
    console.log('TTS: Request URL:', req.url);
    
    const requestHeaders = Object.fromEntries(req.headers.entries());
    console.log('TTS: Request Headers:', requestHeaders);

    const contentType = req.headers.get('content-type');
    const contentLength = req.headers.get('content-length');

    console.log('TTS: Content-Type:', contentType);
    console.log('TTS: Content-Length:', contentLength);

    // Read the request body
    let requestBody;
    let rawBody = '';
    
    try {
      rawBody = await req.text();
      console.log('TTS: Raw Request Body length:', rawBody.length);
      console.log('TTS: Raw Request Body (first 500 chars):', rawBody.substring(0, 500));

      if (!rawBody || rawBody.trim() === '') {
        console.error('TTS: Empty request body received');
        return new Response(JSON.stringify({ 
          error: 'Empty request body. Please ensure you are sending text, languageCode, and voiceId parameters.' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      requestBody = JSON.parse(rawBody);
      console.log('TTS: Parsed Request Body:', requestBody);
    } catch (parseError) {
      console.error('TTS: JSON parsing error:', parseError);
      console.error('TTS: Raw body that failed to parse:', rawBody);
      return new Response(JSON.stringify({ 
        error: `Invalid JSON in request body: ${parseError.message}. Raw body: ${rawBody}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text, languageCode, voiceId } = requestBody;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.error('TTS: Missing or invalid text parameter:', text);
      return new Response(JSON.stringify({ 
        error: 'Text parameter is required and must be a non-empty string',
        received: { text, type: typeof text }
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the Speechify API key from environment
    const SPEECHIFY_API_KEY = Deno.env.get('SPEECHIFY_API_KEY');

    if (!SPEECHIFY_API_KEY) {
      console.error('TTS: Speechify API key not configured');
      return new Response(JSON.stringify({ 
        error: 'Text-to-speech service not configured. Please add your Speechify API key in the Supabase secrets.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('TTS: Making request to Speechify API');
    console.log('TTS: Request parameters:', {
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      languageCode: languageCode || 'en',
      voiceId: voiceId ? voiceId.substring(0, 80) + '...' : 'default'
    });

    const speechifyApiUrl = 'https://api.speechify.com/v1/text-to-speech/generate-audio';
    const speechifyPayload = {
      text: text.trim(),
      languageCode: languageCode || 'en',
      voiceId: voiceId || 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b046-324a1749103b/alice/manifest.json',
    };

    console.log('TTS: Speechify API payload:', speechifyPayload);

    const response = await fetch(speechifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SPEECHIFY_API_KEY}`,
      },
      body: JSON.stringify(speechifyPayload),
    });

    console.log('TTS: Speechify API response status:', response.status);
    console.log('TTS: Speechify API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS: Speechify API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Unknown API error' };
      }
      
      return new Response(JSON.stringify({
        error: `Speechify API error (${response.status}): ${errorData.message || JSON.stringify(errorData)}`,
        details: errorData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('TTS: Speechify API success response keys:', Object.keys(data));

    if (!data.audioUrl) {
      console.error('TTS: No audioUrl in Speechify response:', data);
      return new Response(JSON.stringify({
        error: 'No audio URL received from Speechify API',
        speechifyResponse: data
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('TTS: Returning successful response with audioUrl');
    return new Response(
      JSON.stringify({ 
        audioUrl: data.audioUrl,
        success: true,
        debug: { 
          textLength: text.length,
          languageCode: languageCode || 'en', 
          hasVoiceId: !!voiceId
        } 
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
