import { Styles } from "@/constants/v2/Styles";
import { StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import { Player } from "@/models/v2/data/Player";

interface IPlayerIconProps {
  player: Player,
  size?: number,
}

export default function PlayerIcon(props: IPlayerIconProps) {
  return (
    <View
      style={[
        Styles.FLEX_HORIZONTAL_CENTER,
        styles.userImageContainer,
        {
          backgroundColor: props.player.color,
          width: props.size ?? 24,
        }
      ]}
    >
      <ThemedText
        weight="bold"
        style={{ fontSize: props.size ? props.size / 3 : 24, margin: 0 }}
      >
        {props.player.firstName.charAt(0).concat(props.player.lastName.charAt(0))}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  userImageContainer: {
    borderRadius: '100%',
    aspectRatio: 1 / 1,
    padding: 8,
    margin: 0,
  }
});