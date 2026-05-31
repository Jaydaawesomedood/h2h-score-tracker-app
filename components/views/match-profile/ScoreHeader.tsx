import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Match } from "@/models/v2/data/Match";
import { Player } from "@/models/v2/data/Player";
import { StyleSheet, View } from "react-native";

interface IScoreHeaderProps {
  match: Match,
}

export default function ScoreHeader({ match }: IScoreHeaderProps) {
   const primary = useThemeColor('primary');
   
  return (
    <View style={[Styles.FLEX_HORIZONTAL_CENTER]}>
      <MatchHeaderPlayerSide side={match.sideA} isWinner={match.winner === 'A'} />
      <View style={[Styles.FLEX_COLUMN, { flex: 1 }]}>
        {
          match.sets.map((set, index) => (
            <View key={`${match.id}-set${index}`} style={[Styles.FLEX_HORIZONTAL_CENTER]}>
              <ThemedText
                weight="bold"
                style={[styles.score, set[0] > set[1] && { color: primary }]}
              >
                {set[0]}
              </ThemedText>
              <ThemedText>-</ThemedText>
              <ThemedText
                weight="bold"
                style={[styles.score, set[1] > set[0] && { color: primary }]}
              >
                {set[1]}
              </ThemedText>
            </View>
          ))
        }
      </View>
      <MatchHeaderPlayerSide side={match.sideB} isWinner={match.winner === 'B'} />
    </View>
  );
}

function MatchHeaderPlayerSide({ side, isWinner }: { side: Player[], isWinner: boolean }) {
  return (
    <View style={[Styles.FLEX_COLUMN, { rowGap: 16, paddingHorizontal: 24 }, !isWinner && { opacity: 0.6 }]}>
      {
        side.map(player => (
          <View key={player.id} style={[Styles.FLEX_COLUMN, { rowGap: 4, alignItems: 'center' }]}>
            <PlayerIcon player={player} size={48} />
            <View style={{ rowGap: 2, alignItems: 'center' }}>
              <ThemedText>{player.firstName}</ThemedText>
              <ThemedText>{player.lastName}</ThemedText>
            </View>
          </View>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  score: {
    padding: 4,
    fontSize: 24,
  }
});