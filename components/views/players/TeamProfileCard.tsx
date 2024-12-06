import PlayerName from "@/components/text/PlayerName";
import { ThemedText } from "@/components/ThemedText";
import { BorderDebug } from "@/constants/styles/Containers";
import { Text } from "@/constants/styles/Text";
import { Team } from "@/models/Player";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps & {
  team: Team;
};

export default function TeamProfileCard({ team, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.nameContainer]}>
        <View style={[styles.nameSubcontainer]}>
          <PlayerName player={team.players[0]} />
          <ThemedText style={Text.listItem}> / </ThemedText> 
          <PlayerName player={team.players[1]} />
        </View>
      </View>
      { (team.name) ? <ThemedText style={Text.listSubtitle}>{team.name}</ThemedText> : null }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 8,
  },
  nameContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  nameSubcontainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  ellipsis: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 4,
  },
});