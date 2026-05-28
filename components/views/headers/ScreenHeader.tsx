import Button from "@/components/_ui/button/Button";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { router } from "expo-router";
import { StyleProp, View, ViewStyle } from "react-native";

interface ScreenHeaderProps {
  renderActionButton?: () => React.JSX.Element,
  style?: StyleProp<ViewStyle>,
}

export default function ScreenHeader(props: ScreenHeaderProps) {
  const primary = useThemeColor('primary');

  return (
    <View style={[Styles.FLEX_HORIZONTAL_SIDE, props.style]}>
      <Button
        type="secondary"
        text="Back"
        onPress={() => router.back()}
        icon="chevron-left"
        iconPlacement="left"
        buttonStyle={{ columnGap: 6 }}
        textStyle={{ color: primary, fontSize: 18 }}
      />
      {
        props.renderActionButton && props.renderActionButton()
      }
    </View>
  );
}