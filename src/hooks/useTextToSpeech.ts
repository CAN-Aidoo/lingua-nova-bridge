
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const speak = useCallback(async (text: string, languageCode?: string) => {
    console.log('TTS: Starting text-to-speech with:', { text, languageCode });
    setIsSpeaking(true);
    setError(null);
    
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('No text provided for text-to-speech');
      }

      // Prepare the request payload
      const payload = {
        text: text.trim(),
        languageCode: languageCode || 'en'
      };

      console.log('TTS: Sending request with payload:', payload);

      // Call the Supabase edge function
      const { data, error: funcError } = await supabase.functions.invoke('text-to-speech', {
        body: payload
      });

      console.log('TTS: Response received:', { data, funcError });

      if (funcError) {
        console.error('TTS: Function error:', funcError);
        throw new Error(funcError.message || `Text-to-speech service error: ${JSON.stringify(funcError)}`);
      }

      if (!data) {
        throw new Error('No response data received from text-to-speech service');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.audioUrl) {
        console.log('TTS: Playing audio from data URL');
        const audio = new Audio(data.audioUrl);
        
        await new Promise((resolve, reject) => {
          audio.onloadeddata = () => {
            console.log('TTS: Audio loaded successfully');
            resolve(void 0);
          };
          audio.onerror = (e) => {
            console.error('TTS: Audio load error:', e);
            reject(new Error('Failed to load audio'));
          };
          audio.onended = () => {
            console.log('TTS: Audio playback completed');
            setIsSpeaking(false);
          };
        });

        await audio.play();
        
        // Create blob for download if needed
        try {
          const response = await fetch(data.audioUrl);
          if (response.ok) {
            const blob = await response.blob();
            setAudioBlob(blob);
          }
        } catch (blobError) {
          console.warn('TTS: Could not create audio blob for download:', blobError);
        }
      } else {
        throw new Error('No audio URL received from text-to-speech service');
      }

      toast({
        title: "Audio played successfully",
        description: "Text-to-speech conversion completed",
      });

    } catch (err) {
      console.error('TTS: Complete error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during text-to-speech';
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

  return { speak, isSpeaking, error, audioBlob };
};
