import useThemeColor from "@/hooks/v2/useThemeColor";
import { View, ViewProps } from "react-native";

export default function ThemedView({ style, children, ...props }: ViewProps) {
  const backgroundColor = useThemeColor('background');

  return (
    <View
      style={[style, { backgroundColor }]}
      {...props}
    >
      {children}
    </View>
  );
}