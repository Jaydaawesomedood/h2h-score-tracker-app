import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import PlayerIconPair from "@/components/_ui/custom-components/PlayerIconPair";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import { useLogScore } from "@/hooks/v2/useLogScore";
import useProgressTracker from "@/hooks/v2/useProgressTracker";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import DateHelper from "@/utils/v2/date-helper.util";
import { View, ScrollView, StyleSheet } from "react-native";

export default function MatchReviewStep() {
  const { type, date, sets, sideA, sideB } = useLogScore();
  const { current, totalSteps } = useProgressTracker();

  const muted = useThemeColor("muted");
  const primary = useThemeColor("primary");
  const background = useThemeColor("card");
  const border = useThemeColor("border");

  const renderPlayerIcon = (side: Player[]) => {
    if (current < totalSteps - 1) return undefined;

    if (type === 'singles') {
      return <PlayerIcon player={side[0]} size={48} />;
    }
    else if (type === 'doubles') {
      return (
        <PlayerIconPair
          player1={side[0]}
          player2={side[1]}
          size={48}
        />
      )
    }

    return undefined;
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ rowGap: 16, height: '100%' }}>
        <ThemedText style={{ color: muted }}>
          Review your changes
        </ThemedText>
        <View style={[styles.container, { backgroundColor: background, borderColor: border }]}>
          <ThemedText weight="bold" style={{ color: muted, textTransform: 'capitalize' }}>{type} • {DateHelper.getDateDisplayText(date)}</ThemedText>
          {/* Players */}
          <View id="logscore-review-players" style={[Styles.FLEX_HORIZONTAL_CENTER]}>
            <View style={[Styles.FLEX_COLUMN, { rowGap: 8 }]}>
              <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
                { renderPlayerIcon(sideA) }
              </View>
              <ThemedText weight="bold">{ sideA.map(p => p.firstName).join(' & ') }</ThemedText>
            </View>
            <View style={{ marginHorizontal: 16 }}>
              <ThemedText weight="bold" style={{ color: muted, fontSize: 16 }}>VS</ThemedText>
            </View>
            <View style={[Styles.FLEX_COLUMN, { rowGap: 8 }]}>
              <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
                { renderPlayerIcon(sideB) }
              </View>
              <ThemedText weight="bold">{ sideB.map(p => p.firstName).join(' & ') }</ThemedText>
            </View>
          </View>
          {/* Set Scores */}
          <View>
            {
              sets.map((set, index) => (
                <View key={`match-review-set-${index + 1}`} style={[Styles.FLEX_HORIZONTAL_CENTER, { columnGap: 64 }]}>
                  <View style={{ minWidth: 80 }}>
                    <ThemedText weight="bold" style={{ color: muted, fontSize: 16 }}>Set {index + 1}</ThemedText>
                  </View>
                  <View style={[styles.scoreValueContainer]}>
                    <ThemedText weight="bold" style={[{ fontSize: 24 }, Math.max(...set) === set[0] && { color: primary }]}>{set[0]}</ThemedText>
                  </View>
                  <View style={[styles.scoreValueContainer]}>
                    <ThemedText weight="bold" style={[{ fontSize: 24 }, Math.max(...set) === set[1] && { color: primary }]}>{set[1]}</ThemedText>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Styles.FLEX_COLUMN,
    rowGap: 16,
    borderRadius: 8,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  scoreValueContainer: {
    flex: 1,
    ...Styles.FLEX_HORIZONTAL_CENTER,
    justifyContent: 'flex-start'
  }
});