import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Modal, TextInput, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import ThemedText from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { bold, regular, Text } from "@/constants/styles/Text";
import moment from "moment";
import { Modals } from "@/constants/styles/Containers";
import ThemedView from "../ThemedView";
import SecondaryButton from "../buttons/SecondaryButton";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onInputPress?: () => void;
  label?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

export default function ThemedDatePicker({
  value,
  setValue,
  onInputPress,
  label,
  labelStyle,
  containerStyle
}: Props) {
  const today = moment().toString();
  
  // Styling
  const contentBackgroundColor = useThemeColor("background");
  const backgroundColor = useThemeColor('input');
  const placeholderColor = useThemeColor('inputPlaceholder');
  const color = useThemeColor('text');
  const primary = useThemeColor("primary");
  const separator = useThemeColor("itemSeparator");
  
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const closeModal = () => setShowPicker(false);

  return (
    <Fragment>
      <Modal animationType="fade" transparent={true} visible={showPicker} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={[Modals.backdrop, { alignItems: "center", flex: 1, justifyContent: "center" }]}>
            <ThemedView style={[Modals.contentFull, { backgroundColor: contentBackgroundColor }]}>
              <View style={Modals.titleContainer}>
                <ThemedText style={Text.screenTitle}>Date</ThemedText>
                <SecondaryButton title="Close" onPress={closeModal} />
              </View>
              <DateTimePicker
                mode="single"
                date={value}
                maxDate={today}
                onChange={({ date }) => setValue(date ? date.toString() : value)}
                calendarTextStyle={{ color, fontFamily: regular }}
                selectedTextStyle={{ fontFamily: bold }}
                selectedItemColor={ primary }
                headerTextStyle={{ color: primary, fontFamily: bold }}
                headerButtonColor={ primary }
                weekDaysTextStyle={{ color, fontFamily: bold }}
                weekDaysContainerStyle={{ borderColor: separator }}
                monthContainerStyle={{ backgroundColor: "transparent", borderColor: "transparent" }}
                yearContainerStyle={{ backgroundColor: "transparent", borderColor: "transparent" }}
              />
            </ThemedView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View style={containerStyle}>
        <ThemedText style={labelStyle}>{label}</ThemedText>
        <TouchableOpacity onPress={() => { 
          if (onInputPress) { onInputPress!(); }
          setShowPicker(true);
        }}>
          <TextInput
            placeholder="Select Match Date"
            placeholderTextColor={placeholderColor}
            value={moment(value).format("DD MMM YYYY").toString()}
            editable={false}
            style={[
              { backgroundColor, color },
              { ...Text.input }
            ]}
          />
        </TouchableOpacity>
      </View>
    </Fragment>
  );
};