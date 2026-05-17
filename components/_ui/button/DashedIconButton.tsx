import { FontAwesome6 } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";

interface IDashedIconButtonProps {
  text: string,
  onPress: () => void,
  icon?: ComponentProps<typeof FontAwesome6>["name"],
  iconSize?: number,
  activeOpacity?: number,
  containerStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
}

export default function DashedIconButton(props: IDashedIconButtonProps) {
  const muted = useThemeColor("muted");
  const border = useThemeColor("border");

  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity ?? 0.6}
      style={[styles.container, { borderColor: border }, props.containerStyle]}
      onPress={props.onPress}
    >
      <FontAwesome6
        name={props.icon ?? "circle-plus"}
        size={props.iconSize ?? 28}
        color={border}
      />
      <ThemedText style={[styles.text, { color: muted }, props.textStyle]}>
        {props.text}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    justifyContent: "flex-start",
    columnGap: 16,
    borderStyle: "dotted",
    borderWidth: 4,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
  },
});
