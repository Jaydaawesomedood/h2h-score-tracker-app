import { ThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";

/** @returns { theme, setTheme } */
export default function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}