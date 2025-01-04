import PrimaryButton from "@/components/buttons/PrimaryButton";
import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedView from "@/components/ThemedView";
import { Containers } from "@/constants/styles/Containers";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { DeletePlayer, UpdatePlayer } from "@/utils/database/database";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import { ToastMessages } from "@/constants/messages/Toast";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import PlayerForm from "@/components/forms/PlayerForm";
import { DbContext, useProfileStore } from "@/utils/context";

export default function EditPlayerModal() {
  // Context
  const db = useContext(DbContext);
  const { profile, setProfile, clearProfile } = useProfileStore();
  
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
      await UpdatePlayer(db, [editFirstName.trim(), editLastName.trim(), editLastNameFirst ? 1 : 0, editGender, String(id)])
      .then(() => {
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
      await DeletePlayer(db, String(id))
      .then(() => {
        showMessageToast(ToastMessages.DeletePlayerSuccess);
        router.navigate("/(tabs)/players");
        clearProfile();
      })
      .catch(() => {
        showErrorToast();
      });
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