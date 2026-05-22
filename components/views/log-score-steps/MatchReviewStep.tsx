import PlayerIcon from "@/components/_ui/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import { useLogScore } from "@/hooks/v2/useLogScore";
import useThemeColor from "@/hooks/v2/useThemeColor";
import DateHelper from "@/utils/date-helper.util";
import moment from "moment";
import { View, ScrollView, StyleSheet } from "react-native";

export default function MatchReviewStep() {
  const { type, date, sets, sideA, sideB } = useLogScore();

  const muted = useThemeColor("muted");
  const primary = useThemeColor("primary");
  const background = useThemeColor("card");
  const border = useThemeColor("border");

  const getDate = () => {
    if (date === DateHelper.toDateWithFormat(moment().date().toString())) return "Today";
    else if (date === DateHelper.toDateWithFormat(moment().subtract(1, 'day').date().toString())) return "Yesterday";
    return date;
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{ rowGap: 16, height: '100%' }}>
        <ThemedText style={{ color: muted }}>
          Review your changes
        </ThemedText>
        <View style={[styles.container, { backgroundColor: background, borderColor: border }]}>
          <ThemedText weight="bold" style={{ color: muted, textTransform: 'capitalize' }}>{type} • {getDate()}</ThemedText>
          <View id="logscore-review-players" style={[Styles.FLEX_HORIZONTAL_CENTER]}>
            <View style={[Styles.FLEX_COLUMN, { rowGap: 8 }]}>
              <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
                <PlayerIcon player={{ "firstName": "Jason", "lastName": "Choo", "id": "1", "color": "#b54aa5" }} size={48} />
              </View>
              <ThemedText weight="bold">Jason Choo</ThemedText>
            </View>
            <View style={{ marginHorizontal: 16 }}>
              <ThemedText weight="bold" style={{ color: muted, fontSize: 16 }}>VS</ThemedText>
            </View>
            <View style={[Styles.FLEX_COLUMN, { rowGap: 8 }]}>
              <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
                <PlayerIcon player={{ "firstName": "Bryan", "lastName": "Kee", "id": "2", "color": "#c89b3a" }} size={48} />
              </View>
              <ThemedText weight="bold">Bryan Kee</ThemedText>
            </View>
          </View>
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