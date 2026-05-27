import { View } from "react-native";
import H2HSelector from "./h2h/H2HSelector";
import { PlayerProfileTab } from "@/models/v2/views/PlayerProfileTab";
import { Player } from "@/models/v2/data/Player";
import { useMemo, useRef, useState } from "react";
import { PlayerStatsHelper } from "@/utils/v2/player-stats-helper.util";
import H2HStatsDetails from "./h2h/H2HStatsDetails";
import moment from "moment";
import { Match } from "@/models/v2/data/Match";

type PlayerH2HTab = Omit<PlayerProfileTab, 'playerId'> & {
  player: Player,
};

export default function PlayerH2HTab(props: PlayerH2HTab) {
  const [selectedPartner, setSelectedPartner] = useState<Player | undefined>(undefined);
  const [selectedOpponent, setSelectedOpponent] = useState<Player[] | undefined>(undefined);
  const containerRef = useRef<View>(null);

  const partners = useMemo(() => {
    return Object.values(PlayerStatsHelper.getAllPartners(props.matches, props.player.id)).map(value => value);
  }, [props.matches, props.player]);

  const opponents = useMemo(() => {
    return PlayerStatsHelper.getAllOpponents(
      props.matches.filter(match => match.type === (selectedPartner ? 'doubles' : 'singles')),
      props.player.id,
      selectedPartner?.id
    );
  }, [selectedPartner]);

  const toughestOpponents = useMemo(() => {
    return PlayerStatsHelper.getToughestOpponents(
      props.matches.filter(match => match.type === (selectedPartner ? 'doubles' : 'singles')),
      props.player.id,
      selectedPartner?.id
    );
  }, [props.matches, props.player, selectedPartner]);

  const h2hStats = useMemo(() => {
    if (!selectedOpponent || selectedOpponent.length === 0) return;

    const h2h = PlayerStatsHelper.getH2H(
      props.matches.filter(match => match.type === (selectedPartner ? 'doubles' : 'singles')),
      selectedOpponent,
      selectedPartner ? [props.player, selectedPartner] : [props.player]
    );

    const h2hStats = PlayerStatsHelper.getH2HDetails(
      props.matches.filter(match => match.type === (selectedPartner ? 'doubles' : 'singles')),
      h2h,
      selectedOpponent,
      selectedPartner ? [props.player, selectedPartner] : [props.player]
    );

    return {
      h2h,
      ...h2hStats,
    }
  }, [props.matches, props.player, selectedPartner, selectedOpponent]);

  const recentMatch = useMemo(() => {
    if (!selectedOpponent || selectedOpponent.length === 0) return;

    const matches = PlayerStatsHelper.getAllMatchesByPlayerIds(
      props.matches,
      selectedPartner ? [props.player.id, selectedPartner.id] : [props.player.id],
      selectedOpponent.map(o => o.id)
    );
    return matches
      .slice()
      .sort((a: Match, b: Match) => moment(b.date, "DD/MM/YYYY").diff(moment(a.date, "DD/MM/YYYY")))[0];
  }, [props.matches, props.player, selectedPartner, selectedOpponent]);

  return (
    <View
      ref={containerRef}
      onLayout={props.onLayout}
      style={{ padding: 24, rowGap: 16 }}
    >
      <H2HSelector
        player={props.player}
        partners={partners}
        opponents={opponents}
        toughestOpponents={toughestOpponents}
        selectedPartner={selectedPartner}
        setSelectedPartner={setSelectedPartner}
        selectedOpponent={selectedOpponent}
        setSelectedOpponent={setSelectedOpponent}
      />

      {
        h2hStats && (
          <H2HStatsDetails
            stats={h2hStats}
            recentMatch={recentMatch}
          />
        )
      }
    </View>
  );
}