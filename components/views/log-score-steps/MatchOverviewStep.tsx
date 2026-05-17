import DatePicker from "@/components/_ui/input/DatePicker";
import SelectableOption from "@/components/_ui/select/SelectableOption";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import { LogScoreContext } from "@/contexts/LogScoreContext";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { ComponentProps, useContext, useState } from "react";
import { ScrollView, View } from "react-native";

interface IMatchTypeCardProps {
  icon: ComponentProps<typeof FontAwesome6>['name'],
  title: string,
  description: string,
  value: 'singles' | 'doubles',
}

export default function MatchOverviewStep() {
  const { date, setDate } = useContext(LogScoreContext);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const muted = useThemeColor('muted');

  return (
    <View style={[Styles.FLEX_COLUMN, { rowGap: 16, height: '100%' }]}>
      <ThemedText style={{ color: muted }}>
        What kind of match was it?
      </ThemedText>
      <ScrollView contentContainerStyle={[Styles.FLEX_COLUMN, { rowGap: 16 }]}>
        <View style={[Styles.FLEX_COLUMN, { rowGap: 8 }]}>
          <MatchTypeCard icon='user-large' title="Singles" description="1-vs-1" value="singles" />
          <MatchTypeCard icon='user-group' title="Doubles" description="2-vs-2" value="doubles" />
        </View>
        <View>
          <DatePicker>
            <DatePicker.Label>Date</DatePicker.Label>
            <DatePicker.Control
              visible={isDatePickerVisible}
              setVisible={setIsDatePickerVisible}
              date={date}
              setDate={setDate}
            />
          </DatePicker>
        </View>
      </ScrollView>
    </View>
  );
}

function MatchTypeCard(props: IMatchTypeCardProps) {
  const { type, setType } = useContext(LogScoreContext);

  const text = useThemeColor('text');
  const color = useThemeColor('muted');

  return (
    <SelectableOption
      selected={type === props.value}
      onPress={() => setType(props.value)}
      renderLeftSegment={() => (<FontAwesome6 name={props.icon} color={color} size={20} />)}
      renderContent={() => (
        <View style={[Styles.FLEX_COLUMN, { rowGap: 4 }]}>
         <ThemedText weight="bold" style={{ color: text }}>{props.title}</ThemedText>
         <ThemedText style={{ color }}>{props.description}</ThemedText>
       </View>
      )}
    />
  );
}
