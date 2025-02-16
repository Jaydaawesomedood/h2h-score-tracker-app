import { FontAwesome } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { TouchableOpacity, StyleProp, StyleSheet, ViewStyle, TextStyle } from "react-native";
import ThemedText from "../ThemedText";
import { medium, regular, Text } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";

export type SecondaryButtonProps = {
  title: string;
  icon?: ComponentProps<typeof FontAwesome>["name"];
  iconPosition?: "left" | "right";
  onPress: () => void;
  disabled?: boolean;
  customColor?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export default function SecondaryButton({ title, icon, iconPosition, onPress, customColor, disabled = false, style, labelStyle }: SecondaryButtonProps) {  
  // Styling
  const color = customColor ?? useThemeColor(disabled ? "primaryDisabled" : "secondaryBtn");
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { flexDirection: iconPosition === "left" ? "row": "row-reverse", columnGap: 8 },
        style,
      ]}
      disabled={disabled}
    >
      { icon && <FontAwesome name={icon} size={18} color={color} /> }
      { title !== "" && <ThemedText style={[{ color }, styles.text, labelStyle]}>{title}</ThemedText> }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: regular,
    fontSize: medium,
    lineHeight: medium,
  },
});