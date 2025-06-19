
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronDown } from 'lucide-react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Trigger staggered animation when popover opens
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      // Focus search input when popover opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setOpen(false);
    setSearchQuery('');
    
    // Announce selection to screen readers
    const announcement = `Selected ${language.name} language`;
    const ariaLiveRegion = document.getElementById('language-announcement');
    if (ariaLiveRegion) {
      ariaLiveRegion.textContent = announcement;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, language: Language) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageSelect(language);
    }
  };

  const getLanguageFlag = (language: Language) => {
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
    <div ref={containerRef} className="w-full">
      {/* Screen reader announcement region */}
      <div id="language-announcement" className="sr-only" aria-live="polite" aria-atomic="true"></div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-label={`Select language. Currently selected: ${selectedLanguage.name}`}
            className="w-full justify-between touch-target px-4 micro-hover smooth-focus focus-enhanced group"
          >
            <div className="flex items-center space-x-3">
              <span 
                className="text-lg transition-transform duration-fast group-hover:scale-110"
                role="img"
                aria-label={`${selectedLanguage.name} flag`}
              >
                {getLanguageFlag(selectedLanguage)}
              </span>
              <div className="text-left">
                <div className="font-medium text-responsive">{selectedLanguage.name}</div>
                {selectedLanguage.nativeName !== selectedLanguage.name && (
                  <div className="text-xs text-semantic-neutral-500">{selectedLanguage.nativeName}</div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedLanguage.hasSTT && (
                <Badge 
                  variant="secondary" 
                  className="text-xs animate-fade-in-up"
                  aria-label="Speech to text available"
                >
                  STT
                </Badge>
              )}
              {selectedLanguage.hasTTS && (
                <Badge 
                  variant="secondary" 
                  className="text-xs animate-fade-in-up delay-50"
                  aria-label="Text to speech available"
                >
                  TTS
                </Badge>
              )}
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-fast ${open ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-96 p-0 animate-scale-in z-50" 
          align="start"
          role="listbox"
          aria-label="Language selection"
        >
          <div className="p-4 border-b">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-semantic-neutral-400" 
                aria-hidden="true"
              />
              <Input
                ref={searchInputRef}
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 smooth-focus focus-enhanced"
                aria-label="Search languages"
                role="searchbox"
              />
            </div>
            
            {/* Enhanced Region Filter with staggered animations */}
            <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Filter by region">
              <Button
                variant={selectedRegion === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedRegion('all')}
                className="text-xs interactive-scale touch-target"
                aria-pressed={selectedRegion === 'all'}
              >
                All Regions
              </Button>
              {languageRegions.map((region, index) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                  className={`text-xs interactive-scale touch-target animate-fade-in-up`}
                  style={{ animationDelay: `${(index + 1) * 30}ms` }}
                  aria-pressed={selectedRegion === region}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>
          
          <ScrollArea className="h-72 language-scroll">
            <div className="p-2 stagger-container" role="listbox">
              {filteredLanguages.map((language, index) => (
                <Button
                  key={language.code}
                  variant="ghost"
                  role="option"
                  aria-selected={language.code === selectedLanguage.code}
                  className={`w-full justify-start h-auto p-3 mb-1 btn-ghost animate-stagger-item touch-target gesture-spacing ${
                    isAnimating ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ 
                    '--stagger-delay': index,
                    animationDelay: isAnimating ? `${index * 50}ms` : '0ms'
                  } as React.CSSProperties}
                  onClick={() => handleLanguageSelect(language)}
                  onKeyDown={(e) => handleKeyDown(e, language)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <span 
                      className="text-lg transition-transform duration-micro hover:scale-110"
                      role="img"
                      aria-label={`${language.name} flag`}
                    >
                      {getLanguageFlag(language)}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-responsive">{language.name}</div>
                      {language.nativeName !== language.name && (
                        <div className="text-xs text-semantic-neutral-500">{language.nativeName}</div>
                      )}
                      <div className="text-xs text-semantic-neutral-400">{language.region}</div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {language.hasSTT && (
                        <Badge 
                          variant="outline" 
                          className="text-xs transition-colors duration-fast hover:bg-semantic-success-50"
                          aria-label="Speech to text available"
                        >
                          STT
                        </Badge>
                      )}
                      {language.hasTTS && (
                        <Badge 
                          variant="outline" 
                          className="text-xs transition-colors duration-fast hover:bg-semantic-trust-50"
                          aria-label="Text to speech available"
                        >
                          TTS
                        </Badge>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
              
              {filteredLanguages.length === 0 && (
                <div 
                  className="text-center py-6 text-semantic-neutral-500 animate-fade-in-up"
                  role="status"
                  aria-live="polite"
                >
                  No languages found matching your search.
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LanguageSelector;
