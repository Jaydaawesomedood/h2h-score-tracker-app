import Button from "@/components/_ui/button/Button";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import ThemedTabView from "@/components/tab-view/ThemedTabView";
import ScreenHeader from "@/components/views/headers/ScreenHeader";
import PlayerH2HTab from "@/components/views/player-profile/PlayerH2HTab";
import PlayerOverviewTab from "@/components/views/player-profile/PlayerOverviewTab";
import PlayerStatsTab from "@/components/views/player-profile/PlayerStatsTab";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { useMatchesStore } from "@/store/useMatchesStore";
import { usePlayersStore } from "@/store/usePlayersStore";
import { Href, router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function PlayerProfileScreen() {
  const primary = useThemeColor('primary');
  const { id } = useLocalSearchParams();
  
  // Get player info
  const player = usePlayersStore(
    useShallow((state) => {
      return state.players.find((player) => player.id === id);
    })
  );

  // Get all matches player has played
  const matches = useMatchesStore(
    useShallow((state) => {
      return state.matches.filter((match) => match.sideA.find((p) => p.id === id) || match.sideB.find((p) => p.id === id));
    })
  );

  // TODO - Set context to this component tree would be better
  return (
    <ThemedView style={[Styles.SCREEN_BODY, { paddingHorizontal: 0 }]}>
      {
        !player && (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
            <ThemedText>Oops! Player not found</ThemedText>
          </View>
        )
      }
      {
        player && (
          <ScrollView contentContainerStyle={{ rowGap: 16 }}>
            <ScreenHeader
              style={{ paddingHorizontal: 24 }}
              renderActionButton={() => (
                <Button
                  text="Edit"
                  onPress={() => router.push(`player/${id}/edit` as Href)}
                  weight="bold"
                  textStyle={{ fontSize: 18, color: primary }}
                />
              )}
            />
            {/* Header */}
            <View style={[styles.header, { paddingHorizontal: 24 }]}>
              <PlayerIcon size={96} player={player} />
              <View style={[styles.headerTextContainer]}>
                <ThemedText weight="bold" style={{ fontSize: 32 }}>
                  {player.firstName} {player.lastName}
                </ThemedText>
                <ThemedText weight="light">
                  {matches.length} {`match${matches.length !== 1 ? "es" : ""} played`}
                </ThemedText>
              </View>
            </View>
            {
              matches.length > 0
              ? (
                <View style={{ flexGrow: 1 }}>
                  <ThemedTabView
                    tabs={[
                      { label: "Overview", screen: { Component: PlayerOverviewTab, props: { matches, playerId: id as string }} },
                      { label: "Stats", screen: { Component: PlayerStatsTab, props: { matches, playerId: id as string } } },
                      { label: "H2H", screen: { Component: PlayerH2HTab, props: { matches, player } } },
                    ]}
                  />
                </View>
              )
              : (
                <View style={[Styles.FLEX_HORIZONTAL_CENTER, { flexGrow: 1, marginVertical: 32 }]}>
                  <ThemedText weight="light">No data available for this player.</ThemedText>
                </View>
              )
            }
          </ScrollView>
        )
      }
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    ...Styles.FLEX_HORIZONTAL_SIDE,
    justifyContent: "flex-start",
    columnGap: 16,
  },
  headerTextContainer: {
    ...Styles.FLEX_COLUMN,
    flex: 1,
    flexShrink: 1,
  },
});