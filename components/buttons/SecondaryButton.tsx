import { FontAwesome } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { Text } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";

export type SecondaryButtonProps = {
  title: string;
  icon?: ComponentProps<typeof FontAwesome>["name"];
  iconPosition?: "left" | "right";
  onPress: () => void;
  customColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function SecondaryButton({ title, icon, iconPosition, onPress, customColor, style }: SecondaryButtonProps) {  
  // Styling
  const titleStyle = Text.secondaryBtnTitle;
  const color = customColor ?? useThemeColor("secondaryBtn");
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { flexDirection: iconPosition === "left" ? "row": "row-reverse" },
        style
      ]}
    >
      <FontAwesome name={icon} size={18} color={color} />
      <ThemedText style={[{ color }, titleStyle]}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "space-between",
  }
});