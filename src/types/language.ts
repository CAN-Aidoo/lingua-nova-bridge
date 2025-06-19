
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  direction?: 'ltr' | 'rtl';
  hasSTT: boolean;
  hasTTS: boolean;
  quality: number; // 1-5 scale
  popularity: number; // usage rank
}
