import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";

type CardProps = ViewProps & PropsWithChildren & {
  style?: StyleProp<ViewStyle>,
}

export default function Card(props: CardProps) {
  const background = useThemeColor('card');
  const border = useThemeColor('border');

  return (
    <View style={[styles.card, { backgroundColor: background, borderColor: border }, props.style]}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 2,
    ...Styles.FLEX_HORIZONTAL_CENTER,
    padding: 16,
  }
});