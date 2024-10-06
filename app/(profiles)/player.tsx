import ParallaxScrollView from "@/components/ParallaxScrollView";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PlayerBanner } from "@/constants/styles/Containers";
import { Text } from "@/constants/styles/Text";
import { Participant, Player } from "@/models/Player";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, StatusBar, View } from "react-native";
import { DbContext } from "../_layout";
import { useIsFocused } from "@react-navigation/native";
import { GetPlayer } from "@/utils/database/database";
import { showErrorToast } from "@/utils/toast.util";

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState<Player>();

  const db = useContext(DbContext);
  const isFocused = useIsFocused();

  const getPlayer = async () => {
    if (db) {
      await GetPlayer(db, String(id))
      .then((player?: Player) => {
        if (player) {
          setProfile(player);
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

  const onEdit = () => { router.push({ pathname: "/edit-player", params: { ...profile, lastNameFirst: Number(profile?.lastNameFirst) } }); };

  useEffect(() => {
    if (isFocused) {
      if(db && (String(id)).startsWith("p")) {
        getPlayer();
      }
      else {
        showErrorToast();
      }
    }
  }, [isFocused]);

  const renderPlayerBanner = () => {
    const player = profile as Player;
    const flexDirection = player.lastNameFirst ? "column-reverse": "column";
    const imageSize: number = 72;

    return (
      <>
        <ImageBackground
          source={require('../../assets/images/placeholder-banner-2.jpg')}
          resizeMode="cover"
          style={[PlayerBanner.bannerContainer]}
        >
          <ThemedView style={PlayerBanner.innerBannerContainer}>
            <ThemedView style={PlayerBanner.screenTitleContainer}>
              <ScreenTitleWithBack
                title=""
                actionBtn={{
                  title: "Edit",
                  onActionBtn: onEdit
                }}
                style={{ backgroundColor: "transparent" }}
              />
            </ThemedView>
            <ThemedView style={PlayerBanner.bannerContentContainer}>
              <Image
                source={require('../../assets/images/placeholder-avatar.png')}
                style={{ borderRadius: imageSize, height: imageSize, width: imageSize }}
              />
              <ThemedView style={[PlayerBanner.titleContainer, { flexDirection }]}>
                <ThemedText numberOfLines={1} style={Text.playerDetailsTitle}>{player.firstName}</ThemedText>
                <ThemedText numberOfLines={1} style={Text.playerDetailsTitleBold}>{player.lastName}</ThemedText>
              </ThemedView>
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
        profile ?
        <ParallaxScrollView headerImage={profile ? renderPlayerBanner() : null}>
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
}