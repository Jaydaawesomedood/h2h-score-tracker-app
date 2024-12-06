import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PlayerBanner } from "@/constants/styles/Containers";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ImageBackground, Image, StatusBar, View, StyleSheet } from "react-native";
import { showErrorToast } from "@/utils/toast.util";
import { Match } from "@/models/Match";
import { GetAllMatchesOfSamePairs, GetDoublesMatch, GetSinglesMatch } from "@/utils/database/database";
import { Player, Team } from "@/models/Player";
import { bold, large, medium, title } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateWinner, getH2H, getHigherScore, getTotalPointsByH2H, getTotalScoreByMatch, getTotalSetsByH2H, getTotalSetsByMatch } from "@/utils/scores.util";
import MatchDetailsCounterCard from "@/components/views/matches/details/MatchDetailsCounterCard";
import { DbContext } from "@/utils/context";
import ThemedBannerView from "@/components/views/ThemedBannerView";
import { ThemedTabView } from "@/components/tab-view/ThemedTabView";
import PlayerName from "@/components/text/PlayerName";

type PlayerProfileProps = {
  player: Player;
  isWinner: boolean;
};

export default function MatchProfileScreen() {  
  // Styling
  const color = useThemeColor("primary");
  
  // Context
  const { id } = useLocalSearchParams();
  const db = useContext(DbContext);
  const isFocused = useIsFocused();

  // State variables
  const [matchDetails, setMatchDetails] = useState<{ match: Match, h2h?: any }>();

  const GetMatch = async (category: "singles" | "doubles") => {
    if (category === "singles") {
      const match = await GetSinglesMatch(db!, String(id));
      const h2h = await GetAllMatchesOfSamePairs(db!, [match.teams[0].id, match.teams[1].id], category);
      setMatchDetails({ match, h2h });
    }
    else if (category === "doubles") {
      const match = await GetDoublesMatch(db!, String(id));
      const h2h = await GetAllMatchesOfSamePairs(db!, [match.teams[0].id, match.teams[1].id], category);
      setMatchDetails({ match, h2h });
    }
  };

  // Button actions
  const onEditTeam = () => {
    if (matchDetails) {
      router.push({
        pathname: "/(edit)/edit-match",
        params: { id: matchDetails.match!.id, category: matchDetails.match!.category, mode: matchDetails.match!.mode, datetime: matchDetails.match!.datetime }
      });
    }
  };

  // useEffect
  useEffect(() => {
    if (isFocused) {
      if (db) {
        GetMatch(String(id).startsWith("dm") ? "doubles" : "singles");
      }
      else {
        showErrorToast();
      }
    }
  }, [isFocused]);
  
  const renderMatchBanner = () => {
    return (
      <>
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
                  onPress: onEditTeam
                }}
                style={{ backgroundColor: "transparent" }}
              />
            </View>
            <View style={[PlayerBanner.bannerContentContainer, { justifyContent: "center" }]}>
              <View style={{rowGap: 24}}>
                {
                  (matchDetails && matchDetails.match) ?
                  String(id).startsWith("dm") ?
                    (matchDetails.match.teams[0] as Team).players.map((player: Player) => (
                      <PlayerProfile key={player.id} player={player} isWinner={calculateWinner(matchDetails.match) === matchDetails.match?.teams[0].id} />
                    ))
                  :
                  <PlayerProfile player={matchDetails.match?.teams[0] as Player} isWinner={calculateWinner(matchDetails.match) === matchDetails.match?.teams[0].id} />
                  : null
                }
              </View>
              <View>
                {
                  matchDetails?.match?.score.map((set: Number[], setIndex: number) => (
                    <View key={`${matchDetails?.match?.id}-${setIndex}-view`} style={[{ flexDirection: "row" }]}>
                      {
                        set.map((score: Number, index: number) => (
                          <View key={`${matchDetails?.match?.id}-${setIndex}-${index}`} style={[{ flexDirection: "row", alignItems: "center" }]}>
                            <ThemedText
                              style={[
                                index === getHigherScore(set) ? { color, fontFamily: bold } : {},
                                { fontSize: large }
                              ]}
                            >
                              {score.toString()}
                            </ThemedText>
                            {
                              index === 0 ? <ThemedText> - </ThemedText> : null
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
                (matchDetails && matchDetails.match) ?
                String(id).startsWith("dm") ?
                  (matchDetails.match?.teams[1] as Team).players.map((player: Player) => (
                    <PlayerProfile key={player.id} player={player} isWinner={calculateWinner(matchDetails.match) === matchDetails.match?.teams[1].id} />
                  ))
                :
                <PlayerProfile player={matchDetails.match?.teams[1] as Player} isWinner={calculateWinner(matchDetails.match) === matchDetails.match?.teams[1].id} />
                : null
                }
              </View>
            </View>
          </View>
        </ImageBackground>
      </>
    );
  };

  const renderMatchDetailsTab = () => {
    return (
      <>
        {
          matchDetails && matchDetails.match &&
          <ThemedView style={styles.tabScreen}>
            <MatchDetailsCounterCard h2h={getTotalSetsByMatch(matchDetails.match.score)} title="Sets Won" />
            <MatchDetailsCounterCard
              h2h={getTotalScoreByMatch(matchDetails.match.score)}
              title="Points Obtained"
              showPercentage={true}
            />
          </ThemedView>
        }
      </>
    );
  };

  const renderH2HTab = () => {
    return (
      <>
      {
        matchDetails && matchDetails.match && matchDetails.h2h &&
        <ThemedView style={styles.tabScreen}>
          <MatchDetailsCounterCard
            h2h={getH2H(matchDetails.h2h, [matchDetails.match.teams[0].id, matchDetails.match.teams[1].id])}
            isTransparent={true}
            textStyle={{ fontSize: title }}
          />
          <MatchDetailsCounterCard
            h2h={getTotalSetsByH2H(matchDetails.h2h, [matchDetails.match.teams[0].id, matchDetails.match.teams[1].id])}
            title="Total Sets"
          />
          <MatchDetailsCounterCard
            h2h={getTotalPointsByH2H(matchDetails.h2h, [matchDetails.match.teams[0].id, matchDetails.match.teams[1].id])}
            title="Total Points"
            showPercentage={true}
          />
        </ThemedView>
      }
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"}/>
        <ThemedBannerView headerImage={renderMatchBanner()}>
          {
            matchDetails &&
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
          }
        </ThemedBannerView>
    </View>
  );
};

function PlayerProfile({ player, isWinner }: PlayerProfileProps) {
  const borderColor = isWinner ? useThemeColor("winningTeamBorder") : "rgba(61, 61, 61, 0.5)" ;
  const borderWidth = 3;
  const opacity = isWinner ? 1 : 0.7;
  const imageSize: number = 72;

  return (
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
});