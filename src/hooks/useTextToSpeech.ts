
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const speak = async (
    text: string,
    language: string = 'en',
    voice: string = 'Alice'
  ): Promise<void> => {
    if (!text.trim()) return;

    setIsSpeaking(true);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          language,
          voice,
        },
      });

      if (error) {
        throw error;
      }

      // Convert base64 to audio and play
      const audioData = data.audioData;
      const byteCharacters = atob(audioData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: 'audio/mpeg' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Audio playback failed",
          description: "Please try again",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      toast({
        title: "Text-to-speech failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return {
    speak,
    isSpeaking,
  };
};
