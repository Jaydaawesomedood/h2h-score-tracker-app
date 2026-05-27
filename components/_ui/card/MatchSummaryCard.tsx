import { StyleSheet, View, ViewStyle } from "react-native";
import { Match } from "@/models/v2/data/Match";
import ThemedText from "../ThemedText";
import { Player } from "@/models/v2/data/Player";
import { Styles } from "@/constants/v2/Styles";
import DateHelper from "@/utils/v2/date-helper.util";
import useThemeColor from "@/hooks/v2/useThemeColor";

type MatchSummaryCardProps = {
  match: Match;
  style?: ViewStyle;
};

export default function MatchSummaryCard({ match, style }: MatchSummaryCardProps) {
  // const headerBackgroundColor = useThemeColor("primaryDisabled");
  const bodyBackgroundColor = useThemeColor("card");
  // const footerColor = useThemeColor("itemSeparator");
  const primary = useThemeColor("primary");

  return (
    // <Link href={`/match/${match.id}`} asChild>
    //   <TouchableOpacity>
        <View style={[styles.cardContainer, { backgroundColor: bodyBackgroundColor }, style]}>
          <View style={[styles.cardHeader, { backgroundColor: primary }]}>
            <ThemedText weight='bold' style={{ textTransform: 'capitalize', fontSize: 16 }}>
              {match.type}
            </ThemedText>
            <ThemedText>
              {DateHelper.getDateDisplayText(match.date)}
            </ThemedText>
          </View>
          <View style={[styles.cardBody]}>
            {
              ([match.sideA, match.sideB]).map((team: Player[], index: number) => {
                const side = index === 0 ? 'A' : 'B';

                return (
                  <View key={`${match.id}-team-${side}`} style={[Styles.FLEX_HORIZONTAL_SIDE]}>
                    <View>
                      {
                        team.map((player: Player) => (
                          <ThemedText
                            key={`${match.id}-team-${player.id}`}
                            weight={match.winner === side ? 'bold' : 'regular'}
                            style={
                              match.winner === side && { color: primary }
                            }
                          >
                            {player.firstName} {player.lastName}
                          </ThemedText>
                        ))
                      }
                    </View>
                    <View style={[Styles.FLEX_HORIZONTAL_CENTER, { columnGap: 8, flexShrink: 0 }]}>
                      {
                        match.sets.map((set: number[], scoreIndex: number) => (
                          <View key={`${match.id}-teamscore-${scoreIndex}`} style={[{ minWidth: 24 }]}>
                            <ThemedText
                              weight="bold"
                              style={[
                                index === set.indexOf(Math.max(...set)) ? { color: primary } : {},
                                { textAlign: 'center' }
                              ]}
                            >
                                {set[index].toString()}
                            </ThemedText>
                          </View>
                        ))
                      }
                    </View>
                  </View>
                )
              })
            }
          </View>
          {/* <View style={[styles.cardFooter, { borderTopColor: footerColor }]}>
            <ThemedText weight='light' style={{ fontSize: 12 }}>{match.date}</ThemedText>
          </View> */}
        </View>
    //   </TouchableOpacity>
    // </Link>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    ...Styles.FLEX_HORIZONTAL_SIDE,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardBody: {
    padding: 16,
    rowGap: 16,
  },
  cardFooter: {
    ...Styles.FLEX_HORIZONTAL_SIDE,
    borderTopWidth: 1,
    columnGap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});