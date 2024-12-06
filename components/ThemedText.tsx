import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { forwardRef, MutableRefObject, Ref } from 'react';
import { regular } from '@/constants/styles/Text';

type ThemedTextProps = TextProps & {};

export const ThemedText = ({ style, ...rest }: ThemedTextProps) => {
  const color = useThemeColor('text');

  return (
    <Text
      style={[{ color, fontFamily: regular }, style, ]}
      {...rest}
    />
  );
};
