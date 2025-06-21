
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
      console.log('Starting TTS for text:', text, 'language:', language);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          language,
          voice,
        },
      });

      if (error) {
        console.error('TTS API error:', error);
        throw error;
      }

      console.log('TTS API response received');

      // Handle the audio data from VoiceRSS
      const audioData = data.audioData;
      if (!audioData) {
        throw new Error('No audio data received from TTS service');
      }

      // Convert base64 to Uint8Array properly
      try {
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create blob with correct MIME type for MP3
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        console.log('Audio blob created, size:', audioBlob.size);
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Set up event handlers before attempting to play
        audio.oncanplaythrough = () => {
          console.log('Audio can play through');
          audio.play().catch(playError => {
            console.error('Audio play error:', playError);
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
            toast({
              title: "Playback failed",
              description: "Unable to play the audio",
              variant: "destructive",
            });
          });
        };
        
        audio.onended = () => {
          console.log('Audio playback ended');
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = (e) => {
          console.error('Audio error event:', e);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          toast({
            title: "Audio playback failed",
            description: "The audio format may not be supported",
            variant: "destructive",
          });
        };

        audio.onloadstart = () => {
          console.log('Audio loading started');
        };

        audio.onloadeddata = () => {
          console.log('Audio data loaded');
        };

        // Load the audio
        audio.load();
        
      } catch (decodeError) {
        console.error('Error decoding base64 audio:', decodeError);
        throw new Error('Failed to decode audio data');
      }

    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      toast({
        title: "Text-to-speech failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  return {
    speak,
    isSpeaking,
  };
};
