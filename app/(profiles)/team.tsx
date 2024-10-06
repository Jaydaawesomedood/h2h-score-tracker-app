import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { DbContext } from "../_layout";
import { useIsFocused } from "@react-navigation/native";
import { GetTeam } from "@/utils/database/database";
import { showErrorToast } from "@/utils/toast.util";
import { Player, Team } from "@/models/Player";
import { ImageBackground, Image, View, StatusBar } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/constants/styles/Text";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import { PlayerBanner } from "@/constants/styles/Containers";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function TeamProfileScreen() {
  // Context
  const { id } = useLocalSearchParams();
  const db = useContext(DbContext);
  const isFocused = useIsFocused();

  // State variables
  const [team, setTeam] = useState<Team>();

  // Button actions
  const onEditTeam = () => { router.push({
    pathname: "/edit-team",
    params: {
      id: team!.id,
      name: team!.name,
      category: team!.category,
      player1: JSON.stringify(team!.players[0]),
      player2: JSON.stringify(team!.players[1]),
    }
  })};

  // DB actions
  const getTeam = async () => {
    if (db) {
      await GetTeam(db, String(id))
      .then((teamResponse?: Team) => {
        if (teamResponse) {
          setTeam(teamResponse);
        }
        else {
          showErrorToast();
        }
      })
      .catch((error: any) => {
        showErrorToast();
      });
    }
  };

  // useEffect
  useEffect(() => {
    if (isFocused) {
      if (db && (String(id)).startsWith("t")) {
        getTeam();
      }
      else {
        showErrorToast();
      }
    }
  }, [isFocused]);

  const renderTeamBanner = () => {
    const imageSize: number = 72;

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
                  onActionBtn: onEditTeam
                }}
                style={{ backgroundColor: "transparent" }}
              />
            </ThemedView>
            {
              team!.name ? 
              <View style={{ alignSelf: "center", paddingBottom: 24 }}>
                <ThemedText style={[Text.teamPlayerDetailsTitle, { marginTop: -16 }]}>{team!.name}</ThemedText>
              </View>
              : null
            }
            <ThemedView style={[PlayerBanner.bannerContentContainer, { justifyContent: "space-around" }]}>
              {
                team!.players.map((player: Player) => (
                  <View key={player.id} style={{ alignItems: "center", minWidth: 150, maxWidth: 150 }}>
                    <Image
                      source={require('../../assets/images/placeholder-avatar.png')}
                      style={{ borderRadius: imageSize, height: imageSize, width: imageSize, marginBottom: 16 }}
                    />
                    <View style={{ alignItems: "center", flex: 1,  flexDirection: player.lastNameFirst ? "column-reverse" : "column" }}>
                      <ThemedText numberOfLines={1} style={Text.teamPlayerDetailsTitle}>{player.firstName}</ThemedText>
                      <ThemedText numberOfLines={1} style={Text.teamPlayerDetailsTitleBold}>{player.lastName}</ThemedText>
                    </View>
                  </View>
                ))
              }
            </ThemedView>
          </ThemedView>
        </ImageBackground>
      </>
    );
  };


  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"}/>
      {
        team ?
        <ParallaxScrollView headerImage={team ? renderTeamBanner() : null}>
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
        : null
      }
    </View>
  );
};