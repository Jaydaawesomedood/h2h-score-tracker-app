import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

interface ISelectH2HBodyProps {
  type: 'partner' | 'opponent',
  players: Player[][],
  setPartner: (partner: Player | undefined) => void,
  setOpponent: (opponent: Player[] | undefined) => void,
  onCloseModal: () => void,
}

export default function SelectH2HBody(props: ISelectH2HBodyProps) {
  const dividerColor = useThemeColor('border');

  const handleSelectItem = (players: Player[]) => {
    if (props.type === 'partner') {
      props.setPartner(players[0]);
      props.setOpponent(undefined);
    }
    else {
      props.setOpponent(players);
    }
    props.onCloseModal();
  }

  return (
    <FlatList
      data={props.players}
      renderItem={({ item, index }) => (
        <TouchableOpacity activeOpacity={0.6} onPress={() => { handleSelectItem(item); }}>
          <View style={[Styles.FLEX_COLUMN, { paddingVertical: 16 }]}>
            {
              item.map(player => (
                <View key={`h2h-selector-${props.type}-${index}-${player.id}`} style={[styles.playerContainer]}>
                  <PlayerIcon player={player} size={48} />
                  <ThemedText style={{ fontSize: 16 }}>{player.firstName} {player.lastName}</ThemedText>
                </View>
              ))
            }
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.map(p => p.id).join('-')}
      ItemSeparatorComponent={<View style={[styles.divider, { backgroundColor: dividerColor }]} />}
      contentContainerStyle={{ paddingHorizontal: 24 }}
    />
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    justifyContent: 'flex-start',
    columnGap: 8,
    paddingVertical: 8,
  },
  divider: {
    width: '100%',
    height: 2,
    opacity: 0.6,
  }
});