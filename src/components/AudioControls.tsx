
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Language } from '../types/language';
import { useToast } from '../hooks/use-toast';

interface AudioControlsProps {
  language: Language;
  mode: 'input' | 'output';
  text?: string;
  isListening?: boolean;
  onToggleListening?: () => void;
  onAudioResult?: (audioBlob: Blob) => void;
  onPlayAudio?: () => void;
  isProcessing?: boolean;
  isPlaying?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  language,
  mode,
  text,
  isListening = false,
  onToggleListening,
  onAudioResult,
  onPlayAudio,
  isProcessing = false,
  isPlaying = false,
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { toast } = useToast();
  const recordedChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recordedChunks.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks.current, { type: 'audio/wav' });
        if (onAudioResult) {
          onAudioResult(audioBlob);
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      
      toast({
        title: "Recording started",
        description: `Speak in ${language.name}`,
      });
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  const handleMicrophoneClick = async () => {
    if (!language.hasSTT) {
      toast({
        title: "Speech recognition not available",
        description: `Speech-to-text is not supported for ${language.name}`,
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      stopRecording();
      if (onToggleListening) {
        onToggleListening();
      }
    } else {
      await startRecording();
      if (onToggleListening) {
        onToggleListening();
      }
    }
  };

  const handleSpeakerClick = () => {
    if (!language.hasTTS) {
      toast({
        title: "Text-to-speech not available",
        description: `Voice output is not supported for ${language.name}`,
        variant: "destructive",
      });
      return;
    }

    if (!text) {
      toast({
        title: "No text to speak",
        description: "There's no text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    // Only call the parent's onPlayAudio function, don't duplicate TTS calls
    if (onPlayAudio) {
      onPlayAudio();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {mode === 'input' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? "default" : "ghost"}
                size="sm"
                onClick={handleMicrophoneClick}
                disabled={!language.hasSTT || isProcessing}
                className={`relative ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : language.hasSTT 
                      ? 'hover:bg-gray-100' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Microphone Icon */}
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                )}
                
                {/* Pulse Animation for Listening State */}
                {isListening && (
                  <div className="absolute inset-0 rounded-md animate-pulse-ring bg-red-400"></div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language.hasSTT 
                ? (isListening ? 'Stop listening' : 'Start voice input')
                : 'Speech recognition not available'
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {mode === 'output' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSpeakerClick}
                disabled={!language.hasTTS || !text || isPlaying}
                className={`${
                  language.hasTTS && text 
                    ? 'hover:bg-gray-100' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Speaker Icon */}
                {isPlaying ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-3 bg-current animate-pulse"></div>
                    <div className="w-1 h-4 bg-current animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-2 bg-current animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12H4l3-3v6l-3-3h5z"
                    />
                  </svg>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language.hasTTS 
                ? (text ? 'Play translation' : 'No text to play')
                : 'Text-to-speech not available'
              }
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Audio Support Badges */}
      <div className="flex space-x-1">
        {language.hasSTT && mode === 'input' && (
          <Badge variant="outline" className="text-xs">
            STT
          </Badge>
        )}
        {language.hasTTS && mode === 'output' && (
          <Badge variant="outline" className="text-xs">
            TTS
          </Badge>
        )}
      </div>
    </div>
  );
};

export default AudioControls;
