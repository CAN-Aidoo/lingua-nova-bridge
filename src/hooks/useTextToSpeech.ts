
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const speak = useCallback(async (text: string, languageCode?: string, voiceId?: string) => {
    console.log('TTS: Starting text-to-speech with:', { text, languageCode, voiceId });
    setIsSpeaking(true);
    setError(null);
    
    try {
      // Prepare the request body
      const requestBody = {
        text: text.trim(),
        languageCode: languageCode || 'en',
        voiceId: voiceId || 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b046-324a1749103b/alice/manifest.json'
      };

      console.log('TTS: Sending request with body:', requestBody);

      const { data, error: funcError } = await supabase.functions.invoke('text-to-speech', {
        body: requestBody,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('TTS: Response received:', { data, funcError });

      if (funcError) {
        console.error('TTS: Function error:', funcError);
        throw new Error(funcError.message || 'Text-to-speech service error');
      }

      if (!data) {
        throw new Error('No response data received from text-to-speech service');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.audioUrl) {
        console.log('TTS: Playing audio from URL:', data.audioUrl);
        const audio = new Audio(data.audioUrl);
        audio.onloadeddata = () => {
          console.log('TTS: Audio loaded successfully');
        };
        audio.onerror = (e) => {
          console.error('TTS: Audio playback error:', e);
          throw new Error('Failed to play audio');
        };
        await audio.play();
        
        // Create blob for download if needed
        try {
          const response = await fetch(data.audioUrl);
          const blob = await response.blob();
          setAudioBlob(blob);
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
