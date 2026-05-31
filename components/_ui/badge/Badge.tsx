import { StyleSheet, View, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import useThemeColor from "@/hooks/v2/useThemeColor";

interface IBadgeProps {
  text: string,
  color?: ViewStyle['backgroundColor']
}

export default function Badge(props: IBadgeProps) {
  const primary = useThemeColor('primary');

  return (
    <View style={[styles.badge, { backgroundColor: props.color ?? primary }]}>
      <ThemedText weight="bold" style={{ fontSize: 12 }}>{props.text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start'
  }
});