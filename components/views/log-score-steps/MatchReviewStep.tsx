import PlayerIcon from "@/components/_ui/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { View, ScrollView, StyleSheet } from "react-native";

export default function MatchReviewStep() {
  const muted = useThemeColor("muted");
  const primary = useThemeColor("primary");
  const background = useThemeColor("card");
  const border = useThemeColor("border");

  return (
    <View>
      <ScrollView contentContainerStyle={{ rowGap: 16, height: '100%'}}>
        <ThemedText style={{ color: muted }}>
          Review your changes
        </ThemedText>
        <View style={[styles.container, { backgroundColor: background, borderColor: border }]}>
          <ThemedText weight="bold" style={{ color: muted }}>Singles • Today</ThemedText>
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
            <View style={[Styles.FLEX_HORIZONTAL_CENTER, { columnGap: 64 }]}>
              <View style={{ minWidth: 80 }}>
                <ThemedText weight="bold" style={{ color: muted, fontSize: 16 }}>Set 1</ThemedText>
              </View>
              <View style={{ flex: 1, ...Styles.FLEX_HORIZONTAL_CENTER, justifyContent: 'flex-start' }}>
                <ThemedText weight="bold" style={{ fontSize: 24 }}>28</ThemedText>
              </View>
              <View style={{ flex: 1, ...Styles.FLEX_HORIZONTAL_CENTER, justifyContent: 'flex-start' }}>
                <ThemedText weight="bold" style={{ fontSize: 24, color: primary }}>30</ThemedText>
              </View>
            </View>
            <View style={[Styles.FLEX_HORIZONTAL_CENTER, { columnGap: 64 }]}>
              <View style={{ minWidth: 80 }}>
                <ThemedText weight="bold" style={{ color: muted, fontSize: 16 }}>Set 2</ThemedText>
              </View>
              <View style={{ flex: 1, ...Styles.FLEX_HORIZONTAL_CENTER, justifyContent: 'flex-start' }}>
                <ThemedText weight="bold" style={{ fontSize: 24, color: primary }}>21</ThemedText>
              </View>
              <View style={{ flex: 1, ...Styles.FLEX_HORIZONTAL_CENTER, justifyContent: 'flex-start' }}>
                <ThemedText weight="bold" style={{ fontSize: 24 }}>19</ThemedText>
              </View>
            </View>
            <View style={[Styles.FLEX_HORIZONTAL_CENTER, { columnGap: 64 }]}>
              <View style={{ minWidth: 80 }}>
                <ThemedText weight="bold" style={{ color: muted, fontSize: 16 }}>Set 3</ThemedText>
              </View>
              <View style={{ flex: 1, ...Styles.FLEX_HORIZONTAL_CENTER, justifyContent: 'flex-start' }}>
                <ThemedText weight="bold" style={{ fontSize: 24, color: primary }}>21</ThemedText>
              </View>
              <View style={{ flex: 1, ...Styles.FLEX_HORIZONTAL_CENTER, justifyContent: 'flex-start' }}>
                <ThemedText weight="bold" style={{ fontSize: 24 }}>16</ThemedText>
              </View>
            </View>
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
  }
});