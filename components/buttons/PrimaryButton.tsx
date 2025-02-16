import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextStyles } from "@/constants/styles/Text";
import { FontAwesome5 } from "@expo/vector-icons";
import { useThemeStore } from "@/utils/context";

export type PrimaryButtonProps = {
  title: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({ title, icon, onPress, disabled, style }: PrimaryButtonProps) {
  // Styling
  const { isLightMode } = useThemeStore();
  const backgroundColor = useThemeColor(disabled ? 'primaryDisabled' : 'primary');
  const textColor = useThemeColor(isLightMode ? "textFlipped" : "text");

  // Title-related
  const titleStyle = TextStyles.controls.buttons.primary;
  
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor }, icon && { flexDirection: "row", alignItems: "center", justifyContent: "center" }, style]} disabled={disabled}>
      { icon && <FontAwesome5 name={icon} size={18} color="white" /> }
      { title !== "" && <ThemedText style={[titleStyle, { color: textColor }]}>{title}</ThemedText> }
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