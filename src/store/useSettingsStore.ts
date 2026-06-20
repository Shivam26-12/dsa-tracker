import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  theme: 'dark' | 'light';
  accentColor: string; // Tailwind color name like 'indigo', 'rose', 'emerald'
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setAccentColor: (color: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark', // User loves dark theme
      accentColor: 'indigo',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
    }),
    {
      name: 'dsa-tracker-settings',
    }
  )
);
