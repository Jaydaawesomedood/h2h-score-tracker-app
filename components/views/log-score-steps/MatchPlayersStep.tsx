import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import SelectableOption from "@/components/_ui/select/SelectableOption";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { usePlayersStore } from "@/store/usePlayersStore";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Button from "@/components/_ui/button/Button";
import DashedIconButton from "@/components/_ui/button/DashedIconButton";
import AddPlayerForm from "../forms/AddPlayerForm";
import useProgressTracker from "@/hooks/v2/useProgressTracker";
import { useLogScore } from "@/hooks/v2/useLogScore";
import PlayerIconPair from "@/components/_ui/custom-components/PlayerIconPair";
import { useMatchesStore } from "@/store/useMatchesStore";
import moment from "moment";
import { Match } from "@/models/v2/data/Match";
import DateHelper from "@/utils/v2/date-helper.util";
import { useShallow } from "zustand/react/shallow";
import Badge from "@/components/_ui/badge/Badge";

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

interface IRecentMatchCardProps {
  match: Match,
  onPress: () => void,
  selected: boolean,
}

export default function MatchPlayersStep() {
  const { type, sideA, sideB, setSideA, setSideB } = useLogScore();
  const recentMatches = useMatchesStore(
    useShallow((state) => {
      return state.matches
              .filter((match: Match) => match.type === type)
              .sort((a: Match, b: Match) => moment(b.date, "DD/MM/YYYY").diff(moment(a.date, "DD/MM/YYYY")))
              .slice(0, 2)
    }
  ));
  const { current, checkIsNextDisabled } = useProgressTracker();

  // List & add players manually
  const players = usePlayersStore((state) => state.players);
  const addPlayer = usePlayersStore((state) => state.addPlayer);

  // Quick add player
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState<boolean>(false);
  const [newPlayerIds, setNewPlayerIds] = useState<string[]>([]);

  // Recent matches
  const [recentMatchSelection, setRecentMatchSelection] = useState<Match | undefined>(undefined);
  
  const muted = useThemeColor('muted');

  const handleExpandQuickAdd = () => setIsQuickAddExpanded(true);

  const handleQuickAddPlayer = async (player: Player) => {
    const playerId = await addPlayer(player);

    if (playerId && playerId.trim()) {
      setNewPlayerIds((prev) => [playerId, ...prev]);
      handleSelectPlayer({ ...player, id: playerId });
    }
  }

  const handleSelectPlayer = (player: Player) => {
    if (recentMatchSelection) {
      setSideA([player]);
      setSideB([]);
      setRecentMatchSelection(undefined);
      return;
    }
    
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

  const handleSelectRecentMatch = (match: Match) => {
    setRecentMatchSelection(match);
    setSideA(match.sideA);
    setSideB(match.sideB);
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
        {
          recentMatches.length > 0 && (
            <Fragment>
              <View style={{ rowGap: 8 }}>
                <ThemedText weight="bold">Recent Matchups</ThemedText>
                {recentMatches.map((match) => (
                  <RecentMatchCard
                    key={match.id}
                    match={match}
                    onPress={() => handleSelectRecentMatch(match)}
                    selected={recentMatchSelection?.id === match.id}
                  />
                ))}
              </View>
              <ThemedText weight="bold">Or Pick Manually</ThemedText>
            </Fragment>
          )
        }
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
                selected={recentMatchSelection === undefined && sideA.concat(sideB).find((player) => player.id === p.id) ? true : false}
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
            <Badge
              text="New"
            />
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
    props.addPlayer({ ...(formRef.current as any)?.getFormData() });
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

function RecentMatchCard(props: IRecentMatchCardProps) {
  const muted = useThemeColor('muted');

  return (
    <SelectableOption
      selected={props.selected}
      onPress={props.onPress}
      renderLeftSegment={() => (
        <View style={[Styles.FLEX_COLUMN, { rowGap: 8 }]}>
          {
            props.match.type === 'doubles' ? (
              <Fragment>
                <PlayerIconPair
                  player1={props.match.sideA[0]}
                  player2={props.match.sideA[1]}
                  size={32}
                />
                <PlayerIconPair
                  player1={props.match.sideB[0]}
                  player2={props.match.sideB[1]}
                  size={32}
                />
              </Fragment>
            )
            : (
              <PlayerIconPair
                player1={props.match.sideA[0]}
                player2={props.match.sideB[0]}
                size={32}
              />
            )
          }
        </View>
      )}
      renderContent={() => (
        <View>
          <ThemedText weight="bold">
            {props.match.sideA.map(p => p.firstName).join(' & ')}
            &nbsp;vs&nbsp;
            {props.match.sideB.map(p => p.firstName).join(' & ')}
          </ThemedText>
          <ThemedText weight="light" style={{ color: muted, fontSize: 12 }}>
            {DateHelper.getDateDisplayText(props.match.date)}
          </ThemedText>
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
