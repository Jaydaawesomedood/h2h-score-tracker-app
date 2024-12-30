import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text } from "@/constants/styles/Text";

export type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({ title, onPress, disabled, style }: PrimaryButtonProps) {
  // Styling
  const backgroundColor = useThemeColor(disabled ? 'primaryDisabled' : 'primary');

  // Title-related
  const titleStyle = Text.primaryBtnTitle;
  
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor }, style]} disabled={disabled}>
      <ThemedText style={titleStyle}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "space-between",
    paddingVertical: 8,
  }
});