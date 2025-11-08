import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'ocean' | 'sunset';

interface ThemeStore {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'dark',
  setTheme: (mode) => set({ mode }),
}));
