
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import TextInputArea from './TextInputArea';
import TextOutputArea from './TextOutputArea';
import AudioControls from './AudioControls';
import { Language } from '../types/language';
import { languages } from '../data/languages';
import { useToast } from '../hooks/use-toast';
import { useTranslation } from '../hooks/useTranslation';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const TranslatorInterface = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language>(languages[0]); // Auto-detect
  const [targetLanguage, setTargetLanguage] = useState<Language>(languages[1]); // English
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  
  // Use our real translation services
  const { translate, isTranslating } = useTranslation();
  const { transcribeAudio, isTranscribing } = useSpeechToText();
  const { speak, isSpeaking } = useTextToSpeech();

  // Handle real translation
  const handleTranslate = async () => {
    const result = await translate(
      inputText,
      sourceLanguage.code,
      targetLanguage.code
    );
    
    if (result) {
      setOutputText(result.translatedText);
      
      // Update detected source language if auto-detect was used
      if (sourceLanguage.code === 'auto' && result.detectedSourceLanguage) {
        const detectedLang = languages.find(lang => lang.code === result.detectedSourceLanguage);
        if (detectedLang) {
          setSourceLanguage(detectedLang);
        }
      }
    }
  };

  const swapLanguages = () => {
    if (sourceLanguage.code === 'auto') {
      toast({
        title: "Cannot swap with auto-detect",
        description: "Please select a specific source language first",
        variant: "destructive",
      });
      return;
    }
    
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    
    // Swap text as well if both areas have content
    if (inputText && outputText) {
      setInputText(outputText);
      setOutputText(inputText);
    }
  };

  // Auto-translate when input changes (debounced)
  useEffect(() => {
    if (inputText.trim() && inputText.length > 2) {
      const timer = setTimeout(() => {
        handleTranslate();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [inputText, sourceLanguage, targetLanguage]);

  return (
    <div className="space-y-8">
      {/* Skip link for keyboard navigation */}
      <a href="#translation-content" className="skip-link">
        Skip to translation interface
      </a>

      {/* Language Selection Header */}
      <div className="brand-card p-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-highlighter-yellow-400/20 to-punchy-magenta-500/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-electric-blue-500/20 to-soft-lilac-500/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-lg font-brand font-semibold text-gray-800 mb-3" id="source-lang-label">
              From
            </label>
            <LanguageSelector
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              showAutoDetect={true}
            />
          </div>
          
          <div className="flex items-center justify-center">
            <button
              onClick={swapLanguages}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-electric-blue-500 to-punchy-magenta-500 text-white hover:from-electric-blue-600 hover:to-punchy-magenta-600 transition-all duration-300 transform hover:scale-110 hover:rotate-180 shadow-lg playful-hover"
              aria-label="Swap source and target languages"
            >
              <ArrowRight className="h-6 w-6 mx-auto transform rotate-90 md:rotate-0" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-lg font-brand font-semibold text-gray-800 mb-3" id="target-lang-label">
              To
            </label>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
              showAutoDetect={false}
            />
          </div>
        </div>
      </div>

      {/* Translation Areas */}
      <div 
        className="grid md:grid-cols-2 gap-8"
        id="translation-content"
      >
        {/* Input Area */}
        <div className="brand-card p-8 relative brand-squiggle">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-brand font-bold brand-text-electric">
                {sourceLanguage.name}
              </h3>
              <AudioControls
                isListening={isListening}
                onToggleListening={() => setIsListening(!isListening)}
                language={sourceLanguage}
                mode="input"
                onAudioResult={(audioBlob) => {
                  transcribeAudio(audioBlob, sourceLanguage.code).then(text => {
                    if (text) {
                      setInputText(text);
                    }
                  });
                }}
                isProcessing={isTranscribing}
              />
            </div>
            <TextInputArea
              value={inputText}
              onChange={setInputText}
              language={sourceLanguage}
              placeholder={`Type in ${sourceLanguage.name}...`}
              isListening={isListening}
            />
          </div>
        </div>

        {/* Output Area */}
        <div className="brand-card p-8 relative brand-accent-dot">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-brand font-bold brand-text-magenta">
                {targetLanguage.name}
              </h3>
              <AudioControls
                language={targetLanguage}
                mode="output"
                text={outputText}
                onPlayAudio={() => speak(outputText, targetLanguage.code, 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b046-324a1749103b/alice/manifest.json')}
                isPlaying={isSpeaking}
              />
            </div>
            <TextOutputArea
              value={outputText}
              language={targetLanguage}
              isTranslating={isTranslating}
            />
          </div>
        </div>
      </div>

      {/* Manual Translation Button */}
      <div className="text-center">
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          className="brand-button-primary text-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          aria-describedby="translate-button-desc"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-highlighter-yellow-400/20 to-soft-lilac-500/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
          <span className="relative z-10 flex items-center justify-center">
            {isTranslating ? (
              <>
                <div 
                  className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3" 
                  aria-hidden="true"
                ></div>
                Translating...
              </>
            ) : (
              'Translate Now'
            )}
          </span>
        </button>
        <div id="translate-button-desc" className="sr-only">
          Click to manually translate the entered text
        </div>
      </div>
    </div>
  );
};

export default TranslatorInterface;
