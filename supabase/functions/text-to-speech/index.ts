
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
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);

    const contentType = req.headers.get('content-type');
    const contentLength = req.headers.get('content-length');

    if (contentLength === '0') {
      console.error('Received request with empty body (Content-Length: 0)');
      return new Response(JSON.stringify({ error: 'Request body is empty' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestBody;
    let rawBody;
    try {
      rawBody = await req.text(); // Read raw body as text
      console.log('Raw Request Body:', rawBody);

      if (contentType && contentType.includes('application/json')) {
        if (rawBody) {
          requestBody = JSON.parse(rawBody);
        } else {
          console.error('Received application/json with empty body.');
          return new Response(JSON.stringify({ error: 'Empty JSON body' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } else {
        console.error('Unexpected Content-Type:', contentType);
        return new Response(JSON.stringify({ error: `Unsupported Content-Type: ${contentType}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (e) {
      console.error('Failed to parse request body as JSON:', e.message, e.stack);
      return new Response(JSON.stringify({ error: `Invalid JSON in request body: ${e.message}. Raw body: ${rawBody}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text, languageCode, voiceId } = requestBody;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Replace with your actual SpeechifyAI API key, ideally from environment variables
    const SPEECHIFY_API_KEY = Deno.env.get('SPEECHIFY_API_KEY');

    if (!SPEECHIFY_API_KEY) {
      return new Response(JSON.stringify({ error: 'SpeechifyAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const speechifyApiUrl = 'https://api.speechify.com/v1/text-to-speech/generate-audio';

    const response = await fetch(speechifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SPEECHIFY_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        languageCode,
        voiceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`SpeechifyAI API error: ${response.status} - ${errorData.message || JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({ audioUrl: data.audioUrl, debug: { text, languageCode, voiceId } }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge Function error:', error.message, error.stack);
    return new Response(
      JSON.stringify({
        error: error.message || 'Edge Function encountered an error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
