import useThemeColor from "@/hooks/v2/useThemeColor";
import { Fragment } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import ThemedText from "../ThemedText";
import { Styles } from "@/constants/v2/Styles";

type Props = ViewProps & {
  text?: string;
};

export default function Divider({ text, style }: Props) {
  const dividerColor = useThemeColor('muted');
  
  return (
    <View style={[Styles.FLEX_HORIZONTAL_CENTER, style]}>
      <View style={[styles.versusDivider, { backgroundColor: dividerColor, opacity: 0.3 }]}></View>
      {
        text &&
        <Fragment>
          <ThemedText weight="light" style={[styles.versusText]}>{text}</ThemedText>
          <View style={[styles.versusDivider, { backgroundColor: dividerColor, opacity: 0.3 }]}></View>
        </Fragment>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  versusDivider: {
    minHeight: 1.5,
    flexGrow: 1 
  },
  versusText: {
    paddingHorizontal: 8,
  },
});