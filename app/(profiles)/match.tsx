import ParallaxScrollView from "@/components/ParallaxScrollView";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BorderDebug, PlayerBanner } from "@/constants/styles/Containers";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ImageBackground, Image, StatusBar, View } from "react-native";
import { DbContext } from "../_layout";
import { showErrorToast } from "@/utils/toast.util";
import { Match } from "@/models/Match";
import { GetDoublesMatch, GetSinglesMatch } from "@/utils/database/database";
import { Player, Team } from "@/models/Player";
import { bold, large, medium, Text, title } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getHigherScore } from "@/utils/scores.util";

type PlayerProfileProps = {
  player: Player;
};

export default function MatchProfileScreen() {
  // Context
  const { id } = useLocalSearchParams();
  const db = useContext(DbContext);
  const isFocused = useIsFocused();

  // Styling
  const color = useThemeColor("primary");

  // State variables
  const [match, setMatch] = useState<Match>();

  const GetMatch = async (category: "singles" | "doubles") => {
    if (category === "singles") {
      const match = await GetSinglesMatch(db!, String(id));
      setMatch(match);
    }
    else if (category === "doubles") {
      const match = await GetDoublesMatch(db!, String(id));
      setMatch(match);
    }
  }

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
          <ThemedView style={PlayerBanner.innerBannerContainer}>
            <ThemedView style={PlayerBanner.screenTitleContainer}>
              <ScreenTitleWithBack
                title=""
                actionBtn={{
                  title: "Edit",
                  onActionBtn: () => {}
                }}
                style={{ backgroundColor: "transparent" }}
              />
            </ThemedView>
            <ThemedView style={[PlayerBanner.bannerContentContainer, { justifyContent: "space-evenly" }]}>
              <View style={{rowGap: 24}}>
                {
                  match ?
                  String(id).startsWith("dm") ?
                    (match.teams[0] as Team).players.map((player: Player) => (
                      <PlayerProfile key={player.id} player={player} />
                    ))
                  :
                  <PlayerProfile player={match?.teams[0] as Player} />
                  : null
                }
              </View>
              <View>
                {
                  match?.score.map((set: Number[], setIndex: number) => (
                    <View key={`${match?.id}-${setIndex}-view`} style={[{ flexDirection: "row" }]}>
                      {
                        set.map((score: Number, index: number) => (
                          <>
                            <ThemedText
                              key={`${match?.id}-${setIndex}-${index}`}
                              style={[
                                index === getHigherScore(set) ? { color, fontFamily: bold } : {},
                                { fontSize: large }
                              ]}
                            >
                              {score.toString()}
                            </ThemedText>
                            { index === 0 ? <ThemedText style={{ fontSize: large }}> - </ThemedText> : null }
                          </>
                        ))
                      }
                    </View>
                  ))
                }
              </View>
              <View style={{rowGap: 24}}>
              {
                match ?
                String(id).startsWith("dm") ?
                  (match?.teams[1] as Team).players.map((player: Player) => (
                    <PlayerProfile key={player.id} player={player} />
                  ))
                :
                <PlayerProfile player={match?.teams[1] as Player} />
                : null
                }
              </View>
            </ThemedView>
          </ThemedView>
        </ImageBackground>
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"}/>
        <ParallaxScrollView headerImage={renderMatchBanner()}>
          <ThemedView>
            <ThemedText>matches</ThemedText>
            <ThemedText>matches</ThemedText>
            <ThemedText>matches</ThemedText>
            <ThemedText>matches</ThemedText>
            <ThemedText>matches</ThemedText>
            <ThemedText>matches</ThemedText>
            <ThemedText>matches</ThemedText>
          </ThemedView>
        </ParallaxScrollView>
    </View>
  );
};

function PlayerProfile({ player }: PlayerProfileProps) {
  const imageSize: number = 72;

  return (
    <View style={{ alignItems: "center", minWidth: 150, maxWidth: 150 }}>
      <Image
        source={require('../../assets/images/placeholder-avatar.png')}
        style={{ borderRadius: imageSize, height: imageSize, width: imageSize, marginBottom: 16 }}
      />
      <View style={{ alignItems: "center", flex: 1,  flexDirection: player.lastNameFirst ? "column-reverse" : "column" }}>
        <ThemedText numberOfLines={1} style={[Text.teamPlayerDetailsTitle, { fontSize: medium }]}>{player.firstName}</ThemedText>
        <ThemedText numberOfLines={1} style={[Text.teamPlayerDetailsTitleBold, { fontSize: medium }]}>{player.lastName}</ThemedText>
      </View>
    </View>
  );
};