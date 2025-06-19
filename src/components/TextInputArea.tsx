
import React, { useEffect, useRef } from 'react';
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

  // Set text direction based on language
  const textDirection = language.direction || 'ltr';
  const isRTL = textDirection === 'rtl';

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.dir = textDirection;
    }
  }, [textDirection]);

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`min-h-[200px] text-base leading-relaxed resize-none transition-all duration-200 ${
          isRTL ? 'text-right' : 'text-left'
        } ${isListening ? 'ring-2 ring-red-400 ring-opacity-50' : ''}`}
        dir={textDirection}
        lang={language.code === 'auto' ? undefined : language.code}
      />
      
      {/* Listening Indicator */}
      {isListening && (
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-xs text-red-600 font-medium">Listening...</span>
        </div>
      )}
      
      {/* Character Count */}
      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
        {value.length} / 5000
      </div>
    </div>
  );
};

export default TextInputArea;
