import { Href, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Dispatch, Fragment, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ImageBackground, Image, View, StatusBar, StyleSheet } from "react-native";

import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { DurationTab } from "@/components/inputs/DurationTabPicker";
import H2HPicker from "@/components/inputs/H2HPicker";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import ThemedTabView from "@/components/tab-view/ThemedTabView";
import PlayerName from "@/components/text/PlayerName";
import ThemedBannerView from "@/components/views/ThemedBannerView";
import { ThemedBarPercentageView } from "@/components/views/ThemedBarPercentageView";
import MatchSummaryCard from "@/components/views/matches/MatchSummaryCard";

import { PlayerBanner } from "@/constants/styles/Containers";
import { bold, extraSmall, large, light, medium, regular, TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Match } from "@/models/Match";
import { Player, Team } from "@/models/Player";
import { DbContext, useProfileStore, useThemeStore } from "@/utils/context";
import { GetH2HStatsById, GetTeamStats, GetToughestOpponentsByH2H } from "@/utils/scores.util";
import { showErrorToast } from "@/utils/toast.util";
import { GetWinRate, SortMatchesByDate } from "@/utils/common/common.util";
import { GetAllMatchesByTeam, GetTeam } from "@/utils/database/database";

export default function TeamProfileScreen() {
  // Context
  const { id } = useLocalSearchParams();
  const db = useContext(DbContext);
  const { profile, setProfile, clearProfile } = useProfileStore();
  const { isLightMode } = useThemeStore();

  // State
  const [statsTabDuration, setStatsTabDuration] = useState<string>("all time");
  const [h2hTabDuration, setH2HTabDuration] = useState<string>("all time");

  const [opponent, setOpponent] = useState<Team | undefined>();

  // Button actions
  const onEditTeam = () => { router.push(`team/${id}/edit` as Href)};

  // DB actions
  const getTeam = async () => {
    if (db) {
      try {
        const team = await GetTeam(db, String(id));

        let matches = await GetAllMatchesByTeam(db, String(id));
        matches = SortMatchesByDate(matches);

        if (team) setProfile({ team, matches });
        else showErrorToast();
      }
      catch (error: any) {
        showErrorToast();
      }
    }
  };

  const overallStats = useMemo(() => {
    if (profile.matches) {
      const stats = GetTeamStats(profile.matches, id as string, statsTabDuration);

      return {
        games: {
          total: stats.totalGames,
          won: stats.gamesWon,
          sets: stats.totalSets,
          tournaments: stats.tournamentsPlayed,
          casualGames: stats.casualGamesPlayed,
        },
      }
    }

    return;
  }, [profile.matches, statsTabDuration]);

  const h2hStats = useMemo(() => {
    if (profile.matches) {
      const h2h = GetH2HStatsById(profile.matches, id as string, h2hTabDuration === "this year");

      return {
        h2h,
        toughestOpponents: GetToughestOpponentsByH2H(h2h),
      }
    }

    return;
  }, [profile.matches, h2hTabDuration]);

  const renderStatsTab = () => (
    <StatsTab
      duration={statsTabDuration}
      setDuration={setStatsTabDuration}
      stats={overallStats}
      recentMatch={profile.matches[0]}
    />
  );

  const renderH2HTab = () => (
    <H2HTab
      team={profile.team}
      stats={h2hStats}
      duration={h2hTabDuration}
      setDuration={setH2HTabDuration}
      opponent={opponent}
      setOpponent={setOpponent}
    />
  );

  // useEffect
  useFocusEffect(
    useCallback(() => {
      if (Object.keys(profile).length === 0) {
        if (db) getTeam();
        else showErrorToast();
      }
    }, [])
  );

  useEffect(() => clearProfile, []);

  const renderTeamBanner = useCallback(() => {
    const imageSize: number = 72;
    const backgroundColor = isLightMode ? "rgba(225, 225, 225, 0.6)" : "rgba(0, 0, 0, 0.85)";

    return (
      <ImageBackground
        source={isLightMode ? require("../../../assets/images/team-banner-light.jpg") : require("../../../assets/images/team-banner-dark.jpg")}
        resizeMode="cover"
        style={[PlayerBanner.bannerContainer]}
      >
        <View style={[PlayerBanner.innerBannerContainer, { backgroundColor }]}>
          <View style={PlayerBanner.screenTitleContainer}>
            <ScreenTitleWithBack
              title=""
              actionBtn={{
                title: "Edit",
                onPress: onEditTeam
              }}
              style={{ backgroundColor: "transparent" }}
            />
          </View>
          {
            profile.team.name &&
            <View style={{ alignSelf: "center", paddingBottom: 24 }}>
              <ThemedText style={[text.teamPlayerDetailsTitle, { marginTop: -16 }]}>{profile.team.name}</ThemedText>
            </View>
          }
          <View style={[PlayerBanner.bannerContentContainer, { justifyContent: "space-around" }]}>
            {
              profile.team.players.map((player: Player) => (
                // TODO - Change this to PlayerProfileCard
                <View key={player.id} style={{ alignItems: "center", minWidth: 150, maxWidth: 150 }}>
                  <Image
                    source={require('../../../assets/images/default-avatar.png')}
                    style={{ borderRadius: imageSize, height: imageSize, width: imageSize, marginBottom: 16 }}
                  />
                  <PlayerName player={player} isVertical={true} textStyle={{ fontSize: large }} />
                </View>
              ))
            }
          </View>
        </View>
      </ImageBackground>
    );
  }, [profile.team]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"}/>
      {
        profile && profile.team && profile.matches &&
        <ThemedBannerView headerImage={renderTeamBanner()}>
          <ThemedView style={profile.matches?.length === 0 && { flex: 1, alignItems: "center", justifyContent: "center" }}>
          {
            profile.matches.length > 0 ?
            <ThemedTabView
              tabs={[
                {
                  label: "Stats",
                  screen: renderStatsTab()
                },
                {
                  label: "H2H",
                  screen: renderH2HTab()
                }
              ]}
            />
            :
            <ThemedText style={[text.subtitle, { fontSize: medium, lineHeight: medium }]}>No data found for this team</ThemedText>
          }
          </ThemedView>
        </ThemedBannerView>
      }
    </ThemedView>
  );
};

type StatsTabProps = {
  duration: string;
  setDuration: Dispatch<SetStateAction<string>>;
  stats: any;
  recentMatch: Match;
};

function StatsTab({
  duration,
  setDuration,
  stats,
  recentMatch,
}: StatsTabProps) {

  const grey = useThemeColor("grey");

  return (
    <View style={styles.tabScreen}>
      <Fragment>
        <DurationTab duration={duration} setDuration={setDuration} />
        {
          stats && stats.games && stats.games.total > 0 ?
          <Fragment>
            <View>
              <ThemedText style={[text.section, { marginTop: 0, marginBottom: 8 }]}>MATCHES</ThemedText>
                <Fragment>
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
                </Fragment>
            </View>
            <ThemedText style={text.section}>RECENT MATCH</ThemedText>
            <MatchSummaryCard match={recentMatch} mode="doubles" />
          </Fragment>
          :
          <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ThemedText style={TextStyles.descriptions.medium}>No data available</ThemedText>
          </ThemedView>
        }
      </Fragment>
    </View>
  );
};

type H2HTabProps = {
  team: Team;
  stats: {
    h2h: any,
    toughestOpponents: { id: string, opponent: Player | Team, h2h: number[] }[],
  } | undefined;
  duration: string;
  setDuration: Dispatch<SetStateAction<string>>;
  opponent: Team | undefined;
  setOpponent: Dispatch<SetStateAction<Team | undefined>>;
};

function H2HTab({ team, stats, duration, setDuration, opponent, setOpponent }: H2HTabProps) {
  return (
    <View style={styles.tabScreen}>
      {
        stats && stats.h2h &&
        <H2HPicker
          player={team.players[0]}
          partners={[]}
          opponents={Object.values(stats.h2h)}
          partner={{ id: team.id, partner: team.players[1], category: team.category, totalGames: 0, winRate: "0", gamesWon: 0 }}
          setPartner={() => {}}
          opponent={opponent}
          setOpponent={setOpponent}
          toughestOpponents={stats.toughestOpponents}
          opponentOnly={true}
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
          <MatchSummaryCard match={stats.h2h[opponent.id]!.recentMatch} mode="doubles" />
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  tabScreen: {
    // flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 16,
    rowGap: 16,
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
  subtitle: {
    fontFamily: light,
    fontSize: extraSmall,
    lineHeight: extraSmall,
  },
  h2hStats: {
    fontSize: medium,
    lineHeight: medium,
  },
  teamPlayerDetailsTitle: {
    fontFamily: regular,
    fontSize: large,
  },
});