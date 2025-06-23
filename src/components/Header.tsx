import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Settings, Trash2 } from 'lucide-react';

interface Translation {
  id: string;
  source_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  created_at: string;
}

const Header = () => {
  const [translationHistory, setTranslationHistory] = useState<Translation[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10); // Limit to 10 most recent items

      if (error) {
        console.error('Error fetching translation history:', error);
      } else {
        setTranslationHistory(data as Translation[]);
      }
    };

    fetchHistory();

    const subscription = supabase
      .channel('translations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'translations' }, (payload) => {
        setTranslationHistory((prevHistory) => {
          const newHistory = [payload.new as Translation, ...prevHistory];
          // Keep only the 10 most recent items
          return newHistory.slice(0, 10);
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const clearHistory = async () => {
    const { error } = await supabase
      .from('translations')
      .delete()
      .neq('id', ''); // Delete all records

    if (!error) {
      setTranslationHistory([]);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-gradient-to-r from-electric-blue-200 to-punchy-magenta-200">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue-500 via-punchy-magenta-500 to-highlighter-yellow-400 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-white font-brand font-bold text-xl">LV</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-soft-lilac-500 rounded-full animate-brand-bounce"></div>
            </div>
            <div>
              <h1 className="text-2xl font-brand font-bold brand-heading">
                LangVoice
              </h1>
              <Badge 
                variant="secondary" 
                className="text-xs bg-gradient-to-r from-highlighter-yellow-400/20 to-soft-lilac-500/20 border border-punchy-magenta-200 text-gray-700 font-medium"
              >
                ✨ Voice-Powered Translation
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2 bg-white/70 hover:bg-white border-electric-blue-200 hover:border-electric-blue-400 text-gray-700 hover:text-electric-blue-600 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                >
                  <History className="h-4 w-4" />
                  <span className="font-medium">History</span>
                  {translationHistory.length > 0 && (
                    <Badge className="bg-punchy-magenta-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {translationHistory.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-lg border border-electric-blue-200 rounded-2xl shadow-2xl">
                <DialogHeader className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-brand font-bold brand-text-electric">
                      Translation History
                    </DialogTitle>
                    {translationHistory.length > 0 && (
                      <Button
                        onClick={clearHistory}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </DialogHeader>
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-4">
                    {translationHistory.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-electric-blue-100 to-punchy-magenta-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <History className="h-8 w-8 text-electric-blue-500" />
                        </div>
                        <p className="text-gray-500 font-medium">No translations yet</p>
                        <p className="text-gray-400 text-sm mt-1">Start translating to see your history here</p>
                      </div>
                    ) : (
                      translationHistory.map((item, index) => (
                        <div 
                          key={item.id} 
                          className="bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-3 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                          style={{ '--stagger-delay': index } as any}
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-highlighter-yellow-400/10 to-soft-lilac-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                          
                          <div className="flex justify-between items-center text-sm relative z-10">
                            <div className="flex items-center space-x-3">
                              <Badge className="bg-electric-blue-100 text-electric-blue-700 border-electric-blue-200 rounded-lg px-2 py-1">
                                {item.source_language}
                              </Badge>
                              <div className="w-4 h-0.5 bg-gradient-to-r from-electric-blue-400 to-punchy-magenta-400 rounded-full"></div>
                              <Badge className="bg-punchy-magenta-100 text-punchy-magenta-700 border-punchy-magenta-200 rounded-lg px-2 py-1">
                                {item.target_language}
                              </Badge>
                            </div>
                            <span className="text-gray-500 font-medium">
                              {new Date(item.created_at).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="space-y-2 relative z-10">
                            <div className="bg-white/70 rounded-lg p-3 border border-gray-100">
                              <p className="font-medium text-gray-800 leading-relaxed">{item.source_text}</p>
                            </div>
                            <div className="bg-gradient-to-r from-electric-blue-50 to-punchy-magenta-50 rounded-lg p-3 border border-electric-blue-100">
                              <p className="text-gray-700 leading-relaxed">{item.translated_text}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2 bg-white/70 hover:bg-white border-punchy-magenta-200 hover:border-punchy-magenta-400 text-gray-700 hover:text-punchy-magenta-600 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-white/95 backdrop-blur-lg border border-punchy-magenta-200 rounded-2xl shadow-2xl">
                <DialogHeader className="border-b border-gray-100 pb-4">
                  <DialogTitle className="text-2xl font-brand font-bold brand-text-magenta">
                    Settings
                  </DialogTitle>
                </DialogHeader>
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-punchy-magenta-100 to-soft-lilac-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-punchy-magenta-500" />
                  </div>
                  <p className="text-gray-600 font-medium">Settings panel coming soon!</p>
                  <p className="text-gray-400 text-sm mt-1">Customize your translation experience</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
