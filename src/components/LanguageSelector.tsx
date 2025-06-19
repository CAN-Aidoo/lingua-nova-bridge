
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { Language } from '../types/language';
import { languages, languageRegions } from '../data/languages';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  showAutoDetect?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  showAutoDetect = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredLanguages = useMemo(() => {
    let filtered = languages.filter(lang => 
      showAutoDetect || lang.code !== 'auto'
    );

    if (searchQuery) {
      filtered = filtered.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(lang => lang.region === selectedRegion);
    }

    return filtered;
  }, [searchQuery, selectedRegion, showAutoDetect]);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setOpen(false);
    setSearchQuery('');
  };

  const getLanguageFlag = (language: Language) => {
    // Mock flag emoji - in real app, you'd have proper flag assets
    const flagMap: { [key: string]: string } = {
      'auto': '🌐',
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'zh': '🇨🇳',
      'ar': '🇸🇦',
      'hi': '🇮🇳',
    };
    return flagMap[language.code] || '🌍';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 px-4"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getLanguageFlag(selectedLanguage)}</span>
            <div className="text-left">
              <div className="font-medium">{selectedLanguage.name}</div>
              {selectedLanguage.nativeName !== selectedLanguage.name && (
                <div className="text-xs text-gray-500">{selectedLanguage.nativeName}</div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedLanguage.hasSTT && (
              <Badge variant="secondary" className="text-xs">STT</Badge>
            )}
            {selectedLanguage.hasTTS && (
              <Badge variant="secondary" className="text-xs">TTS</Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Region Filter */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant={selectedRegion === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedRegion('all')}
              className="text-xs"
            >
              All Regions
            </Button>
            {languageRegions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedRegion(region)}
                className="text-xs"
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
        
        <ScrollArea className="h-72">
          <div className="p-2">
            {filteredLanguages.map((language) => (
              <Button
                key={language.code}
                variant="ghost"
                className="w-full justify-start h-auto p-3 mb-1"
                onClick={() => handleLanguageSelect(language)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <span className="text-lg">{getLanguageFlag(language)}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{language.name}</div>
                    {language.nativeName !== language.name && (
                      <div className="text-xs text-gray-500">{language.nativeName}</div>
                    )}
                    <div className="text-xs text-gray-400">{language.region}</div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {language.hasSTT && (
                      <Badge variant="outline" className="text-xs">STT</Badge>
                    )}
                    {language.hasTTS && (
                      <Badge variant="outline" className="text-xs">TTS</Badge>
                    )}
                  </div>
                </div>
              </Button>
            ))}
            
            {filteredLanguages.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No languages found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
