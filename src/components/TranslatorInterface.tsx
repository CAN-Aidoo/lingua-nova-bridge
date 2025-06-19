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

const TranslatorInterface = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language>(languages[0]); // Auto-detect
  const [targetLanguage, setTargetLanguage] = useState<Language>(languages[1]); // English
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Simulate translation with delay
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to translate",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock translation - in real app, this would call Lara Translate API
      const mockTranslation = `[${targetLanguage.name} translation of: "${inputText}"]`;
      setOutputText(mockTranslation);
      setIsTranslating(false);
      
      toast({
        title: "Translation completed",
        description: `Translated to ${targetLanguage.name}`,
      });
    }, 1500);
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
    <div className="space-y-responsive">
      {/* Skip link for keyboard navigation */}
      <a href="#translation-content" className="skip-link">
        Skip to translation interface
      </a>

      {/* Language Selection Header */}
      <Card className="p-6 gesture-spacing">
        <div className="flex flex-col md:flex-row items-center gap-responsive mobile-stack">
          <div className="flex-1 w-full md:w-auto mobile-full">
            <label className="block text-sm font-medium text-gray-700 mb-2" id="source-lang-label">
              From
            </label>
            <LanguageSelector
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              showAutoDetect={true}
            />
          </div>
          
          <div className="flex items-center justify-center mobile-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={swapLanguages}
              className="rounded-full touch-target hover:bg-gray-100 transition-colors focus-enhanced"
              aria-label="Swap source and target languages"
            >
              <ArrowRight className="h-5 w-5 transform rotate-90 md:rotate-0" aria-hidden="true" />
            </Button>
          </div>
          
          <div className="flex-1 w-full md:w-auto mobile-full">
            <label className="block text-sm font-medium text-gray-700 mb-2" id="target-lang-label">
              To
            </label>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
              showAutoDetect={false}
            />
          </div>
        </div>
      </Card>

      {/* Translation Areas */}
      <div 
        className="grid md:grid-cols-2 gap-responsive tablet-grid desktop-grid"
        id="translation-content"
      >
        {/* Input Area */}
        <Card className="p-6 gesture-spacing">
          <div className="space-y-4">
            <div className="flex items-center justify-between mobile-stack mobile-center">
              <h3 className="text-responsive-lg font-semibold text-gray-900">
                {sourceLanguage.name}
              </h3>
              <AudioControls
                isListening={isListening}
                onToggleListening={() => setIsListening(!isListening)}
                language={sourceLanguage}
                mode="input"
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
        </Card>

        {/* Output Area */}
        <Card className="p-6 gesture-spacing">
          <div className="space-y-4">
            <div className="flex items-center justify-between mobile-stack mobile-center">
              <h3 className="text-responsive-lg font-semibold text-gray-900">
                {targetLanguage.name}
              </h3>
              <AudioControls
                language={targetLanguage}
                mode="output"
                text={outputText}
              />
            </div>
            <TextOutputArea
              value={outputText}
              language={targetLanguage}
              isTranslating={isTranslating}
            />
          </div>
        </Card>
      </div>

      {/* Manual Translation Button */}
      <div className="text-center mobile-center">
        <Button
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          size="lg"
          className="bg-gradient-to-r from-ocean-blue-500 to-teal-500 hover:from-ocean-blue-600 hover:to-teal-600 text-white px-8 py-3 touch-target focus-enhanced"
          aria-describedby="translate-button-desc"
        >
          {isTranslating ? (
            <>
              <div 
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" 
                aria-hidden="true"
              ></div>
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </Button>
        <div id="translate-button-desc" className="sr-only">
          Click to manually translate the entered text
        </div>
      </div>
    </div>
  );
};

export default TranslatorInterface;
