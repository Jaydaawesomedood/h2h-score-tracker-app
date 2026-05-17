import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

// TODO - Delete this file
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // const backgroundColor = useThemeColor('background');

  // return <View style={[{ backgroundColor }, style]} {...otherProps} />;
  return <View {...otherProps}></View>
}
