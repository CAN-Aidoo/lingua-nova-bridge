
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
        title: "Welcome to Lingua Nova Bridge!",
        description: "Universal translator supporting 200+ languages",
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Lingua Nova Bridge</h1>
          <p className="text-gray-600">Connecting worlds through language...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-blue-50 to-teal-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Universal Language Bridge
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Break down language barriers with our advanced translator supporting 200+ languages, 
              speech recognition, and text-to-speech capabilities for truly universal communication.
            </p>
          </div>
          <TranslatorInterface />
        </div>
      </main>
    </div>
  );
};

export default Index;
