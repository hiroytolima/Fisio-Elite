import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light' | 'high-contrast';

interface ThemeState {
  theme: ThemeMode;
  fontSizeScale: number; // 1 = 100%, 1.25 = 125%, 1.5 = 150%
  reducedMotion: boolean;
  setTheme: (theme: ThemeMode) => void;
  setFontSizeScale: (scale: number) => void;
  toggleReducedMotion: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('fisio_theme') as ThemeMode) || 'dark',
  fontSizeScale: 1,
  reducedMotion: typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('fisio_theme', theme);
    document.documentElement.classList.remove('dark', 'light', 'high-contrast');
    document.documentElement.classList.add(theme);
    set({ theme });
  },
  setFontSizeScale: (fontSizeScale: number) => {
    document.documentElement.style.fontSize = `${fontSizeScale * 100}%`;
    set({ fontSizeScale });
  },
  toggleReducedMotion: () =>
    set((state) => ({ reducedMotion: !state.reducedMotion })),
}));
