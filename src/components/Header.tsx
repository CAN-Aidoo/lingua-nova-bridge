
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Settings } from 'lucide-react';

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
        .order('created_at', { ascending: false });

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
        setTranslationHistory((prevHistory) => [payload.new as Translation, ...prevHistory]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LV</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">LangVoice</h1>
              <Badge variant="secondary" className="text-xs">
                Voice-Powered Translation
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Translation History</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {translationHistory.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No translations yet</p>
                    ) : (
                      translationHistory.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{item.source_language} → {item.target_language}</span>
                            <span>{new Date(item.created_at).toLocaleString()}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{item.source_text}</p>
                            <p className="text-gray-600">{item.translated_text}</p>
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
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-gray-600">
                  <p>Settings controls will be available here soon.</p>
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
