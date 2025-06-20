
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useSpeechToText = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { toast } = useToast();

  const transcribeAudio = async (
    audioBlob: Blob,
    language: string = 'auto'
  ): Promise<string | null> => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');
      formData.append('language', language);

      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: formData,
      });

      if (error) {
        throw error;
      }

      return data.text;
    } catch (error) {
      console.error('Speech-to-text error:', error);
      toast({
        title: "Speech recognition failed",
        description: "Please try again",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    transcribeAudio,
    isTranscribing,
  };
};
