import { FontAwesome } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import useThemeColor from "@/hooks/v2/useThemeColor";
import Button from "@/components/_ui/button/Button";
import { Styles } from "@/constants/v2/Styles";
import { usePlayersStore } from "@/store/usePlayersStore";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import AddPlayerModal from "@/components/v2/modals/AddPlayerModal";
import { Player } from "@/models/v2/data/Player";

interface IPlayerCardProps {
  player: Player
}

export default function Players() {
  const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState<boolean>(false);
  const players = usePlayersStore((state) => state.players);

  const primary = useThemeColor('primary');

  return (
    <ThemedView style={[Styles.SCREEN_BODY]}>
      <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
        <ThemedText weight="bold" style={{ fontSize: 36, lineHeight: 48 }}>Players</ThemedText>
        <Button
          type="secondary"
          text="Add"
          onPress={() => setIsAddPlayerModalVisible(true)}
          icon="plus"
          iconPlacement="left"
          textStyle={{ color: primary, fontSize: 18 }}
          buttonStyle={{ columnGap: 8 }}
          weight="bold"
        />
      </View>
      <View style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <FlatList
          data={players}
          renderItem={({ item }) => (<PlayerCard player={item} />)}
          keyExtractor={item => item.id}
          contentContainerStyle={{ rowGap: 8 }}
        />
      </View>
      
      {/* Add Player Modal */}
      <AddPlayerModal
        isVisible={isAddPlayerModalVisible}
        onCloseModal={() => setIsAddPlayerModalVisible(false)}
      />
    </ThemedView>
  );
}

function PlayerCard(props: IPlayerCardProps) {
  const backgroundColor = useThemeColor('card');
  const borderColor = useThemeColor('border');
  const muted = useThemeColor('muted');

  return (
    <TouchableOpacity
      onPress={() => router.push(`player/${props.player.id}` as Href)}
      activeOpacity={0.6}
      style={[
        { backgroundColor, borderColor },
        Styles.FLEX_HORIZONTAL_CENTER,
        styles.playerCard,
        { justifyContent: 'flex-start' }
      ]}
    >
      <PlayerIcon player={props.player} size={48} />
      <View style={[Styles.FLEX_COLUMN, { flexGrow: 1, flexShrink: 1, minWidth: 0, paddingHorizontal: 16 }]}>
        <ThemedText weight="bold" style={{ fontSize: 24 }}>
          { props.player.firstName.concat(' ', props.player.lastName) }
        </ThemedText>
        <ThemedText weight="light">42 matches</ThemedText>
      </View>
      <View style={{ flexShrink: 1 }}>
        <FontAwesome name="chevron-right" size={14} color={muted} style={{ opacity: 0.4 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});