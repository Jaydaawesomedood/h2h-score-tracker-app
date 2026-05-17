import { FontAwesome6 } from "@expo/vector-icons";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Dispatch, SetStateAction, useMemo } from "react";
import { Calendar as RNCalendar } from "react-native-calendars";
import { DateData, Direction } from "react-native-calendars/src/types";
import DateHelper from "@/utils/date-helper.util";
import { View } from "react-native";

interface ICalendarProps {
  date: string,
  setDate: Dispatch<SetStateAction<string>>
}

export default function Calendar(props: ICalendarProps) {
  const background = useThemeColor('background');
  const muted = useThemeColor('muted');
  const primary = useThemeColor('primary');
  const text = useThemeColor('text');
  
  const selectedDate = useMemo(() => (
    DateHelper.toDateWithFormat(props.date, "DD/MM/YYYY", "YYYY-MM-DD")
  ), [props.date]);

  const handleDayPress = ({ dateString }: DateData) => {
    props.setDate(DateHelper.toDateWithFormat(dateString, "YYYY-MM-DD", "DD/MM/YYYY"));
  };

  // TODO - move this elsewhere
  const calendarTheme = {
    calendarBackground: 'transparent',
    dayTextColor: text,
    textSectionTitleColor: muted,
    monthTextColor: text,
    selectedDayBackgroundColor: primary,
    selectedDayTextColor: background,
    todayTextColor: primary,
    textDayFontFamily: 'LeagueSpartanRegular',
    textMonthFontFamily: 'LeagueSpartanRegular',
    textDayHeaderFontFamily: 'LeagueSpartanRegular',
    todayButtonFontFamily: 'LeagueSpartanRegular',
    'stylesheet.calendar.main': {
      monthView: {
        backgroundColor: 'transparent',
      },
      dayContainer: {
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: 'center',
      },
      emptyDayContainer: {
        backgroundColor: 'transparent',
        flex: 1,
      },
    },
  } as any;

  return (
    <View>
      <RNCalendar
        initialDate={selectedDate}
        onDayPress={handleDayPress}
        hideExtraDays
        renderArrow={(direction: Direction) => (
          <FontAwesome6 name={`chevron-${direction}`} size={14} color={text} />
        )}
        arrowsHitSlop={30}
        markedDates={selectedDate ? {
          [selectedDate]: {
            selected: true,
          },
        } : undefined}
        theme={calendarTheme}
      />
    </View>
  );
}