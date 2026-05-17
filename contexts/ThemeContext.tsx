import { createContext } from "react";

type Theme = {
  theme: 'light' | 'dark',
  setTheme: (value: 'light' | 'dark') => void,
}

export const ThemeContext = createContext<Theme | null>(null);