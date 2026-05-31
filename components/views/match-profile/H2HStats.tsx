import Card from "@/components/_ui/card/Card";
import { Bar } from "@/components/_ui/custom-components/Bar";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Match } from "@/models/v2/data/Match";
import { useMatchesStore } from "@/store/useMatchesStore";
import { PlayerStatsHelper } from "@/utils/v2/player-stats-helper.util";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface IH2HStatsProps {
  match: Match,
}

export default function H2HStats({ match }: IH2HStatsProps) {
  const player = useThemeColor('primary');
  const opponent = useThemeColor('secondary');
  
  const matches = useMatchesStore(state => state.matches);

  const h2h = useMemo(() => {
    return PlayerStatsHelper.getH2H(
      matches,
      match.sideB,
      match.sideA
    );
  }, [match]);

  const h2hDetails = useMemo(() => {
    return PlayerStatsHelper.getH2HDetails(
      matches,
      h2h,
      match.sideB,
      match.sideA
    );
  }, [match, h2h]);

  const points = useMemo(() => {
    const sideAPoints = match.sets.reduce((acc, curr) => acc + curr[0], 0);
    const sideBPoints = match.sets.reduce((acc, curr) => acc + curr[1], 0);
    return {
      points: [sideAPoints, sideBPoints],
      percentage: [
        ((sideAPoints / (sideAPoints + sideBPoints)) * 100).toFixed(1),
        ((sideBPoints / (sideAPoints + sideBPoints)) * 100).toFixed(1)
      ]
    };
  }, [match]);

  const rows = [
    { label: "Win Rate", key: "winRate" },
    { label: "Sets", key: "setsWon" },
  ];

  return (
    <View style={{ rowGap: 16 }}>
      <Card style={[Styles.FLEX_COLUMN, styles.statCard]}>
        <View style={{ width: '100%' }}>
          <ThemedText weight="bold" style={[styles.cardTitle]}>Head 2 Head</ThemedText>
        </View>
        <Bar
          values={h2h}
          customBackgroundColor={opponent}
          customBarColor={player}
          barContentStyle={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        />
        <View style={{ width: '100%', rowGap: 8 }}>
          {
            rows.map(row => (
              <H2HStatRow
                key={row.key}
                stat={{ title: row.label, values: (h2hDetails as any)?.[row.key] ?? []}}
              />
            ))
          }
        </View>
      </Card>
      <Card style={[Styles.FLEX_COLUMN, styles.statCard]}>
        <View style={{ width: '100%' }}>
          <ThemedText weight="bold" style={[styles.cardTitle]}>Points</ThemedText>
        </View>
        <Bar
          values={points.points}
          subtitle={points.percentage.map(val => `${val}%`)}
          customBackgroundColor={opponent}
          customBarColor={player}
          barContentStyle={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        />
      </Card>
    </View>
  );
}

function H2HStatRow({ stat }: { stat: { title: string, values: any[] } }) {
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
  },
  statCard: {
    rowGap: 16,
    paddingHorizontal: 24,
  },
  cardTitle: {
    fontSize: 18,
    textAlign: 'left'
  }
});