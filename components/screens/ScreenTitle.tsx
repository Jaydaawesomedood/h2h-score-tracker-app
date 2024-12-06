import { Text } from "@/constants/styles/Text";
import { ThemedText } from "../ThemedText";
import { View, ViewProps } from "react-native";
import { Containers } from "@/constants/styles/Containers";
import SecondaryButton from "../buttons/SecondaryButton";
import { ComponentProps } from "react";
import { FontAwesome } from "@expo/vector-icons";

export type ScreenTitleProps = ViewProps & {
  title: string;
  actionBtn?: {
    title: string;
    icon?: ComponentProps<typeof FontAwesome>["name"];
    iconPosition?: "left" | "right";
    onActionBtn: () => void;
  } | undefined;
};

export default function ScreenTitle({ title, actionBtn, style }: ScreenTitleProps) {
  // Container-related
  const containerStyle = Containers.title;

  // Title-related
  const titleStyle = Text.screenTitle;

  return (
    <View style={[containerStyle, style]}>
      <ThemedText style={titleStyle}>{title}</ThemedText>
      {
        actionBtn ?
        <SecondaryButton
          title={actionBtn.title}
          icon={actionBtn.icon}
          iconPosition={actionBtn.iconPosition}
          onPress={actionBtn.onActionBtn}
        />
        : null
      }
    </View>
  );
}