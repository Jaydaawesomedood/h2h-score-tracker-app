import { AddMatchContext } from "@/utils/context";
import { useContext } from "react";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { Modals, PlayerListItem } from "@/constants/styles/Containers";
import { ThemedText } from "../ThemedText";
import SecondaryButton from "../buttons/SecondaryButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text } from "@/constants/styles/Text";
import PlayerName from "../text/PlayerName";
import { Player, Team } from "@/models/Player";
import { Categories } from "@/models/Categories.enum";
import { Genders } from "@/models/Genders.enum";
import PlayerProfileCard from "../views/players/PlayerProfileCard";
import TeamProfileCard from "../views/players/TeamProfileCard";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activeIndex: number; // Position of team user is selecting
};

type ItemProps = {
  item: any;
  activeIndex: number; // Position of team user is selecting
  closeModal: () => void;
};

export default function SelectPlayerModal({
  isOpen,
  onClose,
  activeIndex
}: ModalProps) {
  // Context
  const { category, playersList, teamsList } = useContext(AddMatchContext);

  // Colors
  const contentBackgroundColor = useThemeColor("background");
  const separatorColor = useThemeColor("itemSeparator");  

  return (
    <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={Modals.backdrop}>
        <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor, height: "90%" }]}>
          <View style={Modals.titleContainer}>
            <ThemedText style={Text.screenTitle}>Add {category === "doubles" ? 'Team' : 'Player'}</ThemedText>
            <SecondaryButton title="Close" onPress={onClose} />
          </View>
          <FlatList
            data={(category === "doubles" ? teamsList : playersList) as any[]}
            renderItem={ ({ item, index, separators }) => <ListItem item={item} activeIndex={activeIndex} closeModal={onClose} /> }
            ItemSeparatorComponent={() => <View style={{ width: "100%", height: 0.5, backgroundColor: separatorColor }} />}
          />
        </ThemedView>
      </View>
    </Modal>
  );
};

function ListItem({ item, activeIndex, closeModal }: ItemProps) {
  // Context
  const { category, setSubCategory, teams, setTeams } = useContext(AddMatchContext);

  const onPress = () => {
    if (teams.length < 2) {
      // User yet to select any teams or only selected one team
      const teamsSelected = [...teams, item];
      
      if (teamsSelected.length === 2) {
        setDisciplineValue(teamsSelected);
      }

      setTeams(teamsSelected);
    }
    else {
      // Two teams are already selected, and user is trying to replace one of the teams with a new team
      const teamsSelected = teams.slice();
      teamsSelected[activeIndex] = item;
      setTeams(category === "doubles" ? [...teamsSelected] as Team[] : [...teamsSelected] as Player[]);
      setDisciplineValue(teamsSelected);
    }

    closeModal();
  };

  const setDisciplineValue = (teams: Player[] | Team[]) => {
    if (category === "doubles") {
      let teamsInMatch = [...teams] as Team[];

      if (teamsInMatch[0].category === teamsInMatch[1].category) {
        setSubCategory(teamsInMatch[0].category.toLowerCase());
      }
      else {
        setSubCategory(Categories[Categories.Unspecified].toLowerCase());
      }
    }
    else {
      let playersInMatch = [...teams] as Player[];

      if (playersInMatch[0].gender === Genders.Male && playersInMatch[1].gender === Genders.Male) {
        setSubCategory("ms");
      }
      else if (playersInMatch[0].gender === Genders.Female && playersInMatch[1].gender === Genders.Female) {
        setSubCategory("ws");
      }
      else {
        setSubCategory(Categories[Categories.Unspecified].toLowerCase());
      }
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={PlayerListItem.itemContainer}>
      {
        category === "doubles" ? <TeamProfileCard team={item} style={{ paddingVertical: 4, flex: 1 }} /> : <PlayerProfileCard player={item} />
      }
    </TouchableOpacity>
  );
};