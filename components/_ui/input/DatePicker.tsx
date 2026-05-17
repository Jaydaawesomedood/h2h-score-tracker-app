import { PropsWithChildren, Dispatch, SetStateAction, ReactNode, useRef } from "react";
import { StyleSheet, TextProps, TouchableOpacity, View } from "react-native";
import Popover from "../Popover";
import ThemedText from "../ThemedText";
import Calendar from "./Calendar";
import useThemeColor from "@/hooks/v2/useThemeColor";

type IDatePickerControlProps = PropsWithChildren & {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>,
  date: string,
  setDate: Dispatch<SetStateAction<string>>,
}

function DatePicker({ children }: { children: ReactNode | undefined }) {
  return (
    <View style={{ rowGap: 8 }}>
      {children}
    </View>
  );
}

function DatePickerLabel(props: TextProps) {
  return (
    <ThemedText {...props}>{props.children}</ThemedText>
  );
}

function DatePickerControl(props: IDatePickerControlProps) {
  const popoverAnchorRef = useRef<View | null>(null);

  const backgroundColor = useThemeColor('input');

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.control,
          { backgroundColor }
        ]}
        onPress={() => props.setVisible(!props.visible)}
        ref={popoverAnchorRef}
      >
        <ThemedText>{props.date}</ThemedText>
      </TouchableOpacity>
      <Popover visible={props.visible} setVisible={props.setVisible} anchor={popoverAnchorRef}>
        <Calendar date={props.date} setDate={props.setDate} />
      </Popover>
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  }
});

DatePicker.Label = DatePickerLabel;
DatePicker.Control = DatePickerControl;

export default DatePicker;