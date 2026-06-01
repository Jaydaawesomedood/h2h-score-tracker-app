import MatchSummaryCard from "@/components/_ui/card/MatchSummaryCard";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import TodayActivity from "@/components/views/home/TodayActivity";
import PlayerOverallBanner from "@/components/views/player-profile/overview/PlayerOverallBanner";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Match } from "@/models/v2/data/Match";
import { useMatchesStore } from "@/store/useMatchesStore";
import { usePlayersStore } from "@/store/usePlayersStore";
import { PlayerStatsHelper } from "@/utils/v2/player-stats-helper.util";
import moment from "moment";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function HomeScreen() {
  const primary = useThemeColor('primary');
  const muted = useThemeColor('muted');

  const player = usePlayersStore(
    useShallow(state => state.players.find(pl => pl.isMe))
  );

  if (!player) {
    return (
      <ThemedView style={[Styles.SCREEN_BODY]}>
        <ThemedText weight="light">Oops! No data available.</ThemedText>
      </ThemedView>
    );
  }

  // Get all matches player has played
  const matches = useMatchesStore(
    useShallow((state) => {
      return state.matches.filter((match) => match.sideA.find((p) => p.id === player?.id) || match.sideB.find((p) => p.id === player?.id));
    })
  );

  const overallStats = useMemo(() => {
    const { matchesWon, wlPercentage } = PlayerStatsHelper.getMatchesSummary(matches, player.id);
    return {
      winRate: { value: wlPercentage, label: "Win Rate", color: primary },
      matches: { value: matches.length, label: "Matches", color: '' },
      matchesWon: { value: matchesWon, label: "Won", color: primary },
    };
  }, [matches]);

  const todayStats = useMemo(() => {
    const matchesToday = matches.filter(m => moment(m.date, "DD/MM/YYYY").date() === moment().date());
    const stats = PlayerStatsHelper.getMatchesSummary(matchesToday, player.id);
    const topPartner = PlayerStatsHelper.getPartnersStats(matchesToday.filter(m => m.type === 'doubles'), player.id).slice(0, 1);

    return {
      matchesToday: matchesToday.length,
      statsToday: stats,
      topPartnerToday: topPartner[0],
    }
  }, [matches])

  // Get most recent matches
  const recentMatches = useMemo(() => {
    return matches
      .slice()
      .sort((a: Match, b: Match) => {
        if (a.date !== b.date) {
          return moment(b.date, "DD/MM/YYYY").diff(moment(a.date, "DD/MM/YYYY"))
        }
        return (b.createdAt - a.createdAt);
      })
      .slice(0, 2);
  }, [matches]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[Styles.SCREEN_BODY, { rowGap: 24, flex: 0 }]}>
        <View style={{ rowGap: 16 }}>
          <View style={[Styles.FLEX_HORIZONTAL_SIDE, { alignItems: 'center' }]}>
            <View style={[Styles.FLEX_COLUMN]}>
              <ThemedText style={{ color: muted, fontSize: 18 }}>Welcome,</ThemedText>
              <ThemedText weight="bold" style={{ fontSize: 36, lineHeight: 48 }}>{player.firstName}</ThemedText>
            </View>
            <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
              <PlayerIcon player={player} size={48} />
            </View>
          </View>
          {
            overallStats && (<PlayerOverallBanner summary={overallStats} />)
          }
        </View>
        <View style={{ rowGap: 24 }}>
          <ThemedText weight="bold" style={[styles.sectionTitle, { color: muted }]}>Today's Activity</ThemedText>
          <TodayActivity stats={todayStats} />
        </View>
        <View style={{ rowGap: 24 }}>
          <ThemedText weight="bold" style={[styles.sectionTitle, { color: muted }]}>Recent Matches</ThemedText>
          <View style={{ rowGap: 16 }}>
            {
              recentMatches.length > 0 ? (
                recentMatches.map(match => (
                  <MatchSummaryCard key={match.id} match={match} />
                ))
              )
              : (
                <ThemedText weight="light">No data available.</ThemedText>
              )
            }
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    letterSpacing: 2,
    textTransform: 'capitalize',
  }
});
