
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { toast } = useToast();

  const speak = async (
    text: string,
    language: string = 'en',
    voiceId: string // Changed from 'voice' to 'voiceId'
  ): Promise<void> => {
    if (!text.trim()) return;

    setIsSpeaking(true);
    setAudioBlob(null); // Clear previous blob

    try {
      console.log('Starting TTS for text:', text, 'language:', language);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voiceId,
        },
      });

      console.log('Supabase invoke raw data:', data);
      console.log('Supabase invoke raw error:', error);

      if (error) {
        console.error('TTS API error:', error);
        throw error;
      }

      console.log('TTS API response received:', data);

      // Check if we received proper audio data
      const audioData = data?.audioData;
      if (!audioData) {
        throw new Error('No audio data received from TTS service');
      }

      // Check if the response is an error message instead of audio data
      if (typeof audioData === 'string' && audioData.length < 100) {
        console.error('Possible API error response:', audioData);
        throw new Error('Invalid audio data received - API may have returned an error');
      }

      // Convert base64 to Uint8Array properly
      try {
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        console.log('Audio blob size will be:', bytes.length);
        
        // Validate audio data size
        if (bytes.length < 1000) {
          throw new Error('Audio data too small - likely an API error response');
        }
        
        // Create blob with correct MIME type for MP3
        const newAudioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        setAudioBlob(newAudioBlob);
        console.log('Audio blob created, size:', newAudioBlob.size);
        
        const audioUrl = URL.createObjectURL(newAudioBlob);
        const audio = new Audio(audioUrl);
        
        // Set up event handlers before attempting to play
        const cleanup = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.oncanplaythrough = () => {
          console.log('Audio can play through');
          audio.play().catch(playError => {
            console.error('Audio play error:', playError);
            cleanup();
            toast({
              title: "Playback failed",
              description: "Unable to play the audio",
              variant: "destructive",
            });
          });
        };
        
        audio.onended = () => {
          console.log('Audio playback ended');
          cleanup();
        };
        
        audio.onerror = (e) => {
          console.error('Audio error event:', e);
          cleanup();
          toast({
            title: "Audio playback failed",
            description: "The audio format may not be supported or API returned invalid data",
            variant: "destructive",
          });
        };

        // Load the audio
        audio.load();
        
      } catch (decodeError) {
        console.error('Error decoding base64 audio:', decodeError);
        throw new Error('Failed to decode audio data - check PlayAI API response');
      }

    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      toast({
        title: "Text-to-speech failed",
        description: error.message || "Please check your PlayAI API key and try again",
        variant: "destructive",
      });
    }
  };

  return {
    speak,
    isSpeaking,
    audioBlob,
  };
};
