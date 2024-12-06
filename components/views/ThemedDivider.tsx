import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = ViewProps & {
  text: string;
};

export default function ThemedDivider({ text, style }: Props) {
  const dividerColor = useThemeColor("itemSeparator");
  
  return (
    <View style={[styles.versusContainer, style]}>
      <View style={[styles.versusDivider, { backgroundColor: dividerColor }]}></View>
      <ThemedText style={[styles.versusText]}>{text}</ThemedText>
      <View style={[styles.versusDivider, { backgroundColor: dividerColor }]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  versusContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  versusDivider: {
    minHeight: 2,
    flexGrow: 1 
  },
  versusText: {
    paddingHorizontal: 8,
  },
});