import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { regular } from '@/constants/styles/Text';

type ThemedTextProps = TextProps & {};

export default function ThemedText({ style, ...rest }: ThemedTextProps) {
  const color = useThemeColor('text');

  return (
    <Text
      style={[{ color, fontFamily: regular }, style, ]}
      {...rest}
    />
  );
};
