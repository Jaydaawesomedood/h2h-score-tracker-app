import { ThemeContext } from "@/contexts/ThemeContext";
import { ReactNode, useState } from "react";

export default function ThemeProvider({ children }: { children: ReactNode | undefined }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggleTheme = (theme: 'light' | 'dark') => setTheme(theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}