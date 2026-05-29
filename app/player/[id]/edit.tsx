import Button from "@/components/_ui/button/Button";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import PlayerForm from "@/components/views/forms/AddPlayerForm";
import ScreenHeader from "@/components/views/headers/ScreenHeader";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { usePlayersStore } from "@/store/usePlayersStore";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function EditPlayerScreen() {
  const deleteColor = useThemeColor('red');
  const { id } = useLocalSearchParams();

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  const formRef = useRef<PlayerForm>(null);

  const player = usePlayersStore(
    useShallow(state => state.players.find(player => player.id === id))
  );

  const updatePlayer = usePlayersStore(state => state.updatePlayer);
  const deletePlayer = usePlayersStore(state => state.removePlayer);

  const handleSaveChanges = () => {
    if (!formRef.current || !player) return;
    updatePlayer(((formRef.current as any).getFormData()) as Player);
    router.back();
  }

  const handleDelete = async () => {
    const success = await deletePlayer(id as string);

    if (success) {
      router.dismissTo('/(tabs)/players');
    }
  }
  
  const renderDeleteButton = () => {
    if (player?.isMe) return (<></>);

    return (
      <Button
        text=""
        onPress={handleDelete}
        type="secondary"
        icon="trash"
        iconPlacement="left"
        buttonStyle={{ columnGap: 8, paddingHorizontal: 4 }}
        textStyle={{ color: deleteColor, fontSize: 18 }}
      />
    );
  }

  const handleOnFormChange = () => {
    if (!formRef.current || !player) return;

    const formData = (formRef.current as any).getFormData();
    let disabled = true;

    for(const key of Object.keys(formData)) {
      if (formData[key] !== (player as any)[key]) {
        disabled = false;
        break;
      }
    }

    setIsSaveDisabled(disabled);
  }

  return (
    <ThemedView style={[ Styles.SCREEN_BODY]}>
      <ScrollView contentContainerStyle={{ rowGap: 24 }}>
        <ScreenHeader
          renderActionButton={renderDeleteButton}
        />
        <ThemedText weight="bold" style={{ fontSize: 32 }}>Edit Player</ThemedText>
        <PlayerForm
          player={player}
          onFormChange={handleOnFormChange}
          ref={formRef}
        />
        <Button
          text="Save Changes"
          onPress={handleSaveChanges}
          type="primary"
          weight="bold"
          textStyle={{ fontSize: 16 }}
          disabled={isSaveDisabled}
        />
      </ScrollView>
    </ThemedView>
  );
}

// export default function EditPlayerModal() {
//   // Context
//   const db = useContext(DbContext);
//   const { profile, setProfile, clearProfile } = useProfileStore();
//   const { setPlayers, setTeams, setSinglesMatches, setDoublesMatches } = useDataStore();
  
//   // Colors
//   const deleteBtnColor = useThemeColor("deleteIcon");

//   let { id } = useLocalSearchParams();

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const [originalFirstName, setOriginalFirstName] = useState<string>(String(profile.player.firstName));
//   const [originalLastName, setOriginalLastName] = useState<string>(String(profile.player.lastName));
//   const [originalLastNameFirst, setOriginalLastNameFirst] = useState<boolean>(Number(profile.player.lastNameFirst) === 1);
//   const [originalGender, setOriginalGender] = useState<string>(String(profile.player.gender));
  
//   const [editFirstName, setEditFirstName] = useState<string>(originalFirstName);
//   const [editLastName, setEditLastName] = useState<string>(String(originalLastName));
//   const [editLastNameFirst, setEditLastNameFirst] = useState<boolean>(originalLastNameFirst);
//   const [editGender, setEditGender] = useState<string>(originalGender);

//   const [editDisabled, setEditDisabled] = useState<boolean>(true);

//   const onCloseScreen = () => { router.back(); };

//   const onUpdate = async () => {
//     if (db) {
//       try {
//         await UpdatePlayer(db, [editFirstName.trim(), editLastName.trim(), editLastNameFirst ? 1 : 0, editGender, String(id)]);
//         showMessageToast(ToastMessages.EditPlayerSuccess);
//         setProfile({
//           ...profile,
//           player: {
//             firstName: editFirstName,
//             lastName: editLastName,
//             lastNameFirst: editLastNameFirst,
//             gender: editGender
//           }
//         });
//         setOriginalData();

//         // After updating player data in DB, call GetAllPlayers & GetAllTeams to update the store
//         await GetAllPlayersV2(db, setPlayers, showErrorToast);
//         await GetAllTeamsV2(db, setTeams, showErrorToast);
//         await GetAllMatchesV2(db, setSinglesMatches, setDoublesMatches, showErrorToast);
//       }
//       catch (err: any) {
//         showErrorToast();
//       }
//     }
//     else {
//       showErrorToast();
//     }
//   };

//   const onDelete = async () => {
//     if (db) {
//       try {
//         await DeletePlayer(db, String(id));
//         showMessageToast(ToastMessages.DeletePlayerSuccess);
//         router.navigate("/(tabs)/players");
//         clearProfile();

//         // After deleting player from DB, call GetAllPlayers, GetAllTeams & GetAllMatches to update the store
//         await GetAllPlayersV2(db, setPlayers, showErrorToast);
//         await GetAllTeamsV2(db, setTeams, showErrorToast);
//         await GetAllMatchesV2(db, setSinglesMatches, setDoublesMatches, showErrorToast);
//       }
//       catch (err: any) {
//         showErrorToast();
//       }
//     }
//     else {
//       showErrorToast();
//     }
//   };

//   const hideKeyboard = () => { Keyboard.dismiss(); };
//   const closeDropdown = () => { setIsDropdownOpen(false); };

//   const setOriginalData = () => {
//     setOriginalFirstName(editFirstName);
//     setOriginalLastName(editLastName);
//     setOriginalLastNameFirst(editLastNameFirst);
//     setOriginalGender(editGender);
//     setEditDisabled(true);
//   };

//   useEffect(() => {
//     if (
//       (editFirstName !== originalFirstName ||
//       editLastName !== originalLastName ||
//       editLastNameFirst !== originalLastNameFirst ||
//       editGender !== originalGender) &&
//       editFirstName !== "" &&
//       editGender !== ""
//     ) {
//       setEditDisabled(false);
//     }
//     else {
//       setEditDisabled(true);
//     }
//   }, [editFirstName, editLastName, editLastNameFirst, editGender]);

//   return (
//     <TouchableWithoutFeedback onPress={() => { hideKeyboard(); closeDropdown(); }}>
//       <ThemedView style={Containers.screen}>
//         <ScreenTitle
//           title="Edit Player"
//           actionBtn={{
//             title: "Close",
//             onActionBtn: onCloseScreen
//           }}
//         />
//         <PlayerForm
//           firstName={editFirstName}
//           setFirstName={setEditFirstName}
//           lastName={editLastName}
//           setLastName={setEditLastName}
//           lastNameFirst={editLastNameFirst}
//           setLastNameFirst={setEditLastNameFirst}
//           gender={editGender}
//           setGender={setEditGender}
//           isDropdownOpen={isDropdownOpen}
//           setIsDropdownOpen={setIsDropdownOpen}
//           onDropdownClose={closeDropdown}
//           onKeyboardClose={hideKeyboard}
//         />
//         <PrimaryButton title="Save Changes" onPress={onUpdate} disabled={editDisabled} />
//         {
//           (id !== "p1") ?
//           <SecondaryButton title="Delete" icon="trash" iconPosition="left" onPress={onDelete} customColor={deleteBtnColor} style={{ alignSelf: "center", marginTop: 24 }} />
//           : null
//         }
//       </ThemedView>
//     </TouchableWithoutFeedback>
//   );
// }