import { Text } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { ComponentProps, Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, TextStyle, useColorScheme, View, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import ThemedText from "../ThemedText";

export type DropdownItem = {
  label: string;
  value: string;
};

export type ThemedDropdownProps = {
  options: DropdownItem[];
  placeholder: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
  onPress?: () => void;
  onSelectItem?: () => void;
  onChangeValue?: () => void;
  label?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

export default function ThemedDropdown({
  options,
  placeholder,
  isOpen,
  setIsOpen,
  value,
  setValue,
  disabled = false,
  onPress = () => {}, 
  onSelectItem,
  onChangeValue,
  label,
  labelStyle,
  containerStyle
}: ThemedDropdownProps) {
  // TODO - Revamp this component

  // Styling
  const inputBackgroundColor = useThemeColor('input');
  const inputPlaceholderColor = useThemeColor('inputPlaceholder');
  const textColor = useThemeColor('text');
  const menuBackgroundColor = useThemeColor("dropdownContainer");
  const itemSelectedBackgroundColor = useThemeColor("dropdownItemSelected");
  const disabledStyle = useThemeColor("dropdownContainerDisabled");
  const textStyle = Text.input;

  const theme = useColorScheme() ?? "light";

  const [items, setItems] = useState([...options]);

  useEffect(() => {
    DropDownPicker.setTheme(theme.toUpperCase());
  }, []);

  return (
    <View style={[containerStyle]}>
      <ThemedText style={[labelStyle, Text.inputLabel]}>{label}</ThemedText>
      <DropDownPicker
        open={isOpen}
        value={value}
        items={items}
        setOpen={setIsOpen}
        setValue={setValue}
        setItems={setItems}
        disabled={disabled}
        onPress={onPress}
        onSelectItem={onSelectItem}
        onChangeValue={onChangeValue}
        style={[styles.input, { backgroundColor: inputBackgroundColor }]}
        placeholder={placeholder}
        placeholderStyle={[styles.inputText, { color: inputPlaceholderColor }]}
        textStyle={textStyle}
        labelStyle={[styles.inputText, { color: textColor }]}
        dropDownContainerStyle={[styles.input, { backgroundColor: itemSelectedBackgroundColor }]}
        listParentContainerStyle={{ backgroundColor: menuBackgroundColor }}
        listItemLabelStyle={{ color: textColor }}
        ArrowDownIconComponent={() => (<DropdownIcon icon="chevron-down" />)}
        ArrowUpIconComponent={() => (<DropdownIcon icon="chevron-up" />)}
        TickIconComponent={() => (<DropdownIcon icon="check" />)}
        flatListProps={{
          scrollEnabled: false
        }}
        disabledStyle={{ backgroundColor: disabledStyle, opacity: 0.4 }}
        disabledItemLabelStyle={{ color: "#999" }}
        zIndex={1}
      />
    </View>
  );
}

type DropdownIconProps = {
  icon: ComponentProps<typeof FontAwesome>["name"];
};

function DropdownIcon({ icon }: DropdownIconProps) {
  const color = useThemeColor("text");
  return <FontAwesome name={icon} color={color} size={14} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 0,
  },
  inputText: {
    paddingHorizontal: 0,
  },
});