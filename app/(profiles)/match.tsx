import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { PlayerBanner } from "@/constants/styles/Containers";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useMemo } from "react";
import { ImageBackground, Image, StatusBar, View, StyleSheet } from "react-native";
import { showErrorToast } from "@/utils/toast.util";
import { GetAllMatchesByPlayer, GetAllMatchesByTeam, GetAllMatchesOfSamePairs, GetDoublesMatch, GetSinglesMatch } from "@/utils/database/database";
import { Player, Team } from "@/models/Player";
import { bold, large, light, medium, regular } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateWinner, getH2HLite, getHigherScore, GetPlayerStatsByCategory, GetTeamStats, getTotalPointsByH2H, getTotalScoreByMatch, getTotalSetsByH2HLite, getTotalSetsByMatch } from "@/utils/scores.util";
import { DbContext, useProfileStore } from "@/utils/context";
import ThemedBannerView from "@/components/views/ThemedBannerView";
import { ThemedTabView } from "@/components/tab-view/ThemedTabView";
import PlayerName from "@/components/text/PlayerName";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemedBarPercentageView } from "@/components/views/ThemedBarPercentageView";
import { GetCategoryFullName, GetUniqueCategoriesFromAllMatches, GetWinRate } from "@/utils/common/common.util";

type PlayerProfileProps = {
  player: Player;
  isWinner: boolean;
};

export default function MatchProfileScreen() {  
  // Styling
  const color = useThemeColor("primary");
  const cardBody = useThemeColor("cardBody");
  const grey = useThemeColor("grey");
  
  // Context
  const { id } = useLocalSearchParams();
  const db = useContext(DbContext);

  const { profile, setProfile, clearProfile } = useProfileStore();

  const GetMatch = async (category: "singles" | "doubles") => {
    if (category === "singles") {
      const match = await GetSinglesMatch(db!, String(id));
      const h2h = await GetAllMatchesOfSamePairs(db!, [match.teams[0].id, match.teams[1].id], category);

      const allMatchesForPlayer1 = await GetAllMatchesByPlayer(db!, match.teams[0].id);
      const allMatchesForPlayer2 = await GetAllMatchesByPlayer(db!, match.teams[1].id);

      // Getting the overall win rate for both players
      const overallStatsForPlayer1 = GetUniqueCategoriesFromAllMatches(allMatchesForPlayer1).map((category: string) => GetPlayerStatsByCategory(category, allMatchesForPlayer1, match.teams[0].id));
      const player1Total = overallStatsForPlayer1.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
      const player1Won = overallStatsForPlayer1.reduce((accumulator, currentValue) => accumulator + currentValue.won, 0);
      
      const overallStatsForPlayer2 = GetUniqueCategoriesFromAllMatches(allMatchesForPlayer2).map((category: string) => GetPlayerStatsByCategory(category, allMatchesForPlayer2, match.teams[1].id));
      const player2Total = overallStatsForPlayer2.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
      const player2Won = overallStatsForPlayer2.reduce((accumulator, currentValue) => accumulator + currentValue.won, 0);

      const overallWinRate = [GetWinRate(player1Total, player1Won), GetWinRate(player2Total, player2Won)];
      
      setProfile({ match, h2h, overallWinRate });
    }
    else if (category === "doubles") {
      const match = await GetDoublesMatch(db!, String(id));
      const h2h = await GetAllMatchesOfSamePairs(db!, [match.teams[0].id, match.teams[1].id], category);

      const allMatchesForTeam1 = await GetAllMatchesByTeam(db!, match.teams[0].id);
      const allMatchesForTeam2 = await GetAllMatchesByTeam(db!, match.teams[1].id);

      const team1Stats = GetTeamStats(allMatchesForTeam1, match.teams[0].id);
      const team2Stats = GetTeamStats(allMatchesForTeam2, match.teams[1].id);

      const overallWinRate = [GetWinRate(team1Stats.totalGames, team1Stats.gamesWon), GetWinRate(team2Stats.totalGames, team2Stats.gamesWon)];
      
      setProfile({ match, h2h, overallWinRate });
    }
  };


  const h2hStats = useMemo(() => {
    if (profile.h2h) {
      const h2h = getH2HLite(profile.h2h, [profile.match.teams[0].id, profile.match.teams[1].id]);
      const totalMatchesInH2H = h2h.reduce((acc, curr) => acc + curr, 0);

      return {
        h2h,
        winRate: {
          h2h: [GetWinRate(totalMatchesInH2H, h2h[0]), GetWinRate(totalMatchesInH2H, h2h[1])],
          overall: profile.overallWinRate,
        },
        sets: getTotalSetsByH2HLite(profile.h2h, [profile.match.teams[0].id, profile.match.teams[1].id]),
        points: getTotalPointsByH2H(profile.h2h, [profile.match.teams[0].id, profile.match.teams[1].id])
      };
    }

    return;
  }, [profile.h2h]);

  // Button actions
  const onEditMatch = () => {
    if (profile) {
      router.push({
        pathname: "/(edit)/edit-match",
        params: {
          id: profile.match!.id,
          category: profile.match!.category,
          mode: profile.match!.mode,
          datetime: profile.match!.datetime
        } // TODO - Send id only
      });
    }
  };

  // useEffect
  useEffect(() => {
    if (db) GetMatch(String(id).startsWith("dm") ? "doubles" : "singles");
    else showErrorToast();

    return clearProfile;
  }, []);
  
  const renderMatchBanner = () => {
    return (
      <ImageBackground
        source={require('../../assets/images/placeholder-banner-1.jpg')}
        resizeMode="cover"
        style={[PlayerBanner.bannerContainer]}
      >
        <View style={PlayerBanner.innerBannerContainer}>
          <View style={PlayerBanner.screenTitleContainer}>
            <ScreenTitleWithBack
              title=""
              actionBtn={{
                title: "Edit",
                onPress: onEditMatch
              }}
              style={{ backgroundColor: "transparent" }}
            />
          </View>
          {
            (profile && profile.match) &&
            <View style={[PlayerBanner.bannerContentContainer, { justifyContent: "center" }]}>
              <View style={{rowGap: 24}}>
                {
                  String(id).startsWith("dm") ?
                    (profile.match.teams[0] as Team).players.map((player: Player) => (
                      <PlayerProfile key={player.id} player={player} isWinner={calculateWinner(profile.match) === profile.match?.teams[0].id} />
                    ))
                  :
                  <PlayerProfile player={profile.match?.teams[0] as Player} isWinner={calculateWinner(profile.match) === profile.match?.teams[0].id} />
                }
              </View>
              <View>
                {
                  profile.match.score.map((set: Number[], setIndex: number) => (
                    <View key={`${profile?.match?.id}-${setIndex}-view`} style={[{ flexDirection: "row" }]}>
                      {
                        set.map((score: Number, index: number) => (
                          <View key={`${profile?.match?.id}-${setIndex}-${index}`} style={[{ flexDirection: "row", alignItems: "center" }]}>
                            <ThemedText
                              style={[
                                index === getHigherScore(set) ? { color, fontFamily: bold } : {},
                                { fontSize: large }
                              ]}
                            >
                              {score.toString()}
                            </ThemedText>
                            {
                              index === 0 && <ThemedText> - </ThemedText>
                            }
                          </View>
                        ))
                      }
                    </View>
                  ))
                }
              </View>
              <View style={{rowGap: 24}}>
              {
                String(id).startsWith("dm") ?
                  (profile.match?.teams[1] as Team).players.map((player: Player) => (
                    <PlayerProfile key={player.id} player={player} isWinner={calculateWinner(profile.match) === profile.match?.teams[1].id} />
                  ))
                :
                <PlayerProfile player={profile.match?.teams[1] as Player} isWinner={calculateWinner(profile.match) === profile.match?.teams[1].id} />
              }
              </View>
            </View>
          }
        </View>
      </ImageBackground>
    );
  };

  // TODO - move tab out 
  const renderMatchDetailsTab = () => {
    const getPercentage = () => {
      if (profile) {
        const value = getTotalScoreByMatch(profile.match.score);
        const total = value.reduce((acc, curr) => acc + curr, 0);

        return [
          `(${GetWinRate(total, value[0])}%)`,
          `(${GetWinRate(total, value[1])}%)`
        ];
      }

      return ["-", "-"]
    };

    return (
      <>
        {
          profile && profile.match &&
          <ThemedView style={styles.tabScreen}>
            <ThemedText style={text.section}>STATS</ThemedText>
            <View style={{ rowGap: 24 }}>
              <View style={{ rowGap: 8 }}>
                <ThemedText style={{ alignSelf: "center" }}>Sets Won</ThemedText>
                <ThemedBarPercentageView values={getTotalSetsByMatch(profile.match.score)} />
              </View>
              <View style={{ rowGap: 8 }}>
                <ThemedText style={{ alignSelf: "center" }}>Points Obtained</ThemedText>
                <ThemedBarPercentageView
                  values={getTotalScoreByMatch(profile.match.score)}
                  subtitle={getPercentage()}
                />
              </View>
            </View>
            
            <View style={{ rowGap: 16 }}>
              <ThemedText style={text.section}>MATCH INFO</ThemedText>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, columnGap: 16 }}>
                <View style={[styles.matchInfoPanel, { backgroundColor: cardBody, flex: 1 }]}>
                  <View style={{ flexDirection: "row", columnGap: 8 }}>
                    <FontAwesome5 name="user-friends" size={24} color={grey} />
                    <ThemedText style={{ fontFamily: light, opacity: 0.6 }}>Category</ThemedText>
                  </View>
                  <ThemedText style={{ fontFamily: bold, fontSize: medium }}>{GetCategoryFullName(profile.match.category)}</ThemedText>
                </View>
                <View style={[styles.matchInfoPanel, { backgroundColor: cardBody, flex: 1 }]}>
                  <View style={{ flexDirection: "row", columnGap: 8 }}>
                    <FontAwesome5 name="calendar" size={24} color={grey} />
                    <ThemedText style={{ fontFamily: light, opacity: 0.6 }}>Date</ThemedText>
                  </View>
                  <ThemedText style={{ fontFamily: bold, fontSize: medium }}>{profile.match.datetime}</ThemedText>
                </View>
              </View>
              <View style={[styles.matchInfoPanel, { backgroundColor: cardBody, flexDirection: "row", justifyContent: "flex-start", columnGap: 16 }]}>
                <FontAwesome5 name="trophy" size={24} color={grey} />
                <ThemedText style={{ fontSize: medium, lineHeight: medium, textTransform: "capitalize" }}>{profile.match.mode === "tournament" ? "tournament" : "casual game" }</ThemedText>
              </View>
            </View>
          </ThemedView>
        }
      </>
    );
  };

  // TODO - move tab out
  const renderH2HTab = () => {
    return (
      <ThemedView style={styles.tabScreen}>
      {
        h2hStats &&
        <>
          <View style={[styles.matchInfoPanel, { backgroundColor: cardBody }]}>
            <ThemedBarPercentageView 
              values={h2hStats.h2h}
              customBackgroundColor="#E9B14A" // TODO - usethemecolor instead
            />
            <ThemedText>Win Rate</ThemedText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemedText style={{ flex: 1, textAlign: "left" }}>{`${h2hStats.winRate.h2h[0]}%`}</ThemedText>
              <ThemedText style={{ fontFamily: bold, flex: 1, textAlign: "center" }}>H2H</ThemedText>
              <ThemedText style={{ flex: 1, textAlign: "right" }}>{`${h2hStats.winRate.h2h[1]}%`}</ThemedText>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <ThemedText style={{ flex: 1, textAlign: "left" }}>{`${h2hStats.winRate.overall[0]}%`}</ThemedText>
              <ThemedText style={{ fontFamily: bold, flex: 1, textAlign: "center" }}>Overall</ThemedText>
              <ThemedText style={{ flex: 1, textAlign: "right" }}>{`${h2hStats.winRate.overall[1]}%`}</ThemedText>
            </View>
          </View>

          <View style={{ rowGap: 24 }}>
            <View style={{ rowGap: 8 }}>
              <ThemedText style={{ alignSelf: "center" }}>Total Sets</ThemedText>
              <ThemedBarPercentageView values={h2hStats.sets} />
            </View>
            <View style={{ rowGap: 8 }}>
              <ThemedText style={{ alignSelf: "center" }}>Total Points</ThemedText>
              <ThemedBarPercentageView values={h2hStats.points} />
            </View>
          </View>
        </>
      }
      </ThemedView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"}/>
      {
        profile && profile.match &&
        <ThemedBannerView headerImage={renderMatchBanner()}>
            <ThemedTabView
              tabs={[
                {
                  label: "Match",
                  screen: renderMatchDetailsTab()
                },
                {
                  label: "H2H",
                  screen: renderH2HTab()
                }
              ]}
            />
        </ThemedBannerView>
        }
    </View>
  );
};

function PlayerProfile({ player, isWinner }: PlayerProfileProps) {
  const borderColor = isWinner ? useThemeColor("winningTeamBorder") : "rgba(61, 61, 61, 0.5)" ;
  const borderWidth = 3;
  const opacity = isWinner ? 1 : 0.7;
  const imageSize: number = 72;

  return (
    // TODO - Change this to PlayerProfileCard
    <View style={{
      alignItems: "center",
      minWidth: 150,
      maxWidth: 150 
    }}>
      <View style={{
        borderColor,
        borderWidth,
        borderRadius: imageSize,
        height: imageSize,
        opacity,
        overflow: "hidden",
        marginBottom: 16,
        width: imageSize,
      }}>
        <Image
          source={require('../../assets/images/placeholder-avatar.png')}
          style={{ height: "100%", width: "100%" }}
        />
      </View>
      <PlayerName player={player} isVertical={true} textStyle={{ fontSize: medium, opacity }} />
    </View>
  );
};

// TODO - Standardize this somewhere else as styles are common across app
const styles = StyleSheet.create({
  tabScreen: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 16,
    rowGap: 16,
  },
  cardTitle: {
    fontFamily: regular,
    fontSize: medium,
  },
  matchInfoPanel: {
    borderRadius: 8,
    padding: 16,
    rowGap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

const text = StyleSheet.create({
  section: {
    fontFamily: bold,
    fontSize: medium,
    lineHeight: medium,
    letterSpacing: 0.7,
    marginTop: 16,
    // paddingVertical: 8,
  },
});