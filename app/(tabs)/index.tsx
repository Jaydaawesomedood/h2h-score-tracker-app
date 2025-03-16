import { Href, useRouter } from "expo-router";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import MatchAdvancedFilterModal from "@/components/modals/MatchAdvancedFilterModal";
import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedTabView from "@/components/tab-view/ThemedTabView";
import MatchSummaryCard from "@/components/views/matches/MatchSummaryCard";

import { Containers } from "@/constants/styles/Containers";
import { small, TextStyles } from "@/constants/styles/Text";

// TODO - Move this to matches folder
import { Match } from "@/models/Match";
import { Matches } from "@/models/matches/Matches";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDataStore } from "@/utils/context";
import { FilterMatches } from "@/utils/repositories/matches.util";

export default function MatchesScreen() {
  const { matches } = useDataStore();
  const router = useRouter();

  // colors
  const filterBtnColor = useThemeColor("lightgrey");

  // State variables
  const [list, setList] = useState<Matches>(matches);

  // Filter props & methods
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterTimeframe, setFilterTimeframe] = useState<string>("all time");
  const [sortCriteria, setSortCriteria] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("ascending");

  const openFilterModal = () => setIsFilterModalOpen(true);

  const onApplyFilters = () => {
    const filteredMatches = FilterMatches(
      {
        category: filterCategory,
        mode: filterMode,
        timeframe: filterTimeframe,
        sortOrder
      },
      matches
    );

    setList({...filteredMatches});
    setIsFilterModalOpen(false);
  };

  const onResetFilters = () => {
    if (filterCategory !== "all") setFilterCategory("all");
    if (filterMode !== "all") setFilterMode("all");
    if (filterTimeframe !== "all time" )setFilterTimeframe("all time");
    if (sortOrder !== "ascending") setSortOrder("ascending");

    setList(matches);
  };

  const filtersApplied = useMemo(() => {
    let filtersApplied = 0;

    if (filterCategory !== "all") filtersApplied += 1;
    if (filterMode !== "all") filtersApplied += 1;
    if (filterTimeframe !== "all time" ) filtersApplied += 1;
    if (sortOrder !== "ascending") filtersApplied += 1;

    return filtersApplied;
  }, [filterCategory, filterMode, filterTimeframe, sortOrder]);

  // Navigation
  const onAddMatch = () => { router.push("match/add" as Href); };

  const singlesMatchesTab = useMemo(() => {
    return (
      <MatchesTab matches={list.singles} type="singles" />
    );
  }, [list]);

  const doublesMatchesTab = useMemo(() => {
    return (
      <MatchesTab matches={list.doubles} type="doubles" />
    );
  }, [list]);

  useEffect(() => { setList(matches); }, [matches]);

  return (
    <ThemedView style={[Containers.screen, { paddingBottom: 0, paddingHorizontal: 0 }]}>
      <MatchAdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={onApplyFilters}
        filters={{
          category: { value: filterCategory, setCategory: setFilterCategory },
          mode: { value: filterMode, setMode: setFilterMode },
          timeframe: { value: filterTimeframe, setTimeframe: setFilterTimeframe },
          sortCriteria: { value: sortCriteria, setSortCriteria },
          sortOrder: { value: sortOrder, setSortOrder }
        }}
      />
      <ScreenTitle
        title="Matches"
        actionBtn={{
          title: "Add",
          icon: "plus",
          iconPosition: "left",
          onActionBtn: onAddMatch
        }}
        style={{ paddingHorizontal: 32, marginBottom: 0 }}
      />
      {
        list.singles.length === 0 && list.doubles.length === 0 ?
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ThemedText style={TextStyles.descriptions.medium}>No matches recorded yet. Add one now!</ThemedText>
        </View>
        :
        <Fragment>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 32 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              {
                filtersApplied > 0 &&
                  <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
                    <View>
                      <ThemedText style={[TextStyles.descriptions.small, { color: filterBtnColor }]}>{filtersApplied} filters applied</ThemedText>
                    </View>
                    <SecondaryButton
                      title="Clear"
                      onPress={onResetFilters}
                      labelStyle={{ fontSize: small, lineHeight: small }}
                      />
                  </View>
              }
            </View>
            <View style={{ paddingTop: 16, paddingBottom: 8, alignItems: "center", justifyContent: "center" }}>
              <SecondaryButton
                title="Filter"
                icon="filter"
                iconPosition="left"
                onPress={openFilterModal}
                style={{ alignSelf: "flex-end" }}
                customColor={filterBtnColor}
                />
            </View>
          </View>
          {/* No filters applied or filters applied and both singles & doubles matches are present */}
          {
            (
              (filtersApplied === 0 && (matches.singles.length > 0 || matches.doubles.length > 0)) ||
              (filtersApplied > 0 && list.singles.length > 0 && list.doubles.length > 0)
            ) &&
            <ThemedTabView
            tabs={[
              { label: "Singles", screen: singlesMatchesTab },
              { label: "Doubles", screen: doublesMatchesTab }
            ]}
            />
          }
          
          {/* Filters applied and there are only singles matches */}
          {
            (filtersApplied > 0 && list.singles.length > 0 && list.doubles.length === 0) &&
            <View style={{ flex: 1, marginTop: 16 }}>
              <View style={{ paddingHorizontal: 32 }}>
                <ThemedText style={[TextStyles.titles.section]}>Singles</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                {singlesMatchesTab}
              </View>
            </View>
          }
          {/* Filters applied and there are only doubles matches */}
          {
            (filtersApplied > 0 && list.singles.length === 0 && list.doubles.length > 0) &&
            <View style={{ flex: 1, marginTop: 16 }}>
              <View style={{ paddingHorizontal: 32 }}>
                <ThemedText style={[TextStyles.titles.section]}>Doubles</ThemedText>
              </View>
              <View style={{ flex: 1 }}>
                {doublesMatchesTab}
              </View>
            </View>
          }
        </Fragment>
      }
    </ThemedView>
  );
};

type TabProps = {
  type: "singles" | "doubles";
  matches: Match[];
};

function MatchesTab({ type, matches }: TabProps) {
  const backgroundColor = useThemeColor('background');

  return (
    <ScrollView style={{ backgroundColor, flex: 1, paddingHorizontal: 32 }}>
      {
        matches.map((match: Match) => (
          <MatchSummaryCard key={match.id} match={match} mode={type} style={{ marginVertical: 16 }}/>
        ))
      }
    </ScrollView>
  );
};