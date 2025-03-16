import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { View } from "react-native";
import ThemedDatePicker from "@/components/inputs/ThemedDatePicker";
import ThemedDropdown from "@/components/inputs/ThemedDropdown";
import { Steps } from "@/constants/constants";
import { TextStyles } from "@/constants/styles/Text";
import { AddMatchContext, EditMatchContext, StepperContext } from "@/utils/context";

type Props = {
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  onDropdownPress: () => void;
  isEditingMatch? : boolean;
};

export default function MatchDetailsForm({
  isDropdownOpen,
  setIsDropdownOpen,
  onDropdownPress,
  isEditingMatch = false
}: Props) {
  // TODO - refactor context to one match property
  const { setting, setSetting, date, setDate } = isEditingMatch ? useContext(EditMatchContext) : useContext(AddMatchContext);
  const { currentStep, setIsNextBtnDisabled } = useContext(StepperContext);

  useEffect(() => {
    const isFocused = currentStep === Steps[isEditingMatch ? "EditMatch" : "AddMatch"].map(s => s.label).indexOf("Match");
    if (isFocused) {
      if (setting && date) setIsNextBtnDisabled(false);
      else setIsNextBtnDisabled(true);
    }
  }, [currentStep]);

  return (
    <View style={{ rowGap: 24, paddingHorizontal: 32 }}>
      <ThemedDatePicker
        value={date}
        setValue={setDate}
        onInputPress={() => setIsDropdownOpen(false)}
        label="Date"
        labelStyle={TextStyles.controls.input.label}
      />
      <ThemedDropdown
        options={[
          { label: "Casual", value: "casual" },
          { label: "Tournament", value: "tournament" }
        ]}
        placeholder="Match Setting"
        isOpen={isDropdownOpen}
        setIsOpen={setIsDropdownOpen}
        value={setting}
        setValue={setSetting}
        onPress={onDropdownPress}
        onSelectItem={() => setIsNextBtnDisabled(false)}
        label="Match Setting"
        labelStyle={TextStyles.controls.input.label}
      />
    </View>
  );
};