import ScreenTitleWithBack from "@/components/screens/ScreenTitleWithBack";
import ThemedView from "@/components/ThemedView";
import { Containers, Modals, PlayerListItem } from "@/constants/styles/Containers";
import { useContext, useEffect, useState } from "react";
import { FlatList, Keyboard, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "@/constants/styles/Text";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import ThemedText from "@/components/ThemedText";
import { Player } from "@/models/Player";
import { useThemeColor } from "@/hooks/useThemeColor";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { InsertTeam, IsTeamExists } from "@/utils/database/database";
import { Genders } from "@/models/Genders.enum";
import { showErrorToast, showMessageToast } from "@/utils/toast.util";
import { ToastMessages } from "@/constants/messages/Toast";
import TeamForm from "@/components/forms/TeamForm";
import { DbContext, TeamPlayersContext } from "@/utils/context";
import { GetAllPlayers } from "@/utils/repositories/PlayerRepository";
import PlayerProfileCard from "@/components/views/players/PlayerProfileCard";

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

export default function AddTeamScreen() {
  // Context
  const db = useContext(DbContext);
  
  // State variables - UI
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // State variables - Data
  const [teamName, setTeamName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerNumber, setCurrentPlayerNumber] = useState<number>(0);
  const [addDisabled, setAddDisabled] = useState<boolean>(true);

  // Input functionalities
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

  const getAllPlayers = async () => {
    if (db) {
      await GetAllPlayers(db, setAllPlayers, showErrorToast);
    }
    else {
      showErrorToast();
    }
  };

  const onAddTeam = async () => {
    if (db && players.length === 2) {
      if (players[0].id !== players[1].id) {
        let sortedPlayers = [];
        if (category === "xd") {
          if (players[0].gender === Genders.Female && players[1].gender === Genders.Male) {
            sortedPlayers.push(players[1]);
            sortedPlayers.push(players[0]);
          }
          else {
            sortedPlayers = [...players];
          }
        }
        else if (category === "md" || category === "wd") {
          sortedPlayers = players.slice().sort((a: Player, b: Player) => a.lastName.localeCompare(b.lastName));
        }
        else {
          sortedPlayers = [...players];
        }
  
        await IsTeamExists(db, [sortedPlayers[0].id, sortedPlayers[1].id])
        .then(async (IsTeamExists: { response: boolean, id: string }) => {
          if (!IsTeamExists.response) {
            await InsertTeam(db, [teamName, category, sortedPlayers[0].id, sortedPlayers[1].id])
            .then(() => {
              showMessageToast(ToastMessages.AddTeamSuccess);
              clearFields();
            })
            .catch(() => {
              showErrorToast();
            });
          }
          else {
            showMessageToast(ToastMessages.AddTeamError_TeamExists);
          }
        })
        .catch(() => showErrorToast());
      }
      else {
        showMessageToast(ToastMessages.AddTeamError_SamePlayers);
      }
    }
    else {
      showErrorToast();
    }
  };

  const clearFields = () => {
    setTeamName("");
    setCategory("");
    setPlayers([]);
  };

  // useEffect
  useEffect(() => {
    if (allPlayers.length === 0) getAllPlayers();
  }, []);

  useEffect(() => {
    setAddDisabled(players.length < 2);
  }, [players]);

  return (
    <TeamPlayersContext.Provider value={{ players, setPlayers, setCategory }}>
      <TouchableWithoutFeedback onPress={() => { hideKeyboard(); closeDropdown(); }}>
        <ThemedView style={Containers.screen}>
          <PlayersModal players={allPlayers} isOpen={isModalOpen} onClose={onCloseModal} playerNumber={currentPlayerNumber} />
          <ScreenTitleWithBack title="Add Team" />
          <TeamForm
            teamName={teamName}
            setTeamName={setTeamName}
            category={category}
            setCategory={setCategory}
            players={players}
            onAddTeamPlayer={onSelectAddPlayerBox}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            onDropdownClose={closeDropdown}
            onKeyboardClose={hideKeyboard}
          />
          <PrimaryButton title="Add" onPress={onAddTeam} disabled={addDisabled} style={{ marginTop: 32 }} />
        </ThemedView>
      </TouchableWithoutFeedback>
    </TeamPlayersContext.Provider>
  );
};


function PlayersModal({ players, isOpen, onClose, playerNumber }: PlayersModalProps) {
  // Colors
  const contentBackgroundColor = useThemeColor("background");
  const separatorColor = useThemeColor("itemSeparator");
  
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose}>
        <View style={Modals.backdrop}>
          <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor, height: "90%" }]}>
            <View style={Modals.titleContainer}>
              <ThemedText style={Text.screenTitle}>Add Player</ThemedText>
              <SecondaryButton title="Close" onPress={onClose} />
            </View>
            <FlatList
              data={players}
              renderItem={ ({ item, index, separators }) => <ListItem item={item} playerNumber={playerNumber} onCloseModal={onClose} /> }
              ItemSeparatorComponent={() => <View style={{ width: "100%", height: 0.5, backgroundColor: separatorColor }} />}
            />
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

// TODO - segregate this somewhere as component is used elsewhere
function ListItem({ item, playerNumber, onCloseModal }: ListItemProps) {
  // Context
  const { players, setPlayers, setCategory } = useContext(TeamPlayersContext);

  // Styling
  const containerStyle = PlayerListItem.itemContainer;

  const onPress = () => {
    if (players.length < 2) { // Add player to team if limit is not fulfilled
      const playersInTeam = [...players, item]
      setPlayers(playersInTeam);

      if (players.length === 1) {
        setTeamCategory(playersInTeam);
      }
    }
    else { // Else, replace the selected player with the new player
      const playersInTeam = players.slice();
      playersInTeam[playerNumber - 1] = item;
      setPlayers([...playersInTeam]);
      setTeamCategory(playersInTeam);
    }

    onCloseModal();
  };

  const setTeamCategory = (players: Player[]) => {
    if (players[0].gender === Genders.Male && players[1].gender === Genders.Male) {
      setCategory("md");
    }
    else if (players[0].gender === Genders.Female && players[1].gender === Genders.Female) {
      setCategory("wd");
    }
    else if (
      (players[0].gender === Genders.Male && players[1].gender === Genders.Female) ||
      (players[0].gender === Genders.Female && players[1].gender === Genders.Male)
    ) {
      setCategory("xd");
    }
    else {
      setCategory("unspecified");
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <PlayerProfileCard player={item} />
    </TouchableOpacity>
  );
}