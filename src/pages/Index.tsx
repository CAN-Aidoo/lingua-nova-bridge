
import React, { useState, useEffect } from 'react';
import TranslatorInterface from '../components/TranslatorInterface';
import Header from '../components/Header';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome to LangVoice",
        description: "Your intelligent translation companion is ready",
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-electric-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            LangVoice
          </h1>
          <p className="text-gray-600">Preparing your translation experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-electric-blue-500 to-electric-blue-600 rounded-3xl mb-8 shadow-lg">
            <span className="text-white text-2xl font-semibold">L</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
            Universal Translation
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-electric-blue-600 mb-6">
            Powered by Voice
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience seamless communication across 200+ languages with advanced speech recognition 
            and natural voice synthesis. Break down language barriers effortlessly.
          </p>
        </div>
        
        <TranslatorInterface />
      </main>
    </div>
  );
};

export default Index;
