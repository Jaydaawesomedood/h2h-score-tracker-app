import PlayerName from "@/components/text/PlayerName";
import ThemedText from "@/components/ThemedText";
import { bold, extraSmall, light, medium } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Match } from "@/models/Match";
import { Player, Team } from "@/models/Player";
import { GetCategoryFullName } from "@/utils/categories.util";
import { calculateWinner, getHigherScore } from "@/utils/scores.util";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

type MatchSummaryCardProps = {
  match: Match;
  mode: "singles" | "doubles";
  style?: ViewStyle;
};

export default function MatchSummaryCard({ match, mode, style }: MatchSummaryCardProps) {
  const headerBackgroundColor = useThemeColor("cardHeader");
  const bodyBackgroundColor = useThemeColor("cardBody");
  const footerColor = useThemeColor("itemSeparator");
  const color = useThemeColor("primary");

  return (
    <Link href={`/match/${match.id}`} asChild>
      <TouchableOpacity>
        <View style={[styles.cardContainer, { backgroundColor: bodyBackgroundColor }, style]}>
          <View style={[styles.cardHeader, { backgroundColor: headerBackgroundColor }]}>
            <ThemedText style={text.header}>{GetCategoryFullName(match.category)}</ThemedText>
          </View>
          <View style={[styles.cardBody]}>
            {
              mode === "doubles" ?
              (match.teams as Team[]).map((team: Team, index: number) => {
                return (
                  <View key={`${match.id}-${team.id}`} style={[styles.teamContainer]}>
                    <View style={[styles.playersContainer]}>
                      {
                        team.players.map((player: Player) => (
                          <PlayerName
                            key={`${match.id}-${team.id}-${player.id}`}
                            player={player}
                            firstNameSettings={{ bold: calculateWinner(match) === team.id, colorize: calculateWinner(match) === team.id }}
                            lastNameSettings={{ bold: calculateWinner(match) === team.id, colorize: calculateWinner(match) === team.id }}
                          />
                        ))
                      }
                    </View>
                    <View style={styles.scoresContainer}>
                      {
                        match.score.map((score: Number[], scoreIndex: number) => (
                          <ThemedText
                            key={`${match.id}-${team.id}-${scoreIndex}`}
                            style={index === getHigherScore(score) ? { color, fontFamily: bold } : {}}
                          >
                              {score[index].toString()}
                          </ThemedText>
                        ))
                      }
                    </View>
                  </View>
                )
              })
              :
              (match.teams as Player[]).map((player: Player, index: number) => {
                return (
                  <View key={`${match.id}-${player.id}`} style={[styles.teamContainer]}>
                    <View style={[styles.playersContainer]}>
                      <PlayerName
                        player={player}
                        firstNameSettings={{ bold: calculateWinner(match) === player.id, colorize: calculateWinner(match) === player.id }}
                        lastNameSettings={{ bold: calculateWinner(match) === player.id, colorize: calculateWinner(match) === player.id }}
                      />
                    </View>
                    <View style={styles.scoresContainer}>
                      {
                        match.score.map((score: Number[], scoreIndex: number) => (
                          <ThemedText
                            key={`${match.id}-${player.id}-${scoreIndex}`}
                            style={index === getHigherScore(score) ? { color, fontFamily: bold } : {}}
                          >
                              {score[index].toString()}
                          </ThemedText>
                        ))
                      }
                    </View>
                  </View>
                );
              })
            }
          </View>
          <View style={[styles.cardFooter, { borderTopColor: footerColor }]}>
            <ThemedText numberOfLines={1} style={text.footer}>{match.mode.toLowerCase() === "tournament" ? "Tournament" : "Casual Game"}</ThemedText>
            <ThemedText style={text.footer}>{match.datetime}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardBody: {
    padding: 16,
    rowGap: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    columnGap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  teamContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  playersContainer: {
    rowGap: 8,
  },
  scoresContainer: {
    alignItems: "center",
    columnGap: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
});

const text = StyleSheet.create({
  header: {
    fontFamily: bold,
    fontSize: medium,
  },
  footer: {
    fontFamily: light,
    fontSize: extraSmall,
  },
});