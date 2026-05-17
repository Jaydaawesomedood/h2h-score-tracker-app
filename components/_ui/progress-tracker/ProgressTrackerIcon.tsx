import { StyleSheet, View } from "react-native";
import ThemedText from "../ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";

interface IProgressTrackerIcon {
  index: number,
  state: 'active' | 'completed' | 'incomplete'
}

export default function ProgressTrackerIcon(props: IProgressTrackerIcon) {
  const incompleteBgColor = useThemeColor('shade');
  const primaryBgColor = useThemeColor('primary');

  const getBackgroundColor = () => {
    switch (props.state) {
      case 'active':
      case 'completed':
        return primaryBgColor;
      default:
        return incompleteBgColor;
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <ThemedText weight="bold">{props.index}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: '100%',
    width: '10%',
    aspectRatio: 1 / 1,
    ...Styles.FLEX_HORIZONTAL_CENTER,
  }
});