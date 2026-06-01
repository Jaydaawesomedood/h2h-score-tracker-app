import Card from "@/components/_ui/card/Card";
import MatchSummaryCard from "@/components/_ui/card/MatchSummaryCard";
import { Bar } from "@/components/_ui/custom-components/Bar";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Match } from "@/models/v2/data/Match";
import { useMatchesStore } from "@/store/useMatchesStore";
import { usePlayersStore } from "@/store/usePlayersStore";
import { PlayerStatsHelper } from "@/utils/v2/player-stats-helper.util";
import moment from "moment";
import React, { Fragment, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

interface IHomeActivityProps {
  title: string,
  renderContent: () => React.JSX.Element,
}

export default function HomeScreen() {
  const primary = useThemeColor('primary');
  const secondary = useThemeColor('secondary');
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
      <ScrollView contentContainerStyle={[Styles.SCREEN_BODY, { rowGap: 16, flex: 0 }]}>
        <View style={[Styles.FLEX_HORIZONTAL_SIDE, { alignItems: 'center' }]}>
          <View style={[Styles.FLEX_COLUMN]}>
            <ThemedText style={{ color: muted, fontSize: 18 }}>Welcome,</ThemedText>
            <ThemedText weight="bold" style={{ fontSize: 36, lineHeight: 48 }}>{player.firstName}</ThemedText>
          </View>
          <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
            <PlayerIcon player={player} size={48} />
          </View>
        </View>
        <View style={[styles.overallStatsBanner]}>
          {
            overallStats && (
              Object.entries(overallStats).map(([key, value]) => (
                <Card key={key} style={[styles.overallStatsCard]}>
                  <ThemedText weight="bold" style={{ fontSize: 28, color: value.color ?? "" }}>
                    {value.value}
                  </ThemedText>
                  <ThemedText weight="light" style={{ fontSize: 12 }}>
                    {value.label}
                  </ThemedText>
                </Card>
              ))
            )
          }
        </View>
        <View style={{ rowGap: 24 }}>
          <ThemedText weight="bold" style={[styles.sectionTitle, { color: muted }]}>Today's Activity</ThemedText>
          <View style={[{ rowGap: 16 }]}>
            {
              todayStats && (
                <View style={{ rowGap: 16 }}>
                  <View style={[Styles.FLEX_HORIZONTAL_CENTER, styles.overallStatsBanner, { justifyContent: 'flex-start', alignItems: 'stretch', columnGap: 16 }]}>
                    <HomeActivityCard
                      title="Win Rate"
                      renderContent={() => (
                        <View style={{ rowGap: 8, width: '100%' }}>
                          <ThemedText weight="bold" style={{ fontSize: 24 }}>{ todayStats.statsToday.wlPercentage }</ThemedText>
                          <Bar
                            values={[todayStats.statsToday.matchesWon, todayStats.statsToday.matchesLost]}
                            barStyle={{ paddingHorizontal: 0 }}
                            showLabels={false}
                          />
                        </View>
                      )}
                    />
                    <HomeActivityCard
                      title="Total Matches"
                      renderContent={() => (
                        <View style={{ rowGap: 8, width: '100%' }}>
                          <ThemedText weight="bold" style={{ fontSize: 24 }}>{ todayStats.matchesToday }</ThemedText>
                          <ThemedText weight="bold" style={{ color: muted }}>Matches Played</ThemedText>
                        </View>
                      )}
                    />
                  </View>
                  <View style={{ width: '100%' }}>
                    <HomeActivityCard
                      title="Top Partner"
                      renderContent={() => (
                        <View style={{ rowGap: 8, width: '100%' }}>
                          {
                            todayStats.topPartnerToday ? (
                              <Fragment>
                                <View style={[Styles.FLEX_HORIZONTAL_SIDE, { alignItems: 'flex-end' }]}>
                                  <View style={[Styles.FLEX_HORIZONTAL_CENTER, { justifyContent: 'flex-start', columnGap: 8 }]}>
                                    <PlayerIcon player={todayStats.topPartnerToday} size={32} />
                                    <ThemedText weight="bold" style={{ fontSize: 24 }}>{ todayStats.topPartnerToday.firstName } { todayStats.topPartnerToday.lastName }</ThemedText>
                                  </View>
                                  <View style={[Styles.FLEX_HORIZONTAL_CENTER, { justifyContent: 'flex-start', alignItems: 'flex-end', columnGap: 8 }]}>
                                    <ThemedText weight="bold" style={{ color: secondary, fontSize: 18 }}>{ todayStats.topPartnerToday.winRate }%</ThemedText>
                                    <ThemedText weight="light" style={{ color: muted }}>WR</ThemedText>
                                  </View>
                                </View>
                                <Bar
                                  values={[todayStats.topPartnerToday.won, todayStats.topPartnerToday.lost]}
                                  customBarColor={secondary}
                                  barStyle={{ paddingHorizontal: 0 }}
                                  showLabels={false}
                                />
                              </Fragment>
                            )
                            : (
                              <ThemedText weight="light">No data available.</ThemedText>
                            )
                          }
                        </View>
                      )}
                    />
                  </View>
                </View>
              )
            }
          </View>
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

function HomeActivityCard(props: IHomeActivityProps) {
  const muted = useThemeColor('muted');

  return (
    <Card style={[styles.overallStatsCard, { rowGap: 12, justifyContent: 'space-between' }]}>
      <View style={{ width: '100%', justifyContent: 'flex-start' }}>
        <ThemedText style={{ color: muted }}>{props.title}</ThemedText>
      </View>
      { props.renderContent() }
    </Card>
  );
}

const styles = StyleSheet.create({
  overallStatsBanner: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    columnGap: 16,
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  overallStatsCard: {
    ...Styles.FLEX_COLUMN,
    rowGap: 4,
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  sectionTitle: {
    fontSize: 18,
    letterSpacing: 2,
    textTransform: 'capitalize',
  }
});
