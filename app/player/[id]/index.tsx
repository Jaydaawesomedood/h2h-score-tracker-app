import { Href, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { Dispatch, Fragment, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Image, ImageBackground, StatusBar, View, StyleSheet, TouchableWithoutFeedback } from "react-native";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { DurationTab } from "@/components/inputs/DurationTabPicker";
import H2HPicker from "@/components/inputs/H2HPicker";
import ThemedDropdown from "@/components/inputs/ThemedDropdown";
import PlayerStatsPartnerModal from "@/components/modals/PlayerStatsPartnerModal";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import ThemedTabView from "@/components/tab-view/ThemedTabView";
import MatchSummaryCard from "@/components/views/matches/MatchSummaryCard";
import PlayerProfileCard from "@/components/views/players/PlayerProfileCard";
import ThemedBannerView from "@/components/views/ThemedBannerView";
import { ThemedBarPercentageView } from "@/components/views/ThemedBarPercentageView";

import { PlayerBanner } from "@/constants/styles/Containers";
import { bold, extraLarge, extraSmall, large, light, mainContent, medium, regular, TextStyles, title } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Match } from "@/models/Match";
import { Player, Team } from "@/models/Player";
import { PlayerMatchSummary, Stats, StatsByCategory, StatsByPartner } from "@/models/Stats";
import { GetUniqueCategoriesFromMatches, GetCategoryFullName } from "@/utils/categories.util";
import { DbContext, useProfileStore, useThemeStore } from "@/utils/context";
import { GetPlayerStatsByCategory, GetPlayerOverallStats, GetPlayerStatsByPartner, GetH2HStatsById, GetToughestOpponentsByH2H } from "@/utils/scores.util";
import { showErrorToast } from "@/utils/toast.util";
import { GetWinRate, SortMatchesByDate } from "@/utils/common/common.util";
import { GetAllMatchesByPlayer, GetPlayer } from "@/utils/database/database";

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams();
  const { profile, setProfile, clearProfile } = useProfileStore();
  const { isLightMode } = useThemeStore();

  const db = useContext(DbContext);

  const [statsTabDropdownValue, setStatsTabDropdownValue] = useState<string>("overall");
  const [isStatsTabDropdownOpen, setIsStatsTabDropdownOpen] = useState<boolean>(false);
  const [statsTabDuration, setStatsTabDuration] = useState<string>("all time");

  const [h2hTabDuration, setH2hTabDuration] = useState<string>("all time");

  // H2H
  const [partner, setPartner] = useState<StatsByPartner | undefined>();
  const [opponent, setOpponent] = useState<Player | Team | undefined>();

  // Modal
  const [isViewAllPartnersModalOpen, setIsViewAllPartnersModalOpen] = useState<boolean>(false);
  
  const getPlayer = async () => {
    if (db) {
      try {
        const player = await GetPlayer(db, String(id));

        // TODO - Maybe we can get lite version of matches instead of all the data in a match
        // Get all matches by player & sort by date in descending order
        let matches = await GetAllMatchesByPlayer(db, String(id));
        matches = SortMatchesByDate(matches);

        if (player && matches) setProfile({ ...profile, matches, player});
        else showErrorToast();
      }
      catch (error: any) {
        showErrorToast();
      }
    }
  };

  // TODO - Maybe can merge this with overall stats into one single object
  const matchSummary = useMemo(() => {
    let summary = {
      overall: {
        total: 0,
        won: 0,
        winRate: ""
      },
      categories: GetUniqueCategoriesFromMatches(profile?.matches).map((category: string) => {
        return {
          category: category,
          stats: GetPlayerStatsByCategory(category, profile?.matches, id as string),
        } as StatsByCategory;
      })
    };

    summary.overall.total = summary.categories.reduce((accumulator, currentValue) => accumulator + currentValue.stats.total, 0);
    summary.overall.won = summary.categories.reduce((accumulator, currentValue) => accumulator + currentValue.stats.won, 0);
    summary.overall.winRate = GetWinRate(summary.overall.total, summary.overall.won);

    return summary as PlayerMatchSummary;
  }, [profile.matches]);

  const overallStats = useMemo(() => {
    if (profile.matches) {
      const overall = GetPlayerOverallStats(profile.matches, id as string, statsTabDropdownValue, statsTabDuration);
      let total, won;

      if (statsTabDropdownValue === "overall" && statsTabDuration === "all time") {
        total = matchSummary.overall.total;
        won = matchSummary.overall.won;
      }
      else {
        if (statsTabDropdownValue !== "overall" && statsTabDuration === "all time") {
          const category = matchSummary.categories.find((stat: StatsByCategory) => stat.category.toLowerCase() === statsTabDropdownValue.toLowerCase());
          total = category?.stats.total;
          won = category?.stats.won;
        }
        else if (statsTabDropdownValue !== "overall" && statsTabDuration === "this year") {
          total = overall.totalGames;
          won = overall.gamesWon;
        }
        else if (statsTabDropdownValue === "overall" && statsTabDuration === "this year") {
          // TODO - rethink this implementation
          const arr = GetUniqueCategoriesFromMatches(profile?.matches).map((category: string) => GetPlayerStatsByCategory(category, profile?.matches, id as string, true));
          total = arr.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
          won = arr.reduce((accumulator, currentValue) => accumulator + currentValue.won, 0);
        }
        else {
          total = matchSummary.overall.total;
          won = matchSummary.overall.won;
        }
      }

      return {
        games: {
          total,
          won,
          sets: overall.totalSets,
          tournaments: overall.tournamentsPlayed,
          casualGames: overall.casualGamesPlayed,
        },
        partners: GetPlayerStatsByPartner(profile.matches, id as string, statsTabDropdownValue, statsTabDuration),
      }
    }
    return;
  }, [profile.matches, statsTabDropdownValue, statsTabDuration]);

  const h2hStats = useMemo(() => {
    if (profile.matches) {
      const h2h = GetH2HStatsById(profile.matches, partner ? partner.id : id as string, h2hTabDuration === "this year");

      return {
        partners: GetPlayerStatsByPartner(profile.matches, id as string, "overall"),
        h2h,
        toughestOpponents: GetToughestOpponentsByH2H(h2h),
      }
    }

    return;
  }, [profile.matches, partner, h2hTabDuration]);

  const onEdit = () => {
    router.push(`player/${id}/edit` as Href);
  };

  useEffect(() => {
    if (opponent) setH2hTabDuration("all time");
  }, [opponent]);

  useFocusEffect(
    useCallback(() => {
      if (Object.keys(profile).length === 0) getPlayer();
    }, [])
  );

  useEffect(() => clearProfile, []);

  const renderPlayerBanner = useCallback(() => {
    const player = profile?.player;
    const flexDirection = player?.lastNameFirst ? "column-reverse": "column";
    const imageSize: number = 72;
    const backgroundColor = isLightMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.85)";

    return (
      <ImageBackground
        source={isLightMode ? require("../../../assets/images/player-banner-light.jpg") : require("../../../assets/images/player-banner-dark.jpg")}
        resizeMode="cover"
        style={[PlayerBanner.bannerContainer]}
      >
        <View style={[PlayerBanner.innerBannerContainer, { backgroundColor }]}>
          <View style={PlayerBanner.screenTitleContainer}>
            <ScreenTitleWithBack
              title=""
              actionBtn={{
                title: "Edit",
                onPress: onEdit
              }}
              style={{ backgroundColor: "transparent" }}
            />
          </View>
          <View style={PlayerBanner.bannerContentContainer}>
            <Image
              source={require('../../../assets/images/default-avatar.png')}
              style={{ borderRadius: imageSize, height: imageSize, width: imageSize }}
            />
            <View style={[PlayerBanner.titleContainer, { flexDirection }]}>
              <ThemedText numberOfLines={1} style={text.playerDetailsTitle}>{player?.firstName}</ThemedText>
              <ThemedText numberOfLines={1} style={text.playerDetailsTitleBold}>{player?.lastName}</ThemedText>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }, [profile.player]);

  const renderOverviewTab = () => (
    <OverviewTab
      matchSummary={matchSummary}
      mostRecentMatch={profile.matches[0]}
    />
  );

  const renderStatsTab = () => (
    <StatsTab
      isDropdownOpen={isStatsTabDropdownOpen}
      setIsDropdownOpen={setIsStatsTabDropdownOpen}
      dropdownValue={statsTabDropdownValue}
      setDropdownValue={setStatsTabDropdownValue}
      duration={statsTabDuration}
      setDuration={setStatsTabDuration}
      setIsModalOpen={setIsViewAllPartnersModalOpen}
      categories={GetUniqueCategoriesFromMatches(profile!.matches)}
      stats={overallStats}
    />
  );

  const renderH2hTab = () => {
    return (
      <H2HTab
        player={profile.player}
        stats={h2hStats}
        partner={partner}
        opponent={opponent}
        setPartner={setPartner}
        setOpponent={setOpponent}
        duration={h2hTabDuration}
        setDuration={setH2hTabDuration}
      />
    );
  };
  
  return (
    <ThemedView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"}/>
      {
        profile.player && overallStats && overallStats.partners &&
        <>
          <PlayerStatsPartnerModal partners={overallStats.partners} isOpen={isViewAllPartnersModalOpen} onClose={() => setIsViewAllPartnersModalOpen(false)} />
          <ThemedBannerView headerImage={profile ? renderPlayerBanner() : null}>
            <ThemedView style={profile.matches?.length === 0 && { flex: 1, alignItems: "center", justifyContent: "center" }}>
              {
                (profile.matches && profile.matches.length > 0) ?
                <ThemedTabView
                  tabs={[
                    { label: "Overview", screen: renderOverviewTab() },
                    { label: "Stats", screen: renderStatsTab() },
                    { label: "H2H", screen: renderH2hTab() }
                  ]}
                />
                :
                <ThemedText style={[text.subtitle, { fontSize: medium, lineHeight: medium }]}>No data found for this player</ThemedText>
              }
            </ThemedView>
          </ThemedBannerView>
        </>
      }
    </ThemedView>
  );
};

type MatchesWinRateSummaryCardProps = {
  isMain?: boolean;
  stats: Stats;
};

// TODO - Move this somewhere, might be used in teams page
function MatchesWinRateSummaryCard({ isMain = false, stats }: MatchesWinRateSummaryCardProps) {
  const backgroundColor = useThemeColor("cardBody");
  const mainBackgroundColor = useThemeColor("cardHeader");
  const mainDividerColor = useThemeColor("white");

  return (
    <View style={[styles.winRateSummaryCardContainer, !isMain && { borderWidth: 2, borderColor: backgroundColor }]}>
      {
        isMain ?
        <View style={[styles.winRateSummaryCardSection, { backgroundColor: mainBackgroundColor }, styles.winRateSummaryCardSectionMain]}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <ThemedText style={[text.title, { fontSize: mainContent, lineHeight: mainContent }]}>{stats.total}</ThemedText>
            <ThemedText style={text.subtitle}>Games</ThemedText>
          </View>
          <View style={{ backgroundColor: mainDividerColor, width: 1, height: "100%", opacity: 0.3 }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <ThemedText style={[text.title, { fontSize: mainContent, lineHeight: mainContent }]}>{stats.won}</ThemedText>
            <ThemedText style={text.subtitle}>Won</ThemedText>
          </View>
        </View>
        :
        <View style={[styles.winRateSummaryCardSection, { backgroundColor }]}>
          <ThemedText style={text.title}>{`${stats.won}/${stats.total}`}</ThemedText>
          <ThemedText style={text.subtitle}>Games Won</ThemedText>
        </View>
      }
      <View style={[styles.winRateSummaryCardSection, isMain && { backgroundColor }]}>
        <ThemedText style={[text.title, isMain && { fontSize: mainContent, lineHeight: mainContent }]}>{`${stats.winRate}%`}</ThemedText>
        <ThemedText style={text.subtitle}>Win Rate</ThemedText>
      </View>
    </View>
  );
};

type OverviewTabProps = {
  matchSummary: PlayerMatchSummary;
  mostRecentMatch: Match;
};

function OverviewTab({ matchSummary, mostRecentMatch }: OverviewTabProps) {
  return (
    <View style={styles.tabScreen}>
      <ThemedText style={text.section}>SUMMARY</ThemedText>
      <MatchesWinRateSummaryCard
        isMain={true}
        stats={{
          total: matchSummary.overall.total ?? 0,
          won: matchSummary.overall.won ?? 0,
          winRate: GetWinRate(matchSummary.overall.total ?? 0, matchSummary.overall.won ?? 0)
        }}
      />
      {
        matchSummary.categories.map((category, index) => (
          <View key={`player-overview-stats-${index}`} style={{ rowGap: 16 }}>
            <ThemedText>{GetCategoryFullName(category.category)}</ThemedText>
            <MatchesWinRateSummaryCard stats={category.stats} />
          </View>

        ))
      }
      <ThemedText style={text.section}>RECENT MATCH</ThemedText>
      <MatchSummaryCard match={mostRecentMatch} mode={mostRecentMatch.category.endsWith("d") ? "doubles" : "singles"} />
    </View>
  );
};

type StatsTabProps = {
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  dropdownValue: string;
  setDropdownValue: Dispatch<SetStateAction<string>>;
  duration: string;
  setDuration: Dispatch<SetStateAction<string>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  categories: string[];
  stats: any;
};

function StatsTab({
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownValue,
  setDropdownValue,
  duration,
  setDuration,
  setIsModalOpen,
  categories,
  stats
}: StatsTabProps) {
  const grey = useThemeColor("grey");

  return (
    <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
      <View style={styles.tabScreen}>
        {/* TODO - Find ways to sort the categories */}
        <ThemedDropdown
          options={
            [{ label: "Overall", value: "overall" }]
            .concat(
              categories.map((category: string) => ({
                label: GetCategoryFullName(category),
                value: category
              }))
            )
          }
          placeholder="Category"
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
          value={dropdownValue}
          setValue={setDropdownValue}
          label="Category"
          labelStyle={TextStyles.controls.input.label}
        />
        <DurationTab duration={duration} setDuration={setDuration} />
        {
          stats && stats.games && stats.games.total > 0 ?
          <Fragment>
            <View>
              <ThemedText style={[text.section, { marginTop: 0, marginBottom: 8 }]}>MATCHES</ThemedText>
                <View style={{ rowGap: 16, borderWidth: 2, borderColor: grey, borderRadius: 8, padding: 24 }}>
                  <View style={{ paddingBottom: 16 }}>
                    <ThemedBarPercentageView values={[stats.games.won, stats.games.total - stats.games.won]} subtitle={["Won", "Lost"]} />
                  </View>
                  {/* TODO - Loop this */}
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <ThemedText>Total Games</ThemedText>
                    <ThemedText style={{ fontFamily: bold }}>{stats.games.total}</ThemedText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <ThemedText>Win Rate</ThemedText>
                    <ThemedText style={{ fontFamily: bold }}>{`${GetWinRate(stats.games.total, stats.games.won)}%`}</ThemedText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <ThemedText>Total Sets Won</ThemedText>
                    <ThemedText style={{ fontFamily: bold }}>{stats.games.sets}</ThemedText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <ThemedText>Casual Games</ThemedText>
                    <ThemedText style={{ fontFamily: bold }}>{stats.games.casualGames}</ThemedText>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <ThemedText>Tournaments</ThemedText>
                    <ThemedText style={{ fontFamily: bold }}>{stats.games.tournaments}</ThemedText>
                  </View>
                </View>
            </View>
            {
              !["ms", "ws"].includes(dropdownValue) &&
              <View>
                <ThemedText style={[text.section]}>PARTNERS</ThemedText>
                <View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 }}>
                    <View style={{ flexBasis: "65%" }}>
                      <ThemedText>Partner</ThemedText>
                    </View>
                    <View style={{ flexDirection: "row", flexBasis: "35%", justifyContent: "space-evenly" }}>
                      <ThemedText>G</ThemedText>
                      <ThemedText>W</ThemedText>
                      <ThemedText>WR</ThemedText>
                    </View>
                  </View>
                  <View style={{ width: "100%", height: 2, backgroundColor: grey }} />
                  <View style={{ rowGap: 8 }}>
                    {
                      stats && stats.partners && stats.partners.slice(0, 3).map((stat: StatsByPartner, index: number) => (
                        <View key={`player-stats-partner-${index}`} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
                            <View style={{ flexBasis: "5%" }}>
                              <ThemedText>{index + 1}</ThemedText>
                            </View>
                            <View style={{ flexBasis: "60%", overflow: "hidden" }}>
                              <PlayerProfileCard player={stat.partner} />
                            </View>
                          </View>
                          <View style={{ flexBasis: "35%", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                            <ThemedText>{stat.totalGames}</ThemedText>
                            <ThemedText>{stat.gamesWon}</ThemedText>
                            <ThemedText>{stat.winRate}</ThemedText>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                </View>
                {
                  stats && stats.partners && stats.partners.length > 3 &&
                  <View style={{ marginTop: 8, paddingVertical: 8, alignItems: "center" }}>
                    <SecondaryButton
                      title="View More"
                      onPress={() => setIsModalOpen(true)}
                    />
                  </View>
                }
              </View>
            }
          </Fragment>
          :
          <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ThemedText style={TextStyles.descriptions.medium}>No data available</ThemedText>
          </ThemedView>
        }
      </View>
    </TouchableWithoutFeedback>
  );
};

type H2HTabProps = {
  player: Player;
  stats: {
    partners: StatsByPartner[],
    h2h: any,
    toughestOpponents: { id: string, opponent: Player | Team, h2h: number[] }[],
  } | undefined;
  partner: StatsByPartner | undefined;
  opponent: Player | Team | undefined;
  setPartner: Dispatch<SetStateAction<StatsByPartner | undefined>>;
  setOpponent: Dispatch<SetStateAction<Player | Team | undefined>>;
  duration: string;
  setDuration: Dispatch<SetStateAction<string>>;
};

function H2HTab({
  player,
  stats,
  partner,
  opponent,
  setPartner,
  setOpponent,
  duration,
  setDuration,
}: H2HTabProps) {
  return (
    <ThemedView
      style={styles.tabScreen}
      // TODO - For future implementation of clamping tabview
      // onLayout={
      //   (event) => {
      //     event.target.measure((_x, _y, _width, height, _pageX, pageY) => {
      //       console.log(pageY, height);
      //     })
      //   }
      // }
    >
      {
        stats &&
        stats.h2h &&
        <H2HPicker
          player={player}
          partners={stats.partners}
          opponents={Object.values(stats.h2h)}
          partner={partner}
          setPartner={setPartner}
          opponent={opponent}
          setOpponent={setOpponent}
          toughestOpponents={stats.toughestOpponents}
        />
      }
      {
        // H2H (only show when an opponent is specified)
        stats && opponent &&
        <View style={{ rowGap: 16 }}>
          <DurationTab duration={duration} setDuration={setDuration} />
          <ThemedText style={[text.section, { alignSelf: "center" }]}>HEAD 2 HEAD</ThemedText>
          <ThemedBarPercentageView values={stats.h2h[opponent.id]!.h2h} />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <ThemedText style={[text.h2hStats, { flexBasis: "20%" }]}>{`${GetWinRate(stats.h2h[opponent.id]!.h2h.reduce((acc: number, curr: number) => acc + curr, 0), stats.h2h[opponent.id]!.h2h[0])}%`}</ThemedText>
            <ThemedText style={[{ flexBasis: "60%", fontFamily: bold, textAlign: "center" }, text.h2hStats]}>Win Rate</ThemedText>
            <ThemedText style={[text.h2hStats, { flexBasis: "20%", textAlign: "right" }]}>{`${GetWinRate(stats.h2h[opponent.id]!.h2h.reduce((acc: number, curr: number) => acc + curr, 0), stats.h2h[opponent.id]!.h2h[1])}%`}</ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ThemedText style={[text.h2hStats, { flexBasis: "20%" }]}>{stats.h2h[opponent.id].sets[0]}</ThemedText>
            <ThemedText style={[{ flex: 1, fontFamily: bold, textAlign: "center" }, text.h2hStats]}>Sets</ThemedText>
            <ThemedText style={[text.h2hStats, { flexBasis: "20%", textAlign: "right" }]}>{stats.h2h[opponent.id].sets[1]}</ThemedText>
          </View>
          <ThemedText style={[text.section]}>RECENT ENCOUNTER</ThemedText>
          <MatchSummaryCard match={stats.h2h[opponent.id]!.recentMatch} mode={partner ? "doubles" : "singles"} />
        </View>
      }
    </ThemedView>
  );
};


// TODO - segregate this style somewhere as it is used in multiple places
const styles = StyleSheet.create({
  tabScreen: {
    // flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 16,
    rowGap: 16,
  },
  durationTabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 16,
  },
  overviewMainCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 16,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  overviewMainCard: {
    flex: 1,
    alignItems: "center",
    rowGap: 8,
    paddingVertical: 16,
  },
  cardTitle: {
    fontFamily: regular,
    fontSize: medium,
  },
  winRateSummaryCardContainer: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  winRateSummaryCardSection: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    rowGap: 8,
  },
  winRateSummaryCardSectionMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

const text = StyleSheet.create({
  section: {
    fontFamily: bold,
    fontSize: medium,
    lineHeight: medium,
    letterSpacing: 0.7,
    marginTop: 16,
    paddingVertical: 8,
  },
  title: {  // Only used in Overview summary card component, will rethink implementation
    fontFamily: bold,
    fontSize: large,
    lineHeight: large,
  },
  subtitle: {
    fontFamily: light,
    fontSize: extraSmall,
    lineHeight: extraSmall,
  },
  h2hStats: {
    fontSize: medium,
    lineHeight: medium,
  },
  playerDetailsTitle: {
    fontFamily: regular,
    fontSize: title,
    lineHeight: title,
    paddingVertical: 4,
  },
  playerDetailsTitleBold: {
    fontFamily: bold,
    fontSize: extraLarge,
    lineHeight: extraLarge,
    paddingVertical: 4,
  },
});