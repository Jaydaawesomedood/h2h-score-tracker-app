import DatePicker from "@/components/_ui/input/DatePicker";
import SelectableOption from "@/components/_ui/select/SelectableOption";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import { useLogScore } from "@/hooks/v2/useLogScore";
import useProgressTracker from "@/hooks/v2/useProgressTracker";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { ComponentProps, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

interface IMatchTypeCardProps {
  icon: ComponentProps<typeof FontAwesome6>['name'],
  title: string,
  description: string,
  value: 'singles' | 'doubles',
  type?: 'singles' | 'doubles',
  setType: React.Dispatch<React.SetStateAction<'singles' | 'doubles' | undefined>>,
}

export default function MatchOverviewStep() {
  const { date, setDate, type, setType } = useLogScore();
  const { checkIsNextDisabled } = useProgressTracker();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const muted = useThemeColor('muted');

  useEffect(() => {
    checkIsNextDisabled({ date, type });
  }, [date, type]);

  return (
    <View style={[Styles.FLEX_COLUMN, { rowGap: 16, height: '100%' }]}>
      <ThemedText style={{ color: muted }}>
        What kind of match was it?
      </ThemedText>
      <ScrollView contentContainerStyle={[Styles.FLEX_COLUMN, { rowGap: 16 }]}>
        <View style={[Styles.FLEX_COLUMN, { rowGap: 8 }]}>
          <MatchTypeCard
            icon='user-large'
            title="Singles"
            description="1-vs-1"
            value="singles"
            type={type}
            setType={setType}
          />
          <MatchTypeCard
            icon='user-group'
            title="Doubles"
            description="2-vs-2"
            value="doubles"
            type={type}
            setType={setType}
          />
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
  const text = useThemeColor('text');
  const color = useThemeColor('muted');

  return (
    <SelectableOption
      selected={props.type === props.value}
      onPress={() => props.setType(props.value)}
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
