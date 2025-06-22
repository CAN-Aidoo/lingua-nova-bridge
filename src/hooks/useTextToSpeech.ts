
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const speak = useCallback(async (text: string, languageCode?: string, voiceId?: string) => {
    setIsSpeaking(true);
    setError(null);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('text-to-speech', {
        body: JSON.stringify({ text, languageCode, voiceId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (funcError) {
        throw funcError;
      }

      if (data && data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        await audio.play();
      } else {
        throw new Error('No audio URL received from text-to-speech function.');
      }
    } catch (err) {
      console.error('Text-to-speech failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during text-to-speech.';
      setError(errorMessage);
      toast({
        title: "Text-to-speech failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSpeaking(false);
    }
  }, [toast]);

  return { speak, isSpeaking, error };
};
