import useThemeColor from '@/hooks/v2/useThemeColor';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, TextProps } from 'react-native';

type IThemedTextProps = TextProps & {
  weight?: 'light' | 'regular' | 'bold',
}

export default function ThemedText({ style, ...props}: IThemedTextProps) {
  const color = useThemeColor('text');

  return (
    <Text
      style={[
        { color },
        style,
        styles[props.weight ?? 'regular'], 
      ]}
    >
      { props.children }
    </Text>
  );
}

const styles = StyleSheet.create({
  light: {
    fontFamily: 'LeagueSpartanLight',
  },
  regular: {
    fontFamily: 'LeagueSpartanRegular',
  },
  bold: {
    fontFamily: 'LeagueSpartanBold',
  }
});