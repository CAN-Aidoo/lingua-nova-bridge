
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const translate = async (
    sourceText: string,
    sourceLang: string,
    targetLang: string,
    userId?: string
  ): Promise<TranslationResult | null> => {
    if (!sourceText.trim()) {
      toast({
        title: "No text to translate",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return null;
    }

    setIsTranslating(true);

    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          sourceText,
          sourceLang,
          targetLang,
          userId,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Translation completed",
        description: `Translated to ${targetLang}`,
      });

      return data;
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: "Please try again later",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translate,
    isTranslating,
  };
};
