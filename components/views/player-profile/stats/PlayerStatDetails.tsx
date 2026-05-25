import { Bar } from "@/components/_ui/custom-components/Bar";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { PlayerStats } from "@/models/v2/views/PlayerProfileTab";
import { StyleSheet, View } from "react-native";

interface IPlayerStatDetailsProps {
  stats: PlayerStats,
}

interface IStatRowProps {
  label: string,
  value: string,
}

export default function PlayerStatDetails(props: IPlayerStatDetailsProps) {
  const barBackgroundColor = useThemeColor('card');
  const borderColor = useThemeColor('border');

  const details = [
    { key: "matchesPlayed", label: "Matches Played"},
    { key: "winRate", label: "Win Rate"},
    { key: "setsPlayed", label: "Sets Played"},
    { key: "setsWon", label: "Sets Won"},
  ];

  return (
    <View style={[styles.container, { borderColor }]}>
      <ThemedText weight="bold" style={{ fontSize: 18 }}>Matches</ThemedText>
      <View>
        <Bar
          values={[props.stats.stats.matchesWon, props.stats.stats.matchesLost]}
          subtitle={['Won', 'Lost']}
          customBackgroundColor={barBackgroundColor}
        />
      </View>
      {
        details.map(field => (
          <StatRow
            key={field.key}
            label={field.label}
            value={(props.stats.stats as any)[field.key]}
          />
        ))
      }
    </View>
  );
}

function StatRow({ label, value }: IStatRowProps) {
  return (
    <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
      <ThemedText>{label}</ThemedText>
      <ThemedText weight="bold">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    borderWidth: 2,
    borderRadius: 8,
    padding: 24,
  }
});