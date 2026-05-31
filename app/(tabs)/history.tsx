import MatchSummaryCard from "@/components/_ui/card/MatchSummaryCard";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import { Styles } from "@/constants/v2/Styles";
import { useMatchesStore } from "@/store/useMatchesStore";
import { FlatList, View } from "react-native";

export default function HistoryScreen() {
  const matches = useMatchesStore(state => state.matches);

  return (
    <ThemedView style={[Styles.SCREEN_BODY]}>
      <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
        <ThemedText weight="bold" style={{ fontSize: 36, lineHeight: 48 }}>History</ThemedText>
      </View>
      <View style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <FlatList
          data={matches}
          renderItem={({ item }) => <MatchSummaryCard match={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{ rowGap: 8 }}
        />
      </View>
    </ThemedView>
  );
}