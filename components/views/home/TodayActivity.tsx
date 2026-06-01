import Card from "@/components/_ui/card/Card";
import { Bar } from "@/components/_ui/custom-components/Bar";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { PartnerStat } from "@/models/v2/views/PlayerProfileTab";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

interface ITodayActivityProps {
  stats: {
    matchesToday: number,
    statsToday: {
      matchesWon: number,
      matchesLost: number,
      wlPercentage: string,
    },
    topPartnerToday: PartnerStat,
  },
}

interface IHomeActivityProps {
  title: string,
  renderContent: () => React.JSX.Element,
}

export default function TodayActivity({ stats }: ITodayActivityProps) {
  const secondary = useThemeColor('secondary');
  const muted = useThemeColor('muted');

  return (
    <View style={[{ rowGap: 16 }]}>
      {
        stats && (
          <View style={{ rowGap: 16 }}>
            <View style={[Styles.FLEX_HORIZONTAL_CENTER, styles.overallStatsBanner, { justifyContent: 'flex-start', alignItems: 'stretch', columnGap: 16 }]}>
              <HomeActivityCard
                title="Win Rate"
                renderContent={() => (
                  <View style={{ rowGap: 8, width: '100%' }}>
                    <ThemedText weight="bold" style={{ fontSize: 24 }}>{stats.statsToday.wlPercentage}</ThemedText>
                    <Bar
                      values={[stats.statsToday.matchesWon, stats.statsToday.matchesLost]}
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
                    <ThemedText weight="bold" style={{ fontSize: 24 }}>{stats.matchesToday}</ThemedText>
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
                      stats.topPartnerToday ? (
                        <Fragment>
                          <View style={[Styles.FLEX_HORIZONTAL_SIDE, { alignItems: 'flex-end' }]}>
                            <View style={[Styles.FLEX_HORIZONTAL_CENTER, { justifyContent: 'flex-start', flexShrink: 1, columnGap: 8 }]}>
                              <PlayerIcon player={stats.topPartnerToday} size={32} />
                              <ThemedText weight="bold" style={{ fontSize: 24 }}>{stats.topPartnerToday.firstName} {stats.topPartnerToday.lastName}</ThemedText>
                            </View>
                            <View style={[Styles.FLEX_HORIZONTAL_CENTER, { justifyContent: 'flex-start', alignItems: 'flex-end', columnGap: 8 }]}>
                              <ThemedText weight="bold" style={{ color: secondary, fontSize: 18 }}>{stats.topPartnerToday.winRate}%</ThemedText>
                              <ThemedText weight="light" style={{ color: muted }}>WR</ThemedText>
                            </View>
                          </View>
                          <Bar
                            values={[stats.topPartnerToday.won, stats.topPartnerToday.lost]}
                            customBarColor={secondary}
                            barStyle={{ paddingHorizontal: 0 }}
                            showLabels={false}
                          />
                        </Fragment>
                      )
                        : (
                          <ThemedText weight="light">No data available</ThemedText>
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
  );
}

function HomeActivityCard(props: IHomeActivityProps) {
  const muted = useThemeColor('muted');

  return (
    <Card style={[styles.overallStatsCard, { rowGap: 12, justifyContent: 'space-between' }]}>
      <View style={{ width: '100%', justifyContent: 'flex-start' }}>
        <ThemedText style={{ color: muted }}>{props.title}</ThemedText>
      </View>
      {props.renderContent()}
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
  }
});