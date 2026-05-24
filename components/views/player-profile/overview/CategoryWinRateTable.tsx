import Card from "@/components/_ui/card/Card";
import { Bar } from "@/components/_ui/custom-components/Bar";
import ThemedText from "@/components/_ui/ThemedText";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { OverviewCategory, PlayerOverview } from "@/models/v2/views/PlayerProfileTab";
import { Fragment } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface ICategoryWinRateTableProps {
  summary: PlayerOverview,
}

interface IRowProps {
  category: string,
  data: OverviewCategory,
  style?: StyleProp<ViewStyle>,
}

export default function CategoryWinRateTable({ summary }: ICategoryWinRateTableProps) {
  return (
    <View style={{ rowGap: 16 }}>
      <ThemedText weight="bold" style={{ fontSize: 18 }}>
        Win Rate by Category
      </ThemedText>
      <View>
        <Row
          category="Overall"
          data={summary.overall}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 1 }}
        />
        <Row
          category="Singles"
          data={summary.singles}
          style={{ borderRadius: 0, borderTopWidth: 1, borderBottomWidth: 1 }}
        />
        <Row
          category="Doubles"
          data={summary.doubles}
          style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 1 }}
        />
      </View>
    </View>
  );
}

function Row(props: IRowProps) {
  const primary = useThemeColor("primary");
  const red = useThemeColor("red");
  const muted = useThemeColor("muted");

  return (
    <Card style={[{ justifyContent: 'space-between' }, props.style]}>
      <View style={{ width: '20%' }}>
        <ThemedText weight="bold">{props.category}</ThemedText>
      </View>
      {
        (props.data.wins?.value === 0 && props.data.losses?.value === 0) 
        ? (
          <ThemedText weight="bold" style={{ textAlign: 'center', flex: 1, color: muted }}>
            Unavailable
          </ThemedText>
        )
        : (
          <Fragment>
            <View style={{ flex: 1 }}>
              <Bar
                values={[
                  props.data.wins?.value,
                  props.data.losses?.value
                ]}
                subtitle={['Won', 'Lost']}
                labelStyle={{ fontSize: 16, color: muted }}
                subtitleStyle={{ color: muted }}
                barStyle={{ paddingHorizontal: 16 }}
                customBarColor={props.data.losses?.value > props.data.wins?.value ? red : undefined}
              />
            </View>
            <View style={{ width: '15%' }}>
              <ThemedText weight="bold" style={[
                { textAlign: 'right' },
                { color: props.data.losses?.value > props.data.wins?.value ? red : primary }
              ]}>
                {props.data.winRate?.value}
              </ThemedText>
            </View>
          </Fragment>
        )
      }
    </Card>
  );
}
