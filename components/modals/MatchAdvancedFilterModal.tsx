import { Dispatch, SetStateAction, useState } from "react";
import { Modal, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import ThemedDropdown from "../inputs/ThemedDropdown";
import { AdvancedSearch } from "@/constants/constants";
import { Modals } from "@/constants/styles/Containers";
import { extraSmall, regular, TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GetCategoryFullName } from "@/utils/categories.util";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: { value: string, setCategory: Dispatch<SetStateAction<string>> },
    mode: { value: string, setMode: Dispatch<SetStateAction<string>> },
    timeframe: { value: string, setTimeframe: Dispatch<SetStateAction<string>> },
    sortCriteria: { value: string, setSortCriteria: Dispatch<SetStateAction<string>> },
    sortOrder: { value: string, setSortOrder: Dispatch<SetStateAction<string>> }
  };
  onApplyFilters: () => void;
};

export default function MatchAdvancedFilterModal({ isOpen, onClose, filters, onApplyFilters }: Props) {
  // Styling
  const contentBackgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const lightgrey = useThemeColor("lightgrey");
  const primary = useThemeColor("primary");
  const disabled = useThemeColor("textDisabled");

  const SegmentedBtnTheme = {
    colors: {
      // Checked styles
      secondaryContainer: primary,
      onSecondaryContainer: textColor,
      primary: primary,
      // Unchecked styles
      onSurface: textColor,
      outline: lightgrey,
      // Disabled styles
      onSurfaceDisabled: disabled,
      surfaceDisabled: disabled,
    }
  };

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const onDismissCategoryDropdown = () => setIsCategoryDropdownOpen(false);

  const onResetFilters = () => {
    filters.category.setCategory("all");
    filters.mode.setMode("all");
    filters.timeframe.setTimeframe("all time");
    filters.sortOrder.setSortOrder("ascending");
  };

  return (
    <View>
      <Modal animationType="none" transparent visible={isOpen} onRequestClose={onClose}>
        <View style={[styles.modal]}>
          <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor, height: "70%", paddingBottom: 16, paddingHorizontal: 0 }]}>
            <View style={[Modals.titleContainer, { paddingHorizontal: 32 }]}>
              <ThemedText style={TextStyles.titles.screen}>Filter Matches</ThemedText>
              <SecondaryButton title="Close" onPress={onClose} />
            </View>
            <View style={{ flexGrow: 1 }}>
              <ScrollView style={{ flex: 1, paddingHorizontal: 32 }}>
                <TouchableWithoutFeedback onPress={onDismissCategoryDropdown}>
                  <View>

                    <View style={styles.searchCategory}>
                      <ThemedText style={[TextStyles.titles.section]}>Filters</ThemedText>

                      <View style={[styles.field]}>
                        <ThemedDropdown
                          options={
                            AdvancedSearch.matches.category.map(option => ({value: option.value, label: option.label === "All" ? "All" : GetCategoryFullName(option.label)}))
                          }
                          placeholder=""
                          value={filters.category.value}
                          setValue={filters.category.setCategory}
                          isOpen={isCategoryDropdownOpen}
                          setIsOpen={setIsCategoryDropdownOpen}
                          maxHeight={300}
                          label="Category"
                          labelStyle={[TextStyles.titles.subsection, { marginBottom: 16 }]}
                        />
                      </View>

                      <View style={[styles.field, { marginTop: 16 }]}>
                        <ThemedText style={[TextStyles.titles.subsection]}>Mode</ThemedText>
                        <SegmentedButtons
                          value={filters.mode.value}
                          onValueChange={filters.mode.setMode}
                          buttons={
                            AdvancedSearch.matches.mode.map(option => (
                              {
                                value: option.value,
                                label: option.label,
                                // icon: option.icon,
                                labelStyle: { fontFamily: regular, fontSize: extraSmall },
                                style: { borderWidth: 2, borderColor: filters.mode.value === option.value ? primary : lightgrey }
                              }
                            ))
                          }
                          theme={SegmentedBtnTheme}
                        />
                      </View>

                      <View style={[styles.field, { marginTop: 16 }]}>
                        <ThemedText style={[TextStyles.titles.subsection]}>Timeframe</ThemedText>
                        <SegmentedButtons
                          value={filters.timeframe.value}
                          onValueChange={filters.timeframe.setTimeframe}
                          buttons={
                            AdvancedSearch.matches.timeframe.map(option => (
                              {
                                value: option.value,
                                label: option.label,
                                labelStyle: { fontFamily: regular },
                                style: { borderWidth: 2, borderColor: filters.timeframe.value === option.value ? primary : lightgrey }
                              }
                            ))
                          }
                          theme={SegmentedBtnTheme}
                        />
                      </View>
                    </View>

                    <View style={[styles.searchCategory, { marginTop: 32 }]}>
                      <ThemedText style={[TextStyles.titles.section]}>Sort</ThemedText>

                      <View style={[styles.field]}>
                        <ThemedText style={[TextStyles.titles.subsection]}>Criteria</ThemedText>
                        {/* <SegmentedButtons
                          value={""}
                          onValueChange={() => {}}
                          buttons={
                            AdvancedSearch.matches.criteria.map(option => (
                              {
                                disabled: true,
                                value: option.value,
                                label: option.label,
                                labelStyle: { fontFamily: regular },
                                style: { borderWidth: 2 }
                              }
                            ))
                          }
                          theme={SegmentedBtnTheme}
                        /> */}
                        <Button
                          mode="outlined"
                          disabled
                          onPress={() => {}}
                          labelStyle={{ fontFamily: regular }}
                          style={{ borderWidth: 2 }}
                          theme={SegmentedBtnTheme}
                        >
                          {AdvancedSearch.matches.criteria[0].label}
                        </Button>
                      </View>

                      <View style={[styles.field, { marginTop: 16 }]}>
                        <ThemedText style={[TextStyles.titles.subsection]}>Order</ThemedText>
                        <SegmentedButtons
                          value={filters.sortOrder.value}
                          onValueChange={filters.sortOrder.setSortOrder}
                          buttons={
                            AdvancedSearch.sortOrder.map(option => (
                              {
                                value: option.value,
                                label: option.label,
                                icon: option.icon,
                                labelStyle: { fontFamily: regular },
                                style: { borderWidth: 2, borderColor: filters.sortOrder.value === option.value ? primary : lightgrey }
                              }
                            ))
                          }
                          theme={SegmentedBtnTheme}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
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