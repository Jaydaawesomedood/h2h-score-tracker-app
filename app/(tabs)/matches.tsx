import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedDropdown from "@/components/inputs/ThemedDropdown";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Containers } from "@/constants/styles/Containers";
import { Text } from "@/constants/styles/Text";
import { Match } from "@/models/Match";
import { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { showErrorToast } from "@/utils/toast.util";
import MatchSummaryCard from "@/components/views/matches/MatchSummaryCard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { DbContext } from "@/utils/context";
import { GetAllMatches } from "@/utils/repositories/MatchRepository";
import { ThemedTabView } from "@/components/tab-view/ThemedTabView";

export default function MatchesScreen() {
  // Context
  const db = useContext(DbContext);
  const isFocused = useIsFocused();

  // Styling
  const inputLabelStyle = Text.inputLabel;

  // Colors
  const tabBackgroundColor = useThemeColor('background');
  
  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // State variables
  const [matchCategoryFilter, setMatchCategoryFilter] = useState<string>("all");
  const [recentSinglesMatches, setRecentSinglesMatches] = useState<Match[]>([]);
  const [recentDoublesMatches, setRecentDoublesMatches] = useState<Match[]>([]);

  // Navigation
  const onAddMatch = () => { router.push("/(add)/add-match"); };

  const getAllMatches = async () => {
    if (db) {
      await GetAllMatches(db, setRecentSinglesMatches, setRecentDoublesMatches, showErrorToast);
    }
    else {
      showErrorToast();
    }
  };

  const renderSinglesMatchesTab = () => {
    return (
      <ScrollView style={{ backgroundColor: tabBackgroundColor, flex: 1, paddingHorizontal: 32 }}>
        <ThemedDropdown
          options={[
            { label: "All", value: "all" },
            { label: "Casual Games", value: "casual" },
            { label: "Tournament Games", value: "tournament"}
          ]}
          placeholder="Filter By"
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
          value={matchCategoryFilter}
          setValue={setMatchCategoryFilter}
          onPress={() => {}}
          label="Filter By Category"
          labelStyle={inputLabelStyle}
          containerStyle={{ marginVertical: 16 }}
        />
        {
          recentSinglesMatches.map((match: Match, index: number) => (
            <MatchSummaryCard key={match.id} match={match} mode="singles" style={{ marginTop: 16 }}/>
          ))
        }
      </ScrollView>
    );
  };

  const renderDoublesMatchesTab = () => {
    return (
      <ScrollView style={{ backgroundColor: tabBackgroundColor, flex: 1, paddingHorizontal: 32 }}>
        <ThemedDropdown
          options={[
            { label: "All", value: "all" },
            { label: "Casual Games", value: "casual" },
            { label: "Tournament Games", value: "tournament"}
          ]}
          placeholder="Filter By"
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
          value={matchCategoryFilter}
          setValue={setMatchCategoryFilter}
          onPress={() => {}}
          label="Filter By Category"
          labelStyle={inputLabelStyle}
          containerStyle={{ marginVertical: 16 }}
        />
        {
          recentDoublesMatches.map((match: Match, index: number) => (
            <MatchSummaryCard key={match.id} match={match} mode="doubles" style={{ marginTop: index === 0 ? 16 : 0, marginVertical: 16 }}/>
          ))
        }
      </ScrollView>
    );
  };

  // useEffect
  useEffect(() => {
    if (isFocused) getAllMatches();
  }, [isFocused]);

  return (
    <ThemedView style={[Containers.screen, { paddingBottom: 0, paddingHorizontal: 0 }]}>
      <ScreenTitle
        title="Matches"
        actionBtn={{
          title: "Add",
          icon: "plus",
          iconPosition: "left",
          onActionBtn: onAddMatch
        }}
        style={{ paddingHorizontal: 32 }}
      />
      <View style={{ paddingHorizontal: 32 }}>
        <ThemedText style={[Text.title.section, { marginBottom: 8 }]}>Most Recent</ThemedText>
      </View>
      {
        (recentDoublesMatches.length > 0) &&
        <ThemedTabView
          tabs={[
            { label: "Singles", screen: renderSinglesMatchesTab() },
            { label: "Doubles", screen: renderDoublesMatchesTab() }
          ]}
        />
      }
    </ThemedView>
  );
}