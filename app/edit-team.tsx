import TeamForm from "@/components/forms/TeamForm";
import ScreenTitle from "@/components/screens/ScreenTitle";
import { ThemedView } from "@/components/ThemedView";
import { Containers, Modals, PlayerListItem } from "@/constants/styles/Containers";
import { Player, Team } from "@/models/Player";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { FlatList, Image, Keyboard, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { DbContext } from "./_layout";
import { DeleteTeam, GetAllPlayers, IsTeamExists, UpdateTeam } from "@/utils/database/database";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import { ThemedText } from "@/components/ThemedText";
import { Genders } from "@/models/Genders.enum";
import { useThemeColor } from "@/hooks/useThemeColor";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { Text } from "@/constants/styles/Text";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ToastMessages } from "@/constants/messages/Toast";

// TODO - Reorganize this as its duplicating elsewhere
type PlayersModalProps = {
  players: Player[];
  isOpen: boolean;
  onClose: () => void;
  playerNumber: number;
};

// TODO - segregate this somewhere as component is used elsewhere
export type ListItemProps = {
  item: Player; // TODO - type restrict this
  playerNumber: number;
  onCloseModal: () => void;
};

export type PlayerNameProps = {
  player: Player;
}

export default function EditTeamScreen() {
  // Context
  const { id, name, category, player1, player2 } = useLocalSearchParams();
  const db = useContext(DbContext);
  const isFocused = useIsFocused();

  // Colors
  const deleteBtnColor = useThemeColor("deleteIcon");

  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editDisabled, setEditDisabled] = useState<boolean>(true);

  // State variables
  const players = [{...JSON.parse(String(player1))}, {...JSON.parse(String(player2))}];
  const [originalName, setOriginalName] = useState<string>(String(name));
  const [editedName, setEditedName] = useState<string>(originalName);

  const [currentPlayerNumber, setCurrentPlayerNumber] = useState<number>(0);

  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  // Navigation
  const onCloseScreen = () => { router.back(); };

  // Input functions
  const hideKeyboard = () => { Keyboard.dismiss(); };
  const closeDropdown = () => { setIsDropdownOpen(false); };
  const onAddPlayer = () => setIsModalOpen(true);
  const onCloseModal = () => setIsModalOpen(false);

  const onSelectAddPlayerBox = (number: number) => {
    hideKeyboard();
    closeDropdown();
    onAddPlayer();
    setCurrentPlayerNumber(number);
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

  // DB Actions
  const getAllPlayers = async () => {
    if (db) {
      await GetAllPlayers(db)
      .then((allPlayersFromDb: Player[]) => {
        if (allPlayersFromDb && allPlayersFromDb.length > 0) {
          setAllPlayers([...allPlayersFromDb]);
        }
        else {
          setAllPlayers([]);
        }
      })
      .catch((error: any) => {
        showErrorToast();
      });
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

  // useEffect
  useEffect(() => {
    if (allPlayers.length === 0) getAllPlayers();
  }, []);

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
        <PrimaryButton title="Save Changes" onPress={onUpdate} disabled={editDisabled} />
        <SecondaryButton title="Delete" icon="trash" iconPosition="left" onPress={onDelete} customColor={deleteBtnColor} style={{ alignSelf: "center", marginTop: 24 }} />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};