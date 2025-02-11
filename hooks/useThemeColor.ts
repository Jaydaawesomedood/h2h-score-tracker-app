/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useThemeStore } from '@/utils/context';

export function useThemeColor(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { isLightMode } = useThemeStore();

  const theme = isLightMode ? "light" : "dark";
  return Colors[theme][colorName];
}
