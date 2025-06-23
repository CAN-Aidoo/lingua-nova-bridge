
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
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
    <div className="space-y-10">
      {/* Enhanced Language Selection Header */}
      <div className="relative">
        <div className="brand-card p-10 relative overflow-hidden bg-gradient-to-br from-white via-white to-electric-blue-50/30 border-2 border-transparent shadow-2xl">
          {/* Enhanced decorative background elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-highlighter-yellow-400/15 to-punchy-magenta-500/15 rounded-full -translate-y-20 translate-x-20 animate-playful-scale"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-electric-blue-500/15 to-soft-lilac-500/15 rounded-full translate-y-16 -translate-x-16 animate-squiggle"></div>
          <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-highlighter-yellow-400 rounded-full opacity-20 animate-brand-bounce"></div>
          <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-punchy-magenta-500 rounded-full opacity-30 animate-playful-scale"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
            {/* Source Language */}
            <div className="flex-1 w-full lg:w-auto space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-electric-blue-500 rounded-full animate-glow"></div>
                <label className="block text-xl font-brand font-bold text-gray-800" id="source-lang-label">
                  From Language
                </label>
              </div>
              <div className="relative">
                <LanguageSelector
                  selectedLanguage={sourceLanguage}
                  onLanguageChange={setSourceLanguage}
                  showAutoDetect={true}
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-electric-blue-400 to-punchy-magenta-400 rounded-full opacity-60 animate-brand-bounce"></div>
              </div>
            </div>
            
            {/* Enhanced Swap Button */}
            <div className="flex items-center justify-center my-6 lg:my-0">
              <div className="relative">
                <button
                  onClick={swapLanguages}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue-500 via-punchy-magenta-500 to-highlighter-yellow-400 text-white hover:from-electric-blue-600 hover:via-punchy-magenta-600 hover:to-highlighter-yellow-500 transition-all duration-500 transform hover:scale-110 hover:rotate-180 shadow-2xl group relative overflow-hidden"
                  aria-label="Swap source and target languages"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <ArrowRight className="h-7 w-7 mx-auto transform rotate-90 lg:rotate-0 group-hover:scale-110 transition-transform duration-300 relative z-10" aria-hidden="true" />
                  <Sparkles className="absolute top-1 right-1 h-3 w-3 text-white/70 animate-pulse" />
                </button>
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-soft-lilac-400 rounded-full animate-brand-bounce opacity-70"></div>
              </div>
            </div>
            
            {/* Target Language */}
            <div className="flex-1 w-full lg:w-auto space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-punchy-magenta-500 rounded-full animate-glow"></div>
                <label className="block text-xl font-brand font-bold text-gray-800" id="target-lang-label">
                  To Language
                </label>
              </div>
              <div className="relative">
                <LanguageSelector
                  selectedLanguage={targetLanguage}
                  onLanguageChange={setTargetLanguage}
                  showAutoDetect={false}
                />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-punchy-magenta-400 to-soft-lilac-400 rounded-full opacity-60 animate-squiggle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Translation Areas */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="relative group">
          <div className="brand-card p-8 relative overflow-hidden bg-gradient-to-br from-white to-electric-blue-50/20 hover:shadow-2xl transition-all duration-500 border-l-4 border-electric-blue-400">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-electric-blue-400/10 to-highlighter-yellow-400/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-electric-blue-500 to-electric-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">IN</span>
                  </div>
                  <h3 className="text-2xl font-brand font-bold brand-text-electric">
                    {sourceLanguage.name}
                  </h3>
                </div>
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
                placeholder={`Start typing in ${sourceLanguage.name}...`}
                isListening={isListening}
              />
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="relative group">
          <div className="brand-card p-8 relative overflow-hidden bg-gradient-to-br from-white to-punchy-magenta-50/20 hover:shadow-2xl transition-all duration-500 border-l-4 border-punchy-magenta-400">
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-punchy-magenta-400/10 to-soft-lilac-400/10 rounded-full translate-y-14 -translate-x-14 group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-punchy-magenta-500 to-punchy-magenta-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">OUT</span>
                  </div>
                  <h3 className="text-2xl font-brand font-bold brand-text-magenta">
                    {targetLanguage.name}
                  </h3>
                </div>
                <AudioControls
                  language={targetLanguage}
                  mode="output"
                  text={outputText}
                  onPlayAudio={() => speak(outputText, targetLanguage.code)}
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
      </div>

      {/* Enhanced Manual Translation Button */}
      <div className="text-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-highlighter-yellow-400/20 to-soft-lilac-500/20 rounded-full animate-pulse"></div>
        </div>
        
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          className="relative z-10 bg-gradient-to-r from-electric-blue-500 via-punchy-magenta-500 to-highlighter-yellow-400 hover:from-electric-blue-600 hover:via-punchy-magenta-600 hover:to-highlighter-yellow-500 text-white font-brand font-bold text-xl px-16 py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
          aria-describedby="translate-button-desc"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-highlighter-yellow-400/20 to-soft-lilac-500/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
          
          <span className="relative z-10 flex items-center justify-center space-x-3">
            {isTranslating ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                <span>Translating Magic...</span>
                <Sparkles className="h-5 w-5 animate-pulse" />
              </>
            ) : (
              <>
                <Zap className="h-6 w-6" />
                <span>Translate Now</span>
                <Sparkles className="h-5 w-5" />
              </>
            )}
          </span>
          
          <div className="absolute top-1 right-4 w-2 h-2 bg-white/60 rounded-full animate-brand-bounce"></div>
          <div className="absolute bottom-2 left-6 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
        </button>
        
        <div id="translate-button-desc" className="sr-only">
          Click to manually translate the entered text with AI-powered precision
        </div>
      </div>
    </div>
  );
};

export default TranslatorInterface;
