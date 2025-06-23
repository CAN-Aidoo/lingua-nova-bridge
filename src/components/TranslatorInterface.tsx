
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react';
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
  const [sourceLanguage, setSourceLanguage] = useState<Language>(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState<Language>(languages[1]);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  
  const { translate, isTranslating } = useTranslation();
  const { transcribeAudio, isTranscribing } = useSpeechToText();
  const { speak, isSpeaking } = useTextToSpeech();

  const handleTranslate = async () => {
    const result = await translate(
      inputText,
      sourceLanguage.code,
      targetLanguage.code
    );
    
    if (result) {
      setOutputText(result.translatedText);
      
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
    
    if (inputText && outputText) {
      setInputText(outputText);
      setOutputText(inputText);
    }
  };

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
      {/* Language Selection */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Source Language */}
          <div className="flex-1 w-full space-y-4">
            <label className="block text-lg font-medium text-gray-900">
              From
            </label>
            <LanguageSelector
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              showAutoDetect={true}
            />
          </div>
          
          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={swapLanguages}
              className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all transform hover:scale-105 flex items-center justify-center"
              aria-label="Swap languages"
            >
              <ArrowRight className="h-5 w-5 transform rotate-90 lg:rotate-0" />
            </button>
          </div>
          
          {/* Target Language */}
          <div className="flex-1 w-full space-y-4">
            <label className="block text-lg font-medium text-gray-900">
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
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-gray-900">
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
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-gray-900">
                {targetLanguage.name}
              </h3>
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

      {/* Manual Translation Button */}
      <div className="text-center">
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          className="bg-electric-blue-500 hover:bg-electric-blue-600 disabled:bg-gray-300 text-white font-medium text-lg px-12 py-4 rounded-2xl disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-none"
        >
          <span className="flex items-center justify-center space-x-3">
            {isTranslating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>Translate</span>
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TranslatorInterface;
