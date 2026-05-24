import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Match } from "@/models/v2/data/Match";
import { PlayerStatsHelper } from "@/utils/v2/player-stats-helper.util";
import { useMemo } from "react";
import { View } from "react-native";
import PlayerOverallBanner from "./overview/PlayerOverallBanner";
import CategoryWinRateTable from "./overview/CategoryWinRateTable";
import moment from "moment";
import MatchSummaryCard from "@/components/_ui/card/MatchSummaryCard";
import { PlayerOverview, PlayerProfileTab } from "@/models/v2/views/PlayerProfileTab";

type PlayerOverviewTabProps = PlayerProfileTab;

export default function PlayerOverviewTab(props: PlayerOverviewTabProps) {
  const primary = useThemeColor("primary");
  const loss = useThemeColor("red");

  const matchesSummary: PlayerOverview = useMemo(() => {
    const summary = PlayerStatsHelper.getMatchesSummary(props.matches, props.playerId);
    const singlesSummary = PlayerStatsHelper.getMatchesSummary(props.matches.filter((match) => match.type === "singles"), props.playerId);
    const doublesSummary = PlayerStatsHelper.getMatchesSummary(props.matches.filter((match) => match.type === "doubles"), props.playerId);

    return {
      overall: {
        wins: { value: summary.matchesWon || 0, label: "Wins", color: primary },
        losses: { value: summary.matchesLost || 0, label: "Losses", color: loss },
        winRate: { value: summary.wlPercentage, label: "Win Rate", color: "" },
      },
      singles: {
        wins: { value: singlesSummary.matchesWon || 0, label: "Wins", color: "" },
        losses: { value: singlesSummary.matchesLost || 0, label: "Losses", color: "" },
        winRate: { value: singlesSummary.wlPercentage, label: "Win Rate", color: "" },
      },
      doubles: {
        wins: { value: doublesSummary.matchesWon || 0, label: "Wins", color: "" },
        losses: { value: doublesSummary.matchesLost || 0, label: "Losses", color: "" },
        winRate: { value: doublesSummary.wlPercentage, label: "Win Rate", color: "" },
      }
    };
  }, [props.matches, props.playerId]);

  const recentMatch = useMemo(() => {
    return props.matches.slice()
            .sort((a: Match, b: Match) => moment(b.date, "DD/MM/YYYY").diff(moment(a.date, "DD/MM/YYYY")))[0];
  }, [props.matches, props.playerId]);

  return (
    <View style={[Styles.FLEX_COLUMN, { padding: 24, rowGap: 16 }]} onLayout={props.onLayout}>
      <PlayerOverallBanner summary={matchesSummary.overall} />

      <CategoryWinRateTable summary={matchesSummary} />

      <View style={{ rowGap: 16 }}>
        <ThemedText weight='bold' style={{ fontSize: 18 }}>Latest Match</ThemedText>
        <MatchSummaryCard match={recentMatch} />
      </View>
    </View>
  );
}

