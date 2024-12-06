import { StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  currentStep: number;
  stepIndex: number;
  label?: string;
  style?: ViewStyle
};

export default function ProgressStepIcon({ currentStep, stepIndex, label, style }: Props) {
  const backgroundColor = useThemeColor(stepIndex <= currentStep ? "primary" : "primaryDisabled");
  const opacity = 1; // stepIndex <= currentStep ? 1 : 0.7;

  return (
    <View style={[styles.stepBarContainer, style]}>
      <View style={[styles.stepContainer]}>
        <View style={[styles.iconContainer, { backgroundColor, opacity }]}>
          <ThemedText>{stepIndex + 1}</ThemedText>
        </View>
        { label ? <ThemedText style={{ opacity }}>{label}</ThemedText> : null}
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  stepBarContainer: {
    flexDirection: "row",
    position: "relative",
  },
  stepContainer: {
    alignItems: "center",
    zIndex: 5,
  },
  iconContainer: {
    alignItems: "center",
    borderRadius: 40/2,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
});