import Button from "@/components/_ui/button/Button";
import Divider from "@/components/_ui/custom-components/Divider";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";
import PlayerIconPair from "@/components/_ui/custom-components/PlayerIconPair";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { ToughestOpponentStat } from "@/models/v2/views/PlayerProfileTab";
import { StyleSheet, View } from "react-native";

interface IToughestOpponentsProps {
  toughestOpponents: ToughestOpponentStat[],
  selectOpponent: (opponent: Player[]) => void,
}

interface IToughestOpponentItemProps {
  stat: ToughestOpponentStat,
  selectOpponent: (opponent: Player[]) => void,
}

export default function ToughestOpponents(props: IToughestOpponentsProps) {
  return (
    <View style={[{ paddingTop: 16 }]}>
      <View style={[styles.titleContainer]}>
        <View style={{ flex: 1, maxWidth: '80%', width: '80%' }}>
          <ThemedText weight="bold" style={{ fontSize: 18 }}>Toughest Opponents</ThemedText>
        </View>
        <View style={[styles.titleContainer, { columnGap: 16, maxWidth: '20%', width: '20%' }]}>
          <ThemedText weight="light">Won</ThemedText>
          <ThemedText weight="light">Lost</ThemedText>
        </View>
      </View>
      {
        props.toughestOpponents && props.toughestOpponents.map((to, index) => (
          <View key={`toughestopponent-${to.opponent.map(p => p.id).join('|')}`}>
            <ToughestOpponentItem stat={to} selectOpponent={props.selectOpponent} />
            { index < props.toughestOpponents.length - 1 && (<Divider style={{ opacity: 0.5 }} />)}
          </View>
        ))
      }
      {/* <View style={{ rowGap: 16 }}>
        {
          toughestOpponents.slice(0, partner ? 3 : 5).map((to, index) => (
            <Fragment key={`player-toughest-opponent-${index}`}>
              <ToughestOpponentCard
                opponentStat={to}
                hasPartnerSelected={partner !== undefined}
              />
              {
                index < toughestOpponents.length - 1 &&
                <ThemedDivider style={{ opacity: 0.5 }} />
              }
            </Fragment>
          ))
        }
      </View> */}
    </View>
  );
}

function ToughestOpponentItem({ stat, selectOpponent }: IToughestOpponentItemProps) {
  const primary = useThemeColor('primary');
  const red = useThemeColor('red');
  const muted = useThemeColor('muted');

  return (
    <View key={`toughestopponent-${stat.opponent.map(p => p.id).join('|')}`} style={[styles.itemContainer]}>
      <View style={[styles.itemPlayerContainer]}>
        {
          stat.opponent.length > 1 ? (
            <PlayerIconPair
              player1={stat.opponent[0]}
              player2={stat.opponent[1]}
              size={32}
            />
          )
          : (
            <PlayerIcon
              player={stat.opponent[0]}
              size={32}
            />
          )
        }
        <View style={[Styles.FLEX_COLUMN]}>
          {
            stat.opponent.map(opponent => (
              <ThemedText key={`toughestopponent-${stat.opponent.map(p => p.id).join('|')}-${opponent.id}`}>
                {opponent.firstName} {opponent.lastName}
              </ThemedText>
            ))
          }
        </View>
        <View style={[{ marginLeft: 'auto' }]}>
          <Button
            text=""
            onPress={() => { selectOpponent(stat.opponent); }}
            type="secondary"
            icon="circle-plus"
            textStyle={{ fontSize: 24, color: muted }}
          />
        </View>
      </View>
      <View style={[Styles.FLEX_HORIZONTAL_SIDE, { columnGap: 16, maxWidth: '20%', width: '20%' }]}>
        <ThemedText weight="bold" style={[styles.h2hTextContainer, { backgroundColor: primary }]}>{stat.h2h[0]}</ThemedText>
        <ThemedText weight="bold" style={[styles.h2hTextContainer, { backgroundColor: red }]}>{stat.h2h[1]}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    ...Styles.FLEX_HORIZONTAL_SIDE,
  },
  itemContainer: {
    ...Styles.FLEX_HORIZONTAL_SIDE,
    paddingVertical: 16,
  },
  itemPlayerContainer: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    justifyContent: 'flex-start',
    columnGap: 16,
    flex: 1,
    width: '80%',
    maxWidth: '80%',
    paddingRight: 16,
  },
  h2hTextContainer: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 8,
    aspectRatio: 1 / 1,
  }
});