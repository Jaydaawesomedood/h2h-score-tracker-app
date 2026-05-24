import ThemedText from "@/components/_ui/ThemedText";
import { PlayerProfileTab, PlayerStats } from "@/models/v2/views/PlayerProfileTab";
import { useMemo, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import PlayerStatDetails from "./stats/PlayerStatDetails";
import { PlayerStatsHelper } from "@/utils/v2/player-stats-helper.util";

type PlayerStatsTab = PlayerProfileTab

export default function PlayerStatsTab(props: PlayerStatsTab) {
  const [timeframe, setTimeframe] = useState<'overall' | 'thisyear'>('overall');

  const stats: PlayerStats = useMemo(() => {
    const playerSummary = PlayerStatsHelper.getMatchesSummary(props.matches, props.playerId);
    const playerStats = PlayerStatsHelper.getMatchesStats(props.matches, props.playerId);

    return {
      stats: {
        ...playerStats,
        matchesLost: playerSummary.matchesLost,
        winRate: playerSummary.wlPercentage,
      }
    }
  }, [props.matches, props.playerId, timeframe]);

  return (
    <View
      onLayout={props.onLayout}
      style={{ padding: 24, rowGap: 16 }}
    >
      <PlayerStatDetails stats={stats} />
    </View>
  );
}