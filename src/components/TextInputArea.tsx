
import React, { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Language } from '../types/language';

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  placeholder?: string;
  isListening?: boolean;
}

const TextInputArea: React.FC<TextInputAreaProps> = ({
  value,
  onChange,
  language,
  placeholder = "Enter text to translate...",
  isListening = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Set text direction based on language
  const textDirection = language.direction || 'ltr';
  const isRTL = textDirection === 'rtl';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.dir = textDirection;
    }
  }, [textDirection]);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 5000) {
      onChange(newValue);
    }
  };

  const getCharCountColor = () => {
    const percentage = (charCount / 5000) * 100;
    if (percentage >= 90) return 'text-semantic-error-600';
    if (percentage >= 75) return 'text-semantic-warning-600';
    return 'text-semantic-neutral-400';
  };

  const getCharCountMessage = () => {
    const percentage = (charCount / 5000) * 100;
    if (percentage >= 90) return 'Character limit almost reached';
    if (percentage >= 75) return 'Approaching character limit';
    return 'Character count';
  };

  return (
    <div className="relative group">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`min-h-[200px] text-base leading-relaxed resize-none transition-all duration-smooth focus-enhanced ${
          isRTL ? 'text-right' : 'text-left'
        } ${
          isListening 
            ? 'ring-2 ring-semantic-error-400 ring-opacity-50 animate-glow' 
            : isFocused 
              ? 'ring-2 ring-semantic-trust-400' 
              : 'hover:border-semantic-neutral-300'
        } ${
          isFocused ? 'shadow-lg shadow-primary/10' : 'group-hover:shadow-md shadow-primary/5'
        }`}
        dir={textDirection}
        lang={language.code === 'auto' ? undefined : language.code}
        maxLength={5000}
        aria-label={`Text input for ${language.name}`}
        aria-describedby="char-count-status listening-status"
        aria-live={isListening ? 'polite' : undefined}
      />
      
      {/* Enhanced Listening Indicator */}
      {isListening && (
        <div 
          className="absolute top-3 right-3 flex items-center space-x-2 animate-fade-in-down"
          id="listening-status"
          role="status"
          aria-live="polite"
        >
          <div className="flex space-x-1" aria-hidden="true">
            <div className="w-2 h-2 bg-semantic-error-500 rounded-full animate-bounce-subtle"></div>
            <div className="w-2 h-2 bg-semantic-error-500 rounded-full animate-bounce-subtle delay-100"></div>
            <div className="w-2 h-2 bg-semantic-error-500 rounded-full animate-bounce-subtle delay-200"></div>
          </div>
          <span className="text-xs text-semantic-error-600 font-medium animate-pulse">
            Listening...
          </span>
        </div>
      )}
      
      {/* Enhanced Character Count with color coding and accessibility */}
      <div 
        className={`absolute bottom-3 right-3 text-xs font-medium transition-colors duration-fast ${getCharCountColor()}`}
        id="char-count-status"
        role="status"
        aria-live="polite"
        aria-label={getCharCountMessage()}
      >
        <span className={charCount > 4500 ? 'animate-bounce-subtle' : ''}>{charCount}</span>
        <span className="text-semantic-neutral-300"> / 5000</span>
      </div>

      {/* Focus indicator line */}
      <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-semantic-trust-500 to-accent transition-all duration-smooth ${
        isFocused ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`} aria-hidden="true" />

      {/* Screen reader only status updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isListening && "Voice input is active, speak now"}
        {charCount > 4500 && `Warning: ${5000 - charCount} characters remaining`}
      </div>
    </div>
  );
};

export default TextInputArea;
