import { useContext, useMemo, useState } from "react";
import { FlatList, Keyboard, Modal, TouchableOpacity, View } from "react-native";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";
import SecondaryButton from "../buttons/SecondaryButton";
import ThemedSearchBar from "../inputs/ThemedSearchBar";
import PlayerProfileCard from "../views/players/PlayerProfileCard";
import TeamProfileCard from "../views/players/TeamProfileCard";
import { Modals, PlayerListItem } from "@/constants/styles/Containers";
import { TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Categories } from "@/models/Categories.enum";
import { Genders } from "@/models/Genders.enum";
import { Player, Team } from "@/models/Player";
import { AddMatchContext } from "@/utils/context";

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

  const [searchTerm, setSearchTerm] = useState<string>("");

  // Colors
  const contentBackgroundColor = useThemeColor("background");
  const separatorColor = useThemeColor("itemSeparator");  

  const participantsList = useMemo(() => {
    if (searchTerm !== "") {
      if (category === "doubles") {
        return {
          singles: [],
          doubles: teamsList.slice().filter((t: Team) => (
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.players[0].firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.players[0].lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.players[1].firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.players[1].lastName.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        };
      }
      else {
        return {
          singles: playersList.slice().filter((p: Player) => (
            p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
          )),
          doubles: []
        };
      }
    }

    return { singles: playersList, doubles: teamsList };
  }, [searchTerm]);

  const closeModal = () => {
    setSearchTerm("");
    onClose();
  };
  
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={closeModal}>
        <View style={Modals.backdrop}>
          <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor, height: "90%" }]}>
            <View style={Modals.titleContainer}>
              <ThemedText style={TextStyles.titles.screen}>Add {category === "doubles" ? 'Team' : 'Player'}</ThemedText>
              <SecondaryButton title="Close" onPress={closeModal} />
            </View>
            <View>
              <ThemedSearchBar
                placeholder={category === "doubles" ? "Search team by team name or player name" : "Search player by name"}
                searchTerm={searchTerm}
                onChangeText={(text: string) => { setSearchTerm(text); }}
                onSearch={() => {}}
                onBlur={() => Keyboard.dismiss()}
                autoSearch={true}
              />
            </View>
            <FlatList
              data={(participantsList[category]) as any[]}
              renderItem={ ({ item }) => <ListItem item={item} activeIndex={activeIndex} closeModal={closeModal} /> }
              ItemSeparatorComponent={() => <View style={{ width: "100%", height: 0.5, backgroundColor: separatorColor }} />}
            />
          </ThemedView>
        </View>
      </Modal>
    </View>
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