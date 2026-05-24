import ThemedText from "@/components/_ui/ThemedText";
import { LayoutChangeEvent, View } from "react-native";

interface IPlayerH2HTab {
  onLayout: (event: LayoutChangeEvent) => void,
}

export default function PlayerH2HTab(props: IPlayerH2HTab) {
  return (
    <View onLayout={props.onLayout} style={{ padding: 24 }}>
      <ThemedText>H2H Content</ThemedText>
    </View>
  );
}