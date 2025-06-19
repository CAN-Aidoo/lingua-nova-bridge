
import React, { useState, useEffect } from 'react';
import TranslatorInterface from '../components/TranslatorInterface';
import Header from '../components/Header';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome to LangVoice!",
        description: "Your vibrant universal language bridge is ready",
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen brand-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-3xl font-brand font-bold text-white mb-3 animate-brand-bounce">
            LangVoice
          </h1>
          <p className="text-white/90 text-lg">Connecting worlds through vibrant communication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen brand-gradient-bg">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-96 h-96 rounded-full bg-white animate-pulse"></div>
            </div>
            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl font-brand font-bold text-white mb-6 animate-fade-in-up">
                Universal Language Bridge
              </h1>
              <div className="inline-block">
                <h2 className="text-2xl md:text-3xl font-brand font-semibold mb-4 brand-heading animate-fade-in-up delay-100">
                  LangVoice
                </h2>
              </div>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                Break down language barriers with our vibrant translator supporting 200+ languages, 
                speech recognition, and text-to-speech capabilities for truly universal communication.
              </p>
              
              {/* Playful brand elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-highlighter-yellow-400 rounded-full animate-brand-bounce opacity-80"></div>
              <div className="absolute top-1/2 -left-8 w-6 h-6 bg-punchy-magenta-500 rounded-full animate-squiggle opacity-70"></div>
              <div className="absolute bottom-4 right-1/4 w-4 h-4 bg-soft-lilac-500 rounded-full animate-playful-scale opacity-60"></div>
            </div>
          </div>
          
          <div className="relative">
            <TranslatorInterface />
            
            {/* Decorative brand elements */}
            <div className="absolute -top-8 -left-4 w-12 h-12 bg-gradient-to-br from-electric-blue-500 to-punchy-magenta-500 rounded-full opacity-20 animate-squiggle"></div>
            <div className="absolute top-1/2 -right-6 w-8 h-8 bg-gradient-to-br from-highlighter-yellow-400 to-soft-lilac-500 rounded-full opacity-30 animate-brand-bounce"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
