
import React, { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Language } from '../types/language';

interface TextOutputAreaProps {
  value: string;
  language: Language;
  isTranslating?: boolean;
}

const TextOutputArea: React.FC<TextOutputAreaProps> = ({
  value,
  language,
  isTranslating = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
        value={isTranslating ? '' : value}
        readOnly
        className={`min-h-[200px] text-base leading-relaxed resize-none bg-gray-50 cursor-default ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        dir={textDirection}
        lang={language.code}
        placeholder={isTranslating ? '' : `Translation will appear in ${language.name}...`}
      />
      
      {/* Translation Loading Indicator */}
      {isTranslating && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-ocean-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-ocean-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-ocean-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">Translating...</span>
          </div>
        </div>
      )}
      
      {/* Copy to Clipboard Button */}
      {value && !isTranslating && (
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="absolute bottom-3 right-3 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Copy
        </button>
      )}
    </div>
  );
};

export default TextOutputArea;
