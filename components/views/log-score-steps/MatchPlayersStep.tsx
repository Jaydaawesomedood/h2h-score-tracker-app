import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import SelectableOption from "@/components/_ui/select/SelectableOption";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { usePlayersStore } from "@/store/usePlayersStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Button from "@/components/_ui/button/Button";
import DashedIconButton from "@/components/_ui/button/DashedIconButton";
import AddPlayerForm from "../forms/AddPlayerForm";
import * as Crypto from "expo-crypto";
import useProgressTracker from "@/hooks/v2/useProgressTracker";
import { useLogScore } from "@/hooks/v2/useLogScore";
import PlayerIconPair from "@/components/_ui/custom-components/PlayerIconPair";

interface IPlayerSelectorProps {
  player: Player,
  selected: boolean,
  onPress: () => void,
  isNewPlayer?: boolean,
  type?: 'primary' | 'secondary',
}

interface IQuickAddSectionProps {
  onClose: () => void,
  addPlayer: (player: Player) => void,
}

export default function MatchPlayersStep() {
  const { type, sideA, sideB, setSideA, setSideB } = useLogScore();
  const { current, checkIsNextDisabled } = useProgressTracker();

  // List & add players manually
  const players = usePlayersStore((state) => state.players);
  const addPlayer = usePlayersStore((state) => state.addPlayer);

  // Quick add player
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState<boolean>(false);
  const [newPlayerIds, setNewPlayerIds] = useState<string[]>([]);
  
  const muted = useThemeColor('muted');

  const handleSelectPlayer = (player: Player) => {
    const expectedLength = type === 'doubles' ? 2 : 1;

    // Remove player if already selected
    if (sideA.find((p) => p.id === player.id)) {
      setSideA(sideA.filter((p) => p.id !== player.id));
      return;
    }

    if (sideB.find((p) => p.id === player.id)) {
      setSideB(sideB.filter((p) => p.id !== player.id));
      return;
    }

    // Otherwise, add player to the first available side
    if (sideA.length < expectedLength) {
      setSideA([...sideA, player]);
      return;
    }

    if (sideB.length < expectedLength) {
      setSideB([...sideB, player]);
      return;
    }
  }

  const handleExpandQuickAdd = () => setIsQuickAddExpanded(true);

  const handleQuickAddPlayer = (player: Player) => {
    addPlayer(player);
    setNewPlayerIds((prev) => [player.id, ...prev]);
    handleSelectPlayer(player);
  }

  const orderedPlayers = useMemo(() => {
    return [
      ...newPlayerIds.map((id) => players.find((p) => p.id === id)).filter((p): p is Player => Boolean(p)),
      ...players.filter((p) => !newPlayerIds.includes(p.id)),
    ];
  }, [players, newPlayerIds]);

  useEffect(() => {
    if (current !== 1) return;
    const expectedLength = type === 'doubles' ? 2 : 1;
    checkIsNextDisabled({ sideA, sideB }, () => sideA.length === expectedLength && sideB.length === expectedLength);
  }, [sideA, sideB]);

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
                selected={sideA.concat(sideB).find((player) => player.id === p.id) ? true : false}
                onPress={() => handleSelectPlayer(p)}
                isNewPlayer={newPlayerIds.includes(p.id)}
                type={sideA.find((player) => player.id === p.id) ? 'primary' : 'secondary'}
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
      type={props.type}
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
        <PlayerIconPair
          player1={{ id: '1', firstName: 'Jason', lastName: 'Choo', color: '#b54aa5' }}
          player2={{ id: '2', firstName: 'Bryan', lastName: 'Kee', color: '#c89b3a' }}
          size={32}
        />
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
