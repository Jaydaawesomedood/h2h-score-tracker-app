import { useThemeColor } from "@/hooks/useThemeColor";
import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View } from "react-native";
import SecondaryButton from "../buttons/SecondaryButton";

type DurationTabProps = {
  duration: string;
  setDuration: Dispatch<SetStateAction<string>>;
  values?: { label: string, value: string }[];
};

export function DurationTab({
  duration,
  setDuration,
  values = [{ label: "This Year", value: "this year" }, { label: "All-Time", value: "all time" }]
}: DurationTabProps) {
  const durationTabTextColor = useThemeColor("text");
  const durationTabTextDisabledColor = useThemeColor("textDisabled");

  return (
    <View style={[styles.durationTabsContainer]}>
      {
        values.map((value, index) => (
          <SecondaryButton
            key={`duration-tab-picker-value-${index}`}
            title={value.label}
            onPress={() => setDuration(value.value)}
            customColor={duration === value.value ? durationTabTextColor : durationTabTextDisabledColor}
            disabled={duration === value.value}
          />
        ))
      }
    </View>
  );
};

const styles = StyleSheet.create({
  durationTabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 16,
  },
});