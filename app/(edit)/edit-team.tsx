import TeamForm from "@/components/forms/TeamForm";
import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedView from "@/components/ThemedView";
import { Containers } from "@/constants/styles/Containers";
import { Player } from "@/models/Player";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { DeleteTeam, UpdateTeam } from "@/utils/database/database";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import { useThemeColor } from "@/hooks/useThemeColor";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ToastMessages } from "@/constants/messages/Toast";
import { DbContext } from "@/utils/context";

export default function EditTeamScreen() {
  // Context
  // TODO - Change to profile state, refer to edit player
  const { id, name, category, player1, player2 } = useLocalSearchParams();
  const db = useContext(DbContext);

  // Colors
  const deleteBtnColor = useThemeColor("deleteIcon");

  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editDisabled, setEditDisabled] = useState<boolean>(true);

  // State variables
  const players = [{...JSON.parse(String(player1))}, {...JSON.parse(String(player2))}];
  const [originalName, setOriginalName] = useState<string>(String(name));
  const [editedName, setEditedName] = useState<string>(originalName);

  // Navigation
  const onCloseScreen = () => { router.back(); };

  // Input functions
  const hideKeyboard = () => { Keyboard.dismiss(); };
  const closeDropdown = () => { setIsDropdownOpen(false); };

  const onSelectAddPlayerBox = (number: number) => {
    hideKeyboard();
    closeDropdown();
  };

  const onUpdate = async () => {
    if (db) {
      await UpdateTeam(db, [editedName.trim()], String(id))
      .then(() => {
        showMessageToast(ToastMessages.EditTeamSuccess);
        setOriginalData();
      })
      .catch(() => {
        showErrorToast();
      });
    }
    else {
      showErrorToast();
    }
  };

  const onDelete = async () => {
    if (db) {
      await DeleteTeam(db, String(id))
      .then(() => {
        showMessageToast(ToastMessages.DeleteTeamSuccess);
        router.navigate("/(tabs)/players");
      })
    }
    else {
      showErrorToast();
    }
  };

  // Other methods
  const setOriginalData = () => {
    setOriginalName(editedName);
    setEditDisabled(true);
  };

  useEffect(() => {
    if (editedName !== originalName) {
      setEditDisabled(false);
    }
    else {
      setEditDisabled(true);
    }
  }, [editedName]);

  return (
    <TouchableWithoutFeedback onPress={() => { hideKeyboard(); closeDropdown(); }}>
      <ThemedView style={Containers.screen}>
        <ScreenTitle
          title="Edit Team"
          actionBtn={{
            title: "Close",
            onActionBtn: onCloseScreen
          }}
        />
        <TeamForm
          teamName={editedName}
          setTeamName={setEditedName}
          category={String(category)}
          setCategory={() => {}}
          players={players}
          onAddTeamPlayer={onSelectAddPlayerBox}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          dropdownDisabled={true}
          addTeamPlayerDisabled={true}
          onDropdownClose={closeDropdown}
          onKeyboardClose={hideKeyboard}
        />
        <PrimaryButton title="Save Changes" onPress={onUpdate} disabled={editDisabled} style={{ marginTop: 32 }} />
        <SecondaryButton title="Delete" icon="trash" iconPosition="left" onPress={onDelete} customColor={deleteBtnColor} style={{ alignSelf: "center", marginTop: 24 }} />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};