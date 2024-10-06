import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor('text');

  return (
    <Text
      style={[
        { color, fontFamily: "LeagueSpartanRegular" },
        style,
      ]}
      {...rest}
    />
  );
}
