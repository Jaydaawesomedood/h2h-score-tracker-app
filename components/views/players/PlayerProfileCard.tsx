import PlayerName from "@/components/text/PlayerName";
import { Player } from "@/models/Player";
import { Image, StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps & {
  player: Player;
  imageSize?: number;
};

// The horizontal options displayed in the select player list
export default function PlayerProfileCard({ imageSize, player, style }: Props) {
  const size = imageSize ?? 40;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../../assets/images/placeholder-avatar.png')}
        style={{ borderRadius: size, height: size, width: size }}
      />
      <PlayerName player={player} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    columnGap: 20,
    flexDirection: "row",
  }
});