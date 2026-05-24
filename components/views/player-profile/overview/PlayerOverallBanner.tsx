import Card from "@/components/_ui/card/Card";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import { OverviewCategory } from "@/models/v2/views/PlayerProfileTab";
import { StyleSheet, View } from "react-native";

interface IPlayerOverallBannerProps {
  summary: OverviewCategory,
}

export default function PlayerOverallBanner({ summary }: IPlayerOverallBannerProps) {
  return (
    <View style={[styles.overallStatsBanner]}>
      {
        Object.entries(summary).map(([key, value]) => (
          <Card key={key} style={[styles.overallStatsCard]}>
            <ThemedText weight="bold" style={{ fontSize: 28, color: value.color ?? "" }}>
              {value.value}
            </ThemedText>
            <ThemedText weight="light" style={{ fontSize: 12 }}>
              {value.label}
            </ThemedText>
          </Card>
        ))
      }
    </View>
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