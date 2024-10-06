import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedDropdown from "@/components/ThemedDropdown";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BorderDebug, Containers } from "@/constants/styles/Containers";
import { Text } from "@/constants/styles/Text";
import { Match } from "@/models/Match";
import { useContext, useEffect, useState } from "react";
import { ScrollView, TextStyle, View } from "react-native";
import { DbContext } from "../_layout";
import { useIsFocused } from "@react-navigation/native";
import { GetAllDoublesMatches, GetAllSinglesMatches } from "@/utils/database/database";
import { showErrorToast } from "@/utils/toast.util";
import { Player, Team } from "@/models/Player";
import PlayerName from "@/components/text/PlayerName";
import MatchSummaryCard from "@/components/views/matches/MatchSummaryCard";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function MatchesScreen() {
  // Context
  const db = useContext(DbContext);
  const isFocused = useIsFocused();
  const Tab = createMaterialTopTabNavigator();

  // Styling
  const inputLabelStyle = Text.inputLabel;

  // Colors
  const tabBackgroundColor = useThemeColor('background');
  const tabIndicatorColor = useThemeColor('primary');
  
  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // State variables
  const [matchCategoryFilter, setMatchCategoryFilter] = useState<string>("all");
  const [recentSinglesMatches, setRecentSinglesMatches] = useState<Match[]>([]);
  const [recentDoublesMatches, setRecentDoublesMatches] = useState<Match[]>([]);

  const getAllMatches = async () => {
    if (db) {
      await GetAllSinglesMatches(db)
      .then((allSinglesMatches: Match[]) => {
        if (allSinglesMatches && allSinglesMatches.length > 0) setRecentSinglesMatches([...allSinglesMatches]);
        else setRecentSinglesMatches([]);
      })
      .catch((error: any) => {
        showErrorToast();
      });

      await GetAllDoublesMatches(db)
      .then((allDoublesMatches: Match[]) => {
        if (allDoublesMatches && allDoublesMatches.length > 0) setRecentDoublesMatches([...allDoublesMatches]);
        else setRecentDoublesMatches([]);
      })
      .catch((error: any) => {
        showErrorToast();
      });
    }
    else {
      showErrorToast();
    }
  };

  // useEffect
  useEffect(() => {
    if (isFocused) getAllMatches();
  }, [isFocused]);

  return (
    <ThemedView style={[Containers.screen, { paddingBottom: 0 }]}>
      <ScreenTitle
        title="Matches"
        actionBtn={{
          title: "Add",
          icon: "plus",
          iconPosition: "left",
          onActionBtn: () => {}
        }}
      />
      
      <ThemedText style={[Text.title.section, { marginBottom: 8 }]}>Most Recent</ThemedText>
      {
        (recentDoublesMatches.length > 0) ? 
        <Tab.Navigator
          screenOptions={{
            swipeEnabled: false,
            tabBarIndicatorContainerStyle: { zIndex: 5 },
            tabBarIndicatorStyle: { backgroundColor: tabIndicatorColor },
            tabBarItemStyle: { backgroundColor: tabBackgroundColor },
            tabBarLabelStyle: Text.topTabLabel as TextStyle,
          }}
        >
          <Tab.Screen name="Singles" children={() => {
            return (
              <ScrollView style={{ backgroundColor: tabBackgroundColor, flex: 1 }}>
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
            )
          }} />
          <Tab.Screen name="Doubles" children={() => {
            return (
              <ScrollView style={{ backgroundColor: tabBackgroundColor, flex: 1 }}>
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
            )
          }} />
        </Tab.Navigator>
        : null
      }
      {
        
      }
    </ThemedView>
  );
}