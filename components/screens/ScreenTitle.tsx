import { FontAwesome } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { View, ViewProps, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import SecondaryButton from "../buttons/SecondaryButton";
import { Containers } from "@/constants/styles/Containers";
import { TextStyles } from "@/constants/styles/Text";

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
  const containerStyle = Containers.title as ViewStyle;

  // Title-related
  const titleStyle = TextStyles.titles.screen;

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