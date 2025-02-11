import PrimaryButton from "@/components/buttons/PrimaryButton";
import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import ThemedView from "@/components/ThemedView";
import { Containers } from "@/constants/styles/Containers";
import { useContext, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { InsertPlayer } from "@/utils/database/database";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import { ToastMessages } from "@/constants/messages/Toast";
import PlayerForm from "@/components/forms/PlayerForm";
import { DbContext, useDataStore } from "@/utils/context";
import { GetAllPlayersV2 } from "@/utils/repositories/PlayerRepository";

export default function AddPlayerScreen() {
  // Context
  const db = useContext(DbContext);
  const { setPlayers } = useDataStore();

  // Styling
  const screenStyle = Containers.screen;

  // State variables - UI
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addDisabled, setAddDisabled] = useState<boolean>(true);
  
  // State variables - Data
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [lastNameFirst, setLastNameFirst] = useState<boolean>(false);
  const [gender, setGender] = useState<string>("");

  // Input functionalities
  const onAdd = async () => {
    if (db) {
      try {
        await InsertPlayer(db, [firstName.trim(), lastName.trim(), lastNameFirst ? 1 : 0, gender]);
        showMessageToast(ToastMessages.AddPlayerSuccess);
        clearFields();

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
  
  const hideKeyboard = () => { Keyboard.dismiss(); };
  const closeDropdown = () => { setIsDropdownOpen(false); };

  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setLastNameFirst(false);
    setGender("");
  };

  // useEffect
  useEffect(() => {
    setAddDisabled(firstName === "" || gender === "");
  }, [firstName, gender]);

  return (
    <TouchableWithoutFeedback onPress={() => { hideKeyboard(); closeDropdown(); }}>
      <ThemedView style={screenStyle}>
        <ScreenTitleWithBack title="Add Player" />
        <PlayerForm
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          lastNameFirst={lastNameFirst}
          setLastNameFirst={setLastNameFirst}
          gender={gender}
          setGender={setGender}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onDropdownClose={closeDropdown}
          onKeyboardClose={hideKeyboard}
        />
        <PrimaryButton title="Add" onPress={onAdd} disabled={addDisabled} />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}