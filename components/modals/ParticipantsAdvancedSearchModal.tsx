import { BorderDebug, Modals } from "@/constants/styles/Containers";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import SecondaryButton from "../buttons/SecondaryButton";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import { regular, Text, TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import PrimaryButton from "../buttons/PrimaryButton";
import { SegmentedButtons } from "react-native-paper";
import { Dispatch, SetStateAction } from "react";
import { AdvancedSearch } from "@/constants/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  gender: string;
  setGender: Dispatch<SetStateAction<string>>;
  teamCategory: string;
  setTeamCategory: Dispatch<SetStateAction<string>>;
  onApplyFilters: () => void;
};

export default function ParticipantsAdvancedSearchModal({ isOpen, onClose, type, setType, gender, setGender, teamCategory, setTeamCategory, onApplyFilters }: Props) {
  // Styling
  const contentBackgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const lightgrey = useThemeColor("lightgrey");
  const primary = useThemeColor("primary");

  const SegmentedBtnTheme = {
    colors: {
      // Checked styles
      secondaryContainer: primary,
      onSecondaryContainer: textColor,
      primary: primary,
      // Unchecked styles
      onSurface: textColor,
      outline: lightgrey,
    }
  };

  const onResetFilters = () => {
    setType("all");
    setGender("all");
    setTeamCategory("all");
  };

  return (
    <View>
      <Modal animationType="none" transparent visible={isOpen} onRequestClose={onClose}>
        <View style={[styles.modal]}>
          <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor, height: "50%", paddingBottom: 16, paddingHorizontal: 0 }]}>
            <View style={[Modals.titleContainer, { paddingHorizontal: 32 }]}>
              <ThemedText style={Text.screenTitle}>Advanced Search</ThemedText>
              <SecondaryButton title="Close" onPress={onClose} />
            </View>
            <View style={{ flexGrow: 1 }}>
              <ScrollView style={{ flex: 1, paddingHorizontal: 32 }}>
                <View style={styles.searchCategory}>
                  <ThemedText style={[TextStyles.titles.section]}>Filters</ThemedText>

                  <View style={[styles.field]}>
                    <ThemedText style={[TextStyles.titles.subsection]}>Type</ThemedText>
                    <SegmentedButtons
                      value={type}
                      onValueChange={setType}
                      buttons={
                        AdvancedSearch.participants.type.map(option => (
                          {
                            value: option.value,
                            label: option.label,
                            icon: option.icon,
                            labelStyle: { fontFamily: regular },
                            style: { borderWidth: 2, borderColor: type === option.value ? primary : lightgrey }
                          }
                        ))
                      }
                      theme={SegmentedBtnTheme}
                    />
                  </View>

                  {
                    type === "players" &&
                    <View style={[styles.field, { marginTop: 16 }]}>
                      <ThemedText style={[TextStyles.titles.subsection]}>Gender</ThemedText>
                      <SegmentedButtons
                        value={gender}
                        onValueChange={setGender}
                        buttons={
                          AdvancedSearch.participants.gender.map(option => (
                            {
                              value: option.value,
                              label: option.label,
                              icon: option.icon,
                              labelStyle: { fontFamily: regular },
                              style: { borderWidth: 2, borderColor: gender === option.value ? primary : lightgrey }
                            }
                          ))
                        }
                        theme={SegmentedBtnTheme}
                      />
                    </View>
                  }

                  {
                    type === "teams" &&
                    <View style={[styles.field, { marginTop: 16 }]}>
                      <ThemedText style={[TextStyles.titles.subsection]}>Team Category</ThemedText>
                      <SegmentedButtons
                        value={teamCategory}
                        onValueChange={setTeamCategory}
                        buttons={
                          AdvancedSearch.participants.teamCategory.map(option => (
                            {
                              value: option.value,
                              label: option.label,
                              labelStyle: { fontFamily: regular },
                              style: { borderWidth: 2, borderColor: teamCategory === option.value ? primary : lightgrey }
                            }
                          ))
                        }
                        theme={SegmentedBtnTheme}
                      />
                    </View>
                  }
                </View>
              </ScrollView>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", paddingHorizontal: 32, paddingTop: 16 }}>
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <SecondaryButton
                  title="Reset"
                  onPress={onResetFilters}
                  style={{ paddingVertical: 8 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <PrimaryButton
                  title="Apply"
                  onPress={onApplyFilters}
                />
              </View>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
};

// TODO - segregate style for modals
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  searchCategory: {
    rowGap: 16,
  },
  field: {
    rowGap: 16,
  },
});