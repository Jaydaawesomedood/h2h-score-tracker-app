import { Containers } from "@/constants/styles/Containers";
import { Text } from "@/constants/styles/Text";
import { router } from "expo-router";
import { View, StyleSheet, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import SecondaryButton, { SecondaryButtonProps } from "../buttons/SecondaryButton";
import ThemedView from "../ThemedView";

export type ScreenTitleWithBackProps = {
  title: string;
  actionBtn?: SecondaryButtonProps
  style? : ViewStyle;
};

export default function ScreenTitleWithBack({ title, actionBtn, style }: ScreenTitleWithBackProps) {
  // Container-related
  const containerStyle = Containers.title;

  // Title-related
  const titleStyle = Text.screenTitle;

  const onBack = () => { router.back(); };

  return (
    <ThemedView style={[containerStyle, { justifyContent: "center" }, style]}>
      <View style={{ flex: 1 }}>
        <SecondaryButton
          title="Back"
          icon="chevron-left"
          iconPosition="left"
          onPress={onBack}
          style={styles.backBtn}
        />
      </View>
      <ThemedText style={[titleStyle, styles.title]}>{title}</ThemedText>
      <View style={{ flex: 1 }}>
        {
          actionBtn ?
          <SecondaryButton
            {...actionBtn}
            style={styles.actionBtn}
          />
          : null
        }
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    // flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    flex: 2,
    textAlign: "center",
  },
  actionBtn: {
    alignSelf: "flex-end",
  },
});