import Button from "@/components/_ui/button/Button";
import Card from "@/components/_ui/card/Card";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import ScreenHeader from "@/components/views/headers/ScreenHeader";
import H2HStats from "@/components/views/match-profile/H2HStats";
import ScoreHeader from "@/components/views/match-profile/ScoreHeader";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { useMatchesStore } from "@/store/useMatchesStore";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function MatchProfileScreen() {
  const { id } = useLocalSearchParams();
  const primary = useThemeColor('primary');
  const muted = useThemeColor('muted');

  const match = useMatchesStore(
    useShallow((state) => {
      return state.matches.find(match => match.id === id);
    })
  );

  return (
    <ThemedView style={[Styles.SCREEN_BODY]}>
      {
        !match && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
            <ThemedText>Oops! Match not found</ThemedText>
          </View>
        )
      }
      {
        match && (
          <ScrollView contentContainerStyle={{ rowGap: 16 }}>
            <ScreenHeader
              renderActionButton={() => (
                <Button
                  text="Edit"
                  onPress={() => { }}
                  weight="bold"
                  textStyle={{ fontSize: 18, color: primary }}
                />
              )}
            />

            {/* Header */}
            <ScoreHeader match={match} />

            {/* H2H Stats */}
            <H2HStats match={match} />

            {/* Match Overview */}
            <View style={{ rowGap: 16 }}>
              <ThemedText weight="bold" style={{ fontSize: 18 }}>Match Overview</ThemedText>
              <View style={[Styles.FLEX_HORIZONTAL_CENTER, { justifyContent: 'flex-start', flexWrap: 'wrap', columnGap: 8 }]}>
                <Card style={[styles.overviewCard]}>
                  <View style={[Styles.FLEX_HORIZONTAL_CENTER, { columnGap: 8 }]}>
                    <FontAwesome name="users" size={18} color={muted} />
                    <ThemedText weight="bold" style={[{ fontSize: 16, color: muted }]}>Type</ThemedText>
                  </View>
                  <ThemedText style={[{ textTransform: 'capitalize' }]}>{match.type}</ThemedText>
                </Card>
                <Card style={[styles.overviewCard]}>
                  <View style={[Styles.FLEX_HORIZONTAL_CENTER, { columnGap: 8 }]}>
                    <FontAwesome name="calendar" size={18} color={muted} />
                    <ThemedText weight="bold" style={[{ fontSize: 16, color: muted }]}>Date</ThemedText>
                  </View>
                  <ThemedText>{match.date}</ThemedText>
                </Card>
              </View>
            </View>
          </ScrollView>
        )
      }
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  overviewCard: {
    ...Styles.FLEX_COLUMN,
    alignItems: 'flex-start',
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    rowGap: 4,
  }
});