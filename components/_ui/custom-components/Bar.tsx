import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import useThemeColor from "@/hooks/v2/useThemeColor";
import ThemedText from "../ThemedText";

type Props = {
  values: number[],
  subtitle?: string[],
  labelStyle?: StyleProp<TextStyle>,
  subtitleStyle?: StyleProp<TextStyle>,
  barStyle?: StyleProp<ViewStyle>,
  customBarColor?: string,
  customBackgroundColor?: string,
};

export function Bar({ values, subtitle, customBackgroundColor, labelStyle, subtitleStyle, customBarColor, barStyle }: Props) {
  const backgroundColor = customBackgroundColor ?? useThemeColor("background");
  const barColor = customBarColor ?? useThemeColor("primary");

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText weight="bold" style={[{ fontSize: 24 }, labelStyle]}>
          {values[0]}
        </ThemedText>
        {subtitle && (
          <ThemedText weight="light" style={[{ fontSize: 12 }, subtitleStyle]}>
            {subtitle[0]}
          </ThemedText>
        )}
      </View>
      <View style={[styles.barContainer, barStyle]}>
        <View style={[styles.bar, { backgroundColor }]}>
          <View
            style={[
              styles.barContent,
              {
                backgroundColor: barColor,
                width: `${((values[0] + values[1]) > 0 ? (values[0]/(values[0] + values[1])) : 0) * 100}%`
              }
            ]}
          />
        </View>
      </View>
      <View style={styles.titleContainer}>
        <ThemedText weight="bold" style={[{ fontSize: 24 }, labelStyle]}>
          {values[1]}
        </ThemedText>
        {subtitle && (
          <ThemedText weight="light" style={[{ fontSize: 12 }, subtitleStyle]}>
            {subtitle[1]}
          </ThemedText>
        )}
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
  },
});