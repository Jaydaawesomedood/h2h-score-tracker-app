import PlayerIcon from "@/components/_ui/PlayerIcon";
import SelectableOption from "@/components/_ui/select/SelectableOption";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { usePlayersStore } from "@/store/usePlayersStore";
import { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Button from "@/components/_ui/button/Button";
import DashedIconButton from "@/components/_ui/button/DashedIconButton";
import AddPlayerForm from "../forms/AddPlayerForm";
import * as Crypto from "expo-crypto";

interface IPlayerSelectorProps {
  player: Player,
  selected: boolean,
  onPress: () => void,
  isNewPlayer?: boolean,
}

interface IQuickAddSectionProps {
  onClose: () => void,
  addPlayer: (player: Player) => void,
}

export default function MatchPlayersStep() {
  const players = usePlayersStore((state) => state.players);
  const addPlayer = usePlayersStore((state) => state.addPlayer);

  const muted = useThemeColor('muted');

  const [selectedPlayer, setSelectedPlayer] = useState<Player | undefined>(undefined);
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState<boolean>(false);

  const [newPlayerIds, setNewPlayerIds] = useState<string[]>([]);

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
  }

  const handleExpandQuickAdd = () => setIsQuickAddExpanded(true);

  const handleQuickAddPlayer = (player: Player) => {
    addPlayer(player);
    setNewPlayerIds((prev) => [player.id, ...prev]);
    setSelectedPlayer(player);
  }

  const orderedPlayers = useMemo(() => {
    return [
      ...newPlayerIds.map((id) => players.find((p) => p.id === id)).filter((p): p is Player => Boolean(p)),
      ...players.filter((p) => !newPlayerIds.includes(p.id)),
    ];
  }, [players, newPlayerIds]);

  return (
    <View style={[Styles.FLEX_COLUMN, { rowGap: 16, height: '100%' }]}>
      <ThemedText style={{ color: muted }}>
        Who played?
      </ThemedText>
      <ScrollView contentContainerStyle={{ rowGap: 16 }}>
        <View style={{ rowGap: 8 }}>
          <ThemedText weight="bold">Recent Matchups</ThemedText>
          <RecentMatchCard />
          <RecentMatchCard />
        </View>
        <ThemedText weight="bold">Or Pick Manually</ThemedText>
        {
          isQuickAddExpanded
          ? (
            <QuickAddPlayerSection
              onClose={() => setIsQuickAddExpanded(false)}
              addPlayer={handleQuickAddPlayer}
            />
          )
          : (
            <DashedIconButton
              text="Add player"
              onPress={handleExpandQuickAdd}
            />
          )
        }
        <View style={[Styles.FLEX_COLUMN, { flexDirection: 'row', gap: 16, flexWrap: 'wrap' }]}>
          {
            orderedPlayers.map((p: Player) => (
              <PlayerSelector
                key={p.id}
                player={p}
                selected={p.id === selectedPlayer?.id}
                onPress={() => handleSelectPlayer(p)}
                isNewPlayer={newPlayerIds.includes(p.id)}
              />
            ))
          }
        </View>
      </ScrollView>
    </View>
  );
}

function PlayerSelector(props: IPlayerSelectorProps) {
  return (
    <SelectableOption
      selected={props.selected}
      onPress={props.onPress}
      renderLeftSegment={() => (<PlayerIcon player={props.player} size={32} />)}
      renderContent={() => (
        <View>
          <ThemedText weight="bold">{props.player.firstName}</ThemedText>
          {
            props.isNewPlayer &&
            <ThemedText style={{ color: 'green', fontSize: 12 }}>(New)</ThemedText>
          }
        </View>
      )}
      containerStyle={{ ...styles.playerCard }}
    />
  );
}

function QuickAddPlayerSection(props: IQuickAddSectionProps) {
  const formRef = useRef(null);
  const primary = useThemeColor('primary');

  const handleAddPlayer = () => {
    props.addPlayer({ ...(formRef.current as any)?.getFormData(), id: Crypto.randomUUID() });
    (formRef.current as any)?.resetForm();
  }

  return (
    <View style={{ rowGap: 16, padding: 16, borderWidth: 4, borderColor: primary, borderRadius: 16 }}>
      <ThemedText style={{ color: primary, fontSize: 16 }} weight="bold">New Player</ThemedText>
      <AddPlayerForm ref={formRef} />
      <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
        <Button
          type="secondary"
          text="Cancel"
          onPress={props.onClose}
          buttonStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          weight="bold"
        />
        <Button
          type="primary"
          text="Add"
          onPress={handleAddPlayer}
          buttonStyle={{ flex: 1 }}
          weight="bold"
        />
      </View>
    </View>
  );
}

function RecentMatchCard() {
  const muted = useThemeColor('muted');

  return (
    <SelectableOption
      selected={false}
      onPress={() => {}}
      renderLeftSegment={() => (
        <View style={[Styles.FLEX_HORIZONTAL_CENTER, { justifyContent: 'flex-start', position: 'relative' }]}>
          <PlayerIcon player={{ id: '1', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' }} size={32} />
          <View style={{ position: 'absolute', left: '40%' }}>
            <PlayerIcon player={{ id: '2', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' }} size={32} />
          </View>
        </View>
      )}
      renderContent={() => (
        <View>
          <ThemedText weight="bold">Jason vs Bryan</ThemedText>
          <ThemedText weight="light" style={{ color: muted, fontSize: 12 }}>2 days ago</ThemedText>
        </View>
      )}
      containerStyle={{ ...styles.playerCard, width: '100%' }}
    />
  );
}

const styles = StyleSheet.create({
  playerCard: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    columnGap: 16,
    width: '45%',
    paddingHorizontal: 16,
  },
});
