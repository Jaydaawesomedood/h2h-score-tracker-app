import { StyleSheet, View } from "react-native";
import ThemedText from "../ThemedText";
import { light, bold, mainContent, extraSmall } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  values: number[];
  subtitle?: string[];
  customBackgroundColor?: string;
};

export function ThemedBarPercentageView({ values, subtitle, customBackgroundColor }: Props) {
  const backgroundColor = customBackgroundColor ?? useThemeColor("grey");
  const primaryColor = useThemeColor("primary");

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={text.title}>{values[0]}</ThemedText>
        {subtitle && <ThemedText style={text.subtitle}>{subtitle[0]}</ThemedText>}
      </View>
      <View style={[styles.barContainer]}>
        <View style={[styles.bar, { backgroundColor }]}>
          <View
            style={[
              styles.barContent,
              {
                backgroundColor: primaryColor,
                width: `${((values[0] + values[1]) > 0 ? (values[0]/(values[0] + values[1])) : 0) * 100}%`
              }
            ]}
          />
        </View>
      </View>
      <View style={styles.titleContainer}>
        <ThemedText style={text.title}>{values[1]}</ThemedText>
        {subtitle && <ThemedText style={text.subtitle}>{subtitle[1]}</ThemedText>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  barContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    flexBasis: "74%",
  },
  bar: {
    borderRadius: 8,
    width: "100%",
    height: 10,
    overflow: "hidden",
  },
  barContent: {
    height: "100%",
    borderRadius: 8,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 4,
    flexBasis: "13%",
  },
});

const text = StyleSheet.create({
  title: {
    fontFamily: bold,
    fontSize: mainContent,
    lineHeight: mainContent,
  },
  subtitle: {
    fontFamily: light,
    fontSize: extraSmall,
    lineHeight: extraSmall,
  },
});