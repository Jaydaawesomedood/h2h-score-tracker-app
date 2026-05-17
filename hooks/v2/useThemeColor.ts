import { THEMES } from "@/constants/v2/Themes";
import { Theme } from "@/models/v2/Theme";
import useTheme from "./useTheme";

export default function useThemeColor(element: keyof Theme) {
  const context = useTheme();
  return THEMES[context ? context.theme : 'dark'][element];
}