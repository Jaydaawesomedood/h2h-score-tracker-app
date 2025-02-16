import { StyleSheet, View } from "react-native";
import ThemedView from "../ThemedView";
import { Containers } from "@/constants/styles/Containers";
import { regular, TextStyles, title } from "@/constants/styles/Text";
import Checkbox from "expo-checkbox";
import ThemedInput from "../inputs/ThemedInput";
import ThemedText from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { SegmentedButtons } from "react-native-paper";
import PrimaryButton from "../buttons/PrimaryButton";
import { DbContext, useDataStore } from "@/utils/context";
import { InsertPlayer } from "@/utils/database/database";
import { GetAllPlayersV2 } from "@/utils/repositories/PlayerRepository";
import { showErrorToast } from "@/utils/toast.util";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  setOnboarded: Dispatch<SetStateAction<boolean>>;
};

export default function OnboardingScreen({ setOnboarded }: Props) {
  const db = useContext(DbContext);
  const { setPlayers } = useDataStore();

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

  // State variables - Data
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [lastNameFirst, setLastNameFirst] = useState<boolean>(false);
  const [gender, setGender] = useState<string>("");

  const [addDisabled, setAddDisabled] = useState<boolean>(true);

  const onAdd = async () => {
    if (db) {
      try {
        await InsertPlayer(db, [firstName.trim(), lastName.trim(), lastNameFirst ? 1 : 0, gender]);

        // Set onboarded flag to true
        await AsyncStorage.setItem('onboarded', 'true');
        setOnboarded(true);

        // After adding new player into DB, call GetAllPlayers to update the store
        await GetAllPlayersV2(db, setPlayers, showErrorToast);
      }
      catch (err: any) {
        showErrorToast();
      }
    }
    else {
      showErrorToast();
    }
  };

  // useEffect
  useEffect(() => {
    setAddDisabled(firstName === "" || gender === "");
  }, [firstName, gender]);
  
  return (
    <ThemedView style={[Containers.screen, { justifyContent: "center" }]}>
      <View style={[styles.row, { rowGap: 8 }]}>
        <ThemedText style={[TextStyles.titles.section, { fontSize: title, lineHeight: title }]}>Hello!</ThemedText>
        <ThemedText style={[TextStyles.descriptions.small]}>Before using the app, please provide the following details.</ThemedText>
      </View>
      <ThemedInput
        value={firstName}
        onChangeText={(text: string) => setFirstName(text)}
        placeholder="Enter first name"
        label="Your First Name (Given Name)"
        labelStyle={TextStyles.controls.input.label}
        containerStyle={styles.row}
      />
      <View style={styles.row}>
        <ThemedInput
          value={lastName}
          onChangeText={(text: string) => setLastName(text)}
          placeholder="Enter last name"
          label="Your Last Name (Surname)"
          labelStyle={TextStyles.controls.input.label}
          containerStyle={{ marginBottom: 12 }}
        />
        <View style={[{ flexDirection: "row", alignItems: "center" }]}>
          <Checkbox
            value={lastNameFirst}
            onValueChange={setLastNameFirst}
            color={lastNameFirst ? primary : undefined}
          />
          <ThemedText style={[TextStyles.descriptions.small, { paddingLeft: 8 }]}>
            Name begins with last name (e.g., Chinese names)
          </ThemedText>
        </View>
      </View>
      <View style={styles.row}>
        <ThemedText style={TextStyles.controls.input.label}>Gender</ThemedText>
        <SegmentedButtons
          value={gender}
          onValueChange={setGender}
          buttons={
            ["Male", "Female"].map(option => (
              {
                label: option,
                value: option.toLowerCase(),
                labelStyle: { fontFamily: regular },
                style: { borderWidth: 2, borderColor: gender.toLowerCase() === option.toLowerCase() ? primary : lightgrey }
              }
            ))
          }
          theme={SegmentedBtnTheme}
        />
      </View>
      <View style={styles.row}>
        <PrimaryButton
          title="Done"
          onPress={onAdd}
          disabled={addDisabled}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: 16,
  }
});