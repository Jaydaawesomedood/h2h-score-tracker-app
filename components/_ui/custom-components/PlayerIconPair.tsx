import { StyleSheet, View } from "react-native";
import PlayerIcon from "./PlayerIcon";
import { Styles } from "@/constants/v2/Styles";
import { Player } from "@/models/v2/data/Player";

interface IPlayerIconPairProps {
  player1: Player,
  player2: Player,
  size?: number,
}

export default function PlayerIconPair(props: IPlayerIconPairProps) {
  return (
    <View style={[styles.container]}>
      <View>
        <PlayerIcon player={props.player1} size={props.size} />
      </View>
      <View style={[{ marginLeft: -12 }]}>
        <PlayerIcon player={props.player2} size={props.size} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    justifyContent: 'flex-start',
  },
});