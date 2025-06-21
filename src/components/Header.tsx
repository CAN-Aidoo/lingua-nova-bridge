
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Settings } from 'lucide-react';

const Header = () => {
  const [translationHistory, setTranslationHistory] = useState([
    { id: 1, source: 'Hello world', target: 'Hola mundo', from: 'English', to: 'Spanish', timestamp: new Date().toLocaleString() },
    { id: 2, source: 'Good morning', target: 'Buenos días', from: 'English', to: 'Spanish', timestamp: new Date().toLocaleString() },
  ]);

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
                            <span>{item.from} → {item.to}</span>
                            <span>{item.timestamp}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{item.source}</p>
                            <p className="text-gray-600">{item.target}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
