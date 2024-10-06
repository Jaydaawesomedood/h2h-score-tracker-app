import { View } from "react-native";
import ThemedInput from "../ThemedInput";
import Checkbox from "expo-checkbox";
import { ThemedText } from "../ThemedText";
import ThemedDropdown from "../ThemedDropdown";
import { Dispatch, SetStateAction } from "react";
import { Text } from "@/constants/styles/Text";
import { Containers } from "@/constants/styles/Containers";
import { useThemeColor } from "@/hooks/useThemeColor";

type PlayerFormProps = {
  firstName: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  lastName: string;
  setLastName: Dispatch<SetStateAction<string>>;
  lastNameFirst: boolean;
  setLastNameFirst: Dispatch<SetStateAction<boolean>>;
  gender: string;
  setGender: Dispatch<SetStateAction<string>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  onDropdownClose: () => void;
  onKeyboardClose: () => void;
};

export default function PlayerForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  lastNameFirst,
  setLastNameFirst,
  gender,
  setGender,
  isDropdownOpen,
  setIsDropdownOpen,
  onDropdownClose,
  onKeyboardClose
}: PlayerFormProps) {

  // Styling
  const inputLabelStyle = Text.inputLabel;
  const color = useThemeColor("primary");

  return (
    <>
      {/* TODO - Add player image here */}
      <ThemedInput
        value={firstName}
        setValue={setFirstName}
        placeholder="Enter first name"
        label="First Name (Given Name)"
        labelStyle={inputLabelStyle}
        containerStyle={{ marginBottom: 24 }}
        onFocus={onDropdownClose}
      />
      <ThemedInput
        value={lastName}
        setValue={setLastName}
        placeholder="Enter last name"
        label="Last Name (Surname)"
        labelStyle={inputLabelStyle}
        containerStyle={{ marginBottom: 12 }}
        onFocus={onDropdownClose}
      />
      <View style={[Containers.checkboxContainer, { marginBottom: 24 }]}>
        <Checkbox
          value={lastNameFirst}
          onValueChange={setLastNameFirst}
          color={lastNameFirst ? color : undefined}
        />
        <ThemedText style={[Text.message, { paddingLeft: 8 }]}>
          Name begins with last name (e.g., Chinese names)
        </ThemedText>
      </View>
      <ThemedDropdown
        value={gender}
        setValue={setGender}
        options={[
          { label: "Unspecified", value: "unspecified" },
          { label: "Male", value: "male" },
          { label: "Female", value: "female" }
        ]}
        placeholder="Select player's gender"
        isOpen={isDropdownOpen}
        setIsOpen={setIsDropdownOpen}
        onPress={onKeyboardClose}
        label="Gender"
        labelStyle={inputLabelStyle}
        containerStyle={{ marginBottom: 32 }}
      />
    </>
  );
};