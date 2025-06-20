
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sourceText, sourceLang, targetLang, userId } = await req.json()

    if (!sourceText || !targetLang) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Google Cloud Translation API call
    const googleTranslateApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY')
    if (!googleTranslateApiKey) {
      return new Response(
        JSON.stringify({ error: 'Translation service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${googleTranslateApiKey}`
    
    const translateResponse = await fetch(translateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: sourceText,
        target: targetLang,
        source: sourceLang === 'auto' ? undefined : sourceLang,
      }),
    })

    if (!translateResponse.ok) {
      throw new Error('Translation API error')
    }

    const translateData = await translateResponse.json()
    const translatedText = translateData.data.translations[0].translatedText
    const detectedSourceLang = translateData.data.translations[0].detectedSourceLanguage || sourceLang

    // Store translation in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Save translation
    await supabase.from('translations').insert({
      user_id: userId,
      source_language: detectedSourceLang,
      target_language: targetLang,
      source_text: sourceText,
      translated_text: translatedText,
    })

    // Increment language usage
    await supabase.rpc('increment_language_usage', {
      src_lang: detectedSourceLang,
      tgt_lang: targetLang,
    })

    return new Response(
      JSON.stringify({ 
        translatedText,
        detectedSourceLanguage: detectedSourceLang 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ error: 'Translation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
