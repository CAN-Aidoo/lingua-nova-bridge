
-- Create translations table to store translation history
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create language_usage table to track popular language pairs
CREATE TABLE public.language_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  usage_count INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source_language, target_language)
);

-- Create user_preferences table for storing user settings
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  preferred_source_language VARCHAR(10) DEFAULT 'auto',
  preferred_target_language VARCHAR(10) DEFAULT 'en',
  enable_auto_translate BOOLEAN DEFAULT true,
  enable_speech_input BOOLEAN DEFAULT true,
  enable_speech_output BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for translations
CREATE POLICY "Users can view their own translations" 
  ON public.translations 
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);
`
CREATE POLICY "Users can create translations" 
  ON public.translations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for language_usage (public read, authenticated write)
CREATE POLICY "Anyone can view language usage" 
  ON public.language_usage 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can update language usage" 
  ON public.language_usage 
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage their own preferences" 
  ON public.user_preferences 
  FOR ALL
  USING (auth.uid() = user_id);

-- Function to increment language usage
CREATE OR REPLACE FUNCTION increment_language_usage(
  src_lang VARCHAR(10),
  tgt_lang VARCHAR(10)
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.language_usage (source_language, target_language, usage_count)
  VALUES (src_lang, tgt_lang, 1)
  ON CONFLICT (source_language, target_language)
  DO UPDATE SET 
    usage_count = language_usage.usage_count + 1,
    updated_at = now();
END;
$$;
