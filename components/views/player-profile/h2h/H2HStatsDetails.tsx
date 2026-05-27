import MatchSummaryCard from "@/components/_ui/card/MatchSummaryCard";
import { Bar } from "@/components/_ui/custom-components/Bar";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Match } from "@/models/v2/data/Match";
import { H2HStats } from "@/models/v2/views/PlayerProfileTab";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

interface IH2HStatsDetailsProps {
  stats: H2HStats,
  recentMatch: Match | undefined,
}

export default function H2HStatsDetails(props: IH2HStatsDetailsProps) {
  const player = useThemeColor('primary');
  const opponent = useThemeColor('secondary');

  const rows = [
    { label: "Win Rate", key: "winRate" },
    { label: "Sets", key: "setsWon" },
  ]

  return (
    <Fragment>
      <View style={{ rowGap: 16, paddingHorizontal: 24 }}>
        <ThemedText weight="bold" style={[{ alignSelf: "center", fontSize: 18 }]}>Head 2 Head</ThemedText>
        <Bar
          values={props.stats.h2h}
          customBackgroundColor={opponent}
          customBarColor={player}
          barContentStyle={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        />
        {
          rows.map(stat => (
            <H2HStatRow
              key={stat.key}
              stat={{ title: stat.label, values: (props.stats as any)[stat.key] }}
            />
          ))
        }
      </View>
      {
        props.recentMatch && (
          <View style={{ rowGap: 16 }}>
            <ThemedText weight="bold" style={[{ fontSize: 18 }]}>Recent Encounter</ThemedText>
            <MatchSummaryCard match={props.recentMatch} />
          </View>
        )
      }
    </Fragment>
  );
}

function H2HStatRow({ stat }: { stat: { title: string, values: any[] }}) {
  return (
    <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
      <ThemedText style={[styles.statValue]}>
        {stat.values[0]}{stat.title === "Win Rate" && '%'}
      </ThemedText>
      <ThemedText weight="bold" style={[styles.statTitle]}>
        {stat.title}
      </ThemedText>
      <ThemedText style={[styles.statValue, { textAlign: "right" }]}>
        {stat.values[1]}{stat.title === "Win Rate" && '%'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  statValue: {
    width: '20%',
    maxWidth: '20%',
  },
  statTitle: {
    flex: 1,
    textAlign: 'center',
  }
});