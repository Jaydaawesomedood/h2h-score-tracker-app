import TeamForm from "@/components/forms/TeamForm";
import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedView from "@/components/ThemedView";
import { Containers } from "@/constants/styles/Containers";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useContext, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { DeleteTeam, UpdateTeam } from "@/utils/database/database";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import { useThemeColor } from "@/hooks/useThemeColor";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ToastMessages } from "@/constants/messages/Toast";
import { DbContext, useDataStore, useProfileStore } from "@/utils/context";
import { GetAllTeamsV2 } from "@/utils/repositories/PlayerRepository";
import { GetAllMatchesV2 } from "@/utils/repositories/MatchRepository";

export default function EditTeamScreen() {
  // Context
  const { id } = useLocalSearchParams();
  const { profile, setProfile, clearProfile } = useProfileStore();
  const { setTeams, setSinglesMatches, setDoublesMatches } = useDataStore();
  const db = useContext(DbContext);
  
  // Colors
  const deleteBtnColor = useThemeColor("deleteIcon");

  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editDisabled, setEditDisabled] = useState<boolean>(true);

  // State variables
  const players = profile && profile.team ? [...profile.team.players] : [];
  const [originalName, setOriginalName] = useState<string>(profile && profile.team ? profile.team.name : "");
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
      try {
        await UpdateTeam(db, [editedName.trim()], String(id));
        showMessageToast(ToastMessages.EditTeamSuccess);
        setProfile({
          ...profile,
          team: {
            ...profile.team,
            name: editedName.trim(),
          }
        });
        setOriginalData();

        // After updating team info in DB, call GetAllTeams & GetAllMatches to update the store
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
        await DeleteTeam(db, String(id));
        showMessageToast(ToastMessages.DeleteTeamSuccess);
        clearProfile();
        router.navigate("/(tabs)/players");

        // After deleting team from DB, call GetAllTeams & GetAllMatches to update the store
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
    <Fragment>
      {
        profile && profile.team &&
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
              category={profile.team.category}
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
      }
    </Fragment>
  );
};