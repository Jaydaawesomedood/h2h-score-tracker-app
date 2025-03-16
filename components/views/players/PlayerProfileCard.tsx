import { Image, StyleSheet, View, ViewProps } from "react-native";
import PlayerName from "@/components/text/PlayerName";
import { medium } from "@/constants/styles/Text";
import { Player } from "@/models/Player";

type Props = ViewProps & {
  player: Player;
  imageSize?: number;
  isVertical?: boolean;
};

// The horizontal options displayed in the select player list
export default function PlayerProfileCard({ imageSize, player, isVertical = false, style }: Props) {
  const size = imageSize ?? 40;

  return (
    <View style={[styles.container, style, !isVertical ? { flexDirection: "row" } : styles.containerVertical]}>
      <Image
        source={require('../../../assets/images/default-avatar.png')}
        style={{ borderRadius: size, height: size, width: size }}
      />
      <PlayerName player={player} isVertical={isVertical} textStyle={{ paddingVertical: isVertical ? 1 : 0, fontSize: medium }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    columnGap: 20,
  },
  containerVertical: {
    rowGap: 8,
  },
});