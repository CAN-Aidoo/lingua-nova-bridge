
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
        .limit(10);

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
      .neq('id', '');

    if (!error) {
      setTranslationHistory([]);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Refined Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-electric-blue-500 to-electric-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-lg tracking-tight">L</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                LangVoice
              </h1>
              <p className="text-sm text-gray-500 font-medium">Voice Translation</p>
            </div>
          </div>
          
          {/* Clean Action Buttons */}
          <div className="flex items-center space-x-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl h-10 px-4 transition-colors"
                >
                  <History className="h-4 w-4" />
                  <span className="font-medium">History</span>
                  {translationHistory.length > 0 && (
                    <Badge className="bg-electric-blue-500 text-white text-xs h-5 px-2 rounded-full">
                      {translationHistory.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-white/98 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
                <DialogHeader className="border-b border-gray-100 pb-6">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-semibold text-gray-900">
                      Translation History
                    </DialogTitle>
                    {translationHistory.length > 0 && (
                      <Button
                        onClick={clearHistory}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg h-9 px-3"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </DialogHeader>
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-4 pt-4">
                    {translationHistory.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <History className="h-7 w-7 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No translations yet</h3>
                        <p className="text-sm text-gray-500">Your translation history will appear here</p>
                      </div>
                    ) : (
                      translationHistory.map((item) => (
                        <div 
                          key={item.id} 
                          className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-3">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1">
                                {item.source_language}
                              </Badge>
                              <div className="w-6 h-px bg-gray-300"></div>
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-lg px-3 py-1">
                                {item.target_language}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-gray-900 leading-relaxed">{item.source_text}</p>
                            </div>
                            <div className="bg-electric-blue-50 rounded-xl p-4">
                              <p className="text-gray-900 leading-relaxed">{item.translated_text}</p>
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
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl h-10 px-4 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white/98 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
                <DialogHeader className="border-b border-gray-100 pb-6">
                  <DialogTitle className="text-2xl font-semibold text-gray-900">
                    Settings
                  </DialogTitle>
                </DialogHeader>
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-7 w-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-sm text-gray-500">Personalization options will be available here</p>
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
