import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

import ThemedView from "@/components/ThemedView";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import PlayerForm from "@/components/forms/PlayerForm";
import ScreenTitle from "@/components/screens/ScreenTitle";

import { ToastMessages } from "@/constants/messages/Toast";
import { Containers } from "@/constants/styles/Containers";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DbContext, useDataStore, useProfileStore } from "@/utils/context";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import { DeletePlayer, UpdatePlayer } from "@/utils/database/database";
import { GetAllPlayersV2, GetAllTeamsV2 } from "@/utils/repositories/PlayerRepository";
import { GetAllMatchesV2 } from "@/utils/repositories/MatchRepository";

export default function EditPlayerModal() {
  // Context
  const db = useContext(DbContext);
  const { profile, setProfile, clearProfile } = useProfileStore();
  const { setPlayers, setTeams, setSinglesMatches, setDoublesMatches } = useDataStore();
  
  // Colors
  const deleteBtnColor = useThemeColor("deleteIcon");

  let { id } = useLocalSearchParams();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [originalFirstName, setOriginalFirstName] = useState<string>(String(profile.player.firstName));
  const [originalLastName, setOriginalLastName] = useState<string>(String(profile.player.lastName));
  const [originalLastNameFirst, setOriginalLastNameFirst] = useState<boolean>(Number(profile.player.lastNameFirst) === 1);
  const [originalGender, setOriginalGender] = useState<string>(String(profile.player.gender));
  
  const [editFirstName, setEditFirstName] = useState<string>(originalFirstName);
  const [editLastName, setEditLastName] = useState<string>(String(originalLastName));
  const [editLastNameFirst, setEditLastNameFirst] = useState<boolean>(originalLastNameFirst);
  const [editGender, setEditGender] = useState<string>(originalGender);

  const [editDisabled, setEditDisabled] = useState<boolean>(true);

  const onCloseScreen = () => { router.back(); };

  const onUpdate = async () => {
    if (db) {
      try {
        await UpdatePlayer(db, [editFirstName.trim(), editLastName.trim(), editLastNameFirst ? 1 : 0, editGender, String(id)]);
        showMessageToast(ToastMessages.EditPlayerSuccess);
        setProfile({
          ...profile,
          player: {
            firstName: editFirstName,
            lastName: editLastName,
            lastNameFirst: editLastNameFirst,
            gender: editGender
          }
        });
        setOriginalData();

        // After updating player data in DB, call GetAllPlayers & GetAllTeams to update the store
        await GetAllPlayersV2(db, setPlayers, showErrorToast);
        await GetAllTeamsV2(db, setTeams, showErrorToast);
        await GetAllMatchesV2(db, setSinglesMatches, setDoublesMatches, showErrorToast);
      }
      catch (err: any) {
        showErrorToast();
      }
    }
    else {
      showErrorToast();
    }
  };

  const onDelete = async () => {
    if (db) {
      try {
        await DeletePlayer(db, String(id));
        showMessageToast(ToastMessages.DeletePlayerSuccess);
        router.navigate("/(tabs)/players");
        clearProfile();

        // After deleting player from DB, call GetAllPlayers, GetAllTeams & GetAllMatches to update the store
        await GetAllPlayersV2(db, setPlayers, showErrorToast);
        await GetAllTeamsV2(db, setTeams, showErrorToast);
        await GetAllMatchesV2(db, setSinglesMatches, setDoublesMatches, showErrorToast);
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

  const setOriginalData = () => {
    setOriginalFirstName(editFirstName);
    setOriginalLastName(editLastName);
    setOriginalLastNameFirst(editLastNameFirst);
    setOriginalGender(editGender);
    setEditDisabled(true);
  };

  useEffect(() => {
    if (
      (editFirstName !== originalFirstName ||
      editLastName !== originalLastName ||
      editLastNameFirst !== originalLastNameFirst ||
      editGender !== originalGender) &&
      editFirstName !== "" &&
      editGender !== ""
    ) {
      setEditDisabled(false);
    }
    else {
      setEditDisabled(true);
    }
  }, [editFirstName, editLastName, editLastNameFirst, editGender]);

  return (
    <TouchableWithoutFeedback onPress={() => { hideKeyboard(); closeDropdown(); }}>
      <ThemedView style={Containers.screen}>
        <ScreenTitle
          title="Edit Player"
          actionBtn={{
            title: "Close",
            onActionBtn: onCloseScreen
          }}
        />
        <PlayerForm
          firstName={editFirstName}
          setFirstName={setEditFirstName}
          lastName={editLastName}
          setLastName={setEditLastName}
          lastNameFirst={editLastNameFirst}
          setLastNameFirst={setEditLastNameFirst}
          gender={editGender}
          setGender={setEditGender}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onDropdownClose={closeDropdown}
          onKeyboardClose={hideKeyboard}
        />
        <PrimaryButton title="Save Changes" onPress={onUpdate} disabled={editDisabled} />
        {
          (id !== "p1") ?
          <SecondaryButton title="Delete" icon="trash" iconPosition="left" onPress={onDelete} customColor={deleteBtnColor} style={{ alignSelf: "center", marginTop: 24 }} />
          : null
        }
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}