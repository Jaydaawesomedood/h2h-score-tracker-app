import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import ThemedSearchBar from "@/components/inputs/ThemedSearchBar";
import AddPlayerOptionModal from "@/components/modals/AddPlayerOptionModal";
import ParticipantsAdvancedSearchModal from "@/components/modals/ParticipantsAdvancedSearchModal";
import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedTabView from "@/components/tab-view/ThemedTabView";
import PlayerProfileCard from "@/components/views/players/PlayerProfileCard";
import TeamProfileCard from "@/components/views/players/TeamProfileCard";

import { Containers, PlayerListItem } from "@/constants/styles/Containers";
import { TextStyles } from "@/constants/styles/Text";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Participants } from "@/models/participants/Participants";
import { useDataStore } from "@/utils/context";
import { FilterParticipantsByProperty } from "@/utils/participants.utils";
import Button from "@/components/_ui/button/Button";
import { Styles } from "@/constants/v2/Styles";
import Modal from "@/components/_ui/modal/Modal";
import AddPlayerHeader from "@/components/views/modals/add-player/AddPlayerHeader";
import AddPlayerBody from "@/components/views/modals/add-player/AddPlayerBody";
import { usePlayersStore } from "@/store/usePlayersStore";
import PlayerIcon from "@/components/_ui/custom-components/PlayerIcon";

interface IPlayerCardProps {
  player: { id: string, firstName: string, lastName: string, color: string }
}

export default function Players() {
  const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState<boolean>(false);
  const players = usePlayersStore((state) => state.players);

  const primary = useThemeColor('primary');

  return (
    <ThemedView style={[Styles.SCREEN_BODY]}>
      <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
        <ThemedText weight="bold" style={{ fontSize: 36, lineHeight: 48 }}>Players</ThemedText>
        <Button
          type="secondary"
          text="Add"
          onPress={() => setIsAddPlayerModalVisible(true)}
          icon="plus"
          iconPlacement="left"
          textStyle={{ color: primary, fontSize: 18 }}
          buttonStyle={{ columnGap: 6 }}
          weight="bold"
        />
      </View>
      <FlatList
        data={players}
        renderItem={({ item }) => (<PlayerCard key={item.id} player={item} />)}
        contentContainerStyle={{ rowGap: 8 }}
      />
      
      {/* Add Player Modal */}
      <Modal visible={isAddPlayerModalVisible} onClose={() => setIsAddPlayerModalVisible(false)} height={'50%'}>
        <Modal.Header>
          <AddPlayerHeader onCloseModal={() => setIsAddPlayerModalVisible(false)} />
        </Modal.Header>
        <Modal.Body>
          <ScrollView>
            <AddPlayerBody onCloseModal={() => setIsAddPlayerModalVisible(false)} />
          </ScrollView>
        </Modal.Body>
      </Modal>
    </ThemedView>
  );
}

function PlayerCard(props: IPlayerCardProps) {
  const backgroundColor = useThemeColor('card');
  const borderColor = useThemeColor('border');
  const muted = useThemeColor('muted');

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        { backgroundColor, borderColor },
        Styles.FLEX_HORIZONTAL_CENTER,
        styles.playerCard,
        { justifyContent: 'flex-start' }
      ]}
    >
      <PlayerIcon player={props.player} size={48} />
      <View style={[Styles.FLEX_COLUMN, { flexGrow: 1, flexShrink: 1, minWidth: 0, paddingHorizontal: 16 }]}>
        <ThemedText weight="bold" style={{ fontSize: 24 }}>
          { props.player.firstName.concat(' ', props.player.lastName) }
        </ThemedText>
        <ThemedText weight="light">42 matches</ThemedText>
      </View>
      <View style={{ flexShrink: 1 }}>
        <FontAwesome name="chevron-right" size={14} color={muted} style={{ opacity: 0.4 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});

// export type ListProps = {
//   data: any[]; // TODO - type restrict this
//   type: "player" | "team";
//   backgroundColor: string;
// };

// // TODO - segregate this somewhere as component is used elsewhere
// export type ListItemProps = {
//   item: any; // TODO - type restrict this
//   type: "player" | "team";
// };

// export default function PlayersScreen() {
//   // Top tab navigator
//   const tabBackgroundColor = useThemeColor('background');
//   const red = useThemeColor("accentRed");
//   const lightgrey = useThemeColor("lightgrey");

//   // Context
//   const { players, teams } = useDataStore();

//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

//   const [list, setList] = useState<Participants>({ players, teams });

//   // Search props & methods
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const displayResetBtn = useRef<boolean>(false);

//   const onAdd = () => setIsModalOpen(true);
//   const onCloseModal = () => setIsModalOpen(false);

//   // Advanced search props & methods
//   const onAdvancedSearch = () => setIsFilterModalOpen(true);
//   const onCloseAdvSearchModal = () => setIsFilterModalOpen(false);
//   const [advSearchType, setAdvSearchType] = useState<string>("all");
//   const [advSearchGender, setAdvSearchGender] = useState<string>("all");
//   const [advSearchCategory, setAdvSearchCategory] = useState<string>("all");

//   const onSearch = () => {
//     if (searchTerm !== "") displayResetBtn.current = true;

//     if (players.length > 0 || teams.length > 0) {
//       const filteredResults = FilterParticipantsByProperty({ name: searchTerm.trim() }, { players, teams });
//       setList(filteredResults);
//     }
//   };

//   const onApplyFilters = () => {
//     if (advSearchType === "all") {
//       displayResetBtn.current = false;
//       setList({ players, teams });
//     }
//     else {
//       displayResetBtn.current = true;
//       const filteredResults = FilterParticipantsByProperty({ type: advSearchType, gender: advSearchGender, teamCategory: advSearchCategory }, { players, teams });
//       setList(filteredResults);
//     }

//     setIsFilterModalOpen(false);
//   };

//   const onReset = () => {
//     displayResetBtn.current = false;
//     setSearchTerm("");
//     setAdvSearchType("all");
//     setAdvSearchGender("all");
//     setAdvSearchCategory("all");
//     setList({ players, teams });
//   };

//   const playersTab = useMemo(() => {
//     return <List data={[...list.players]} type="player" backgroundColor={tabBackgroundColor}/>;
//   }, [list]);
  
//   const teamsTab = useMemo(() => {
//     return <List data={[...list.teams]} type="team" backgroundColor={tabBackgroundColor} />;
//   }, [list]);

//   useEffect(() => {
//     if (players.length > 0) {
//       onReset();
//     }
//   }, [players, teams]);

//   return (
//     <ThemedView style={[Containers.screen, { paddingBottom: 0, paddingHorizontal: 0 }]}>
//       <AddPlayerOptionModal isOpen={isModalOpen} onClose={onCloseModal} />
//       <ParticipantsAdvancedSearchModal
//         isOpen={isFilterModalOpen}
//         onClose={onCloseAdvSearchModal}
//         type={advSearchType}
//         setType={setAdvSearchType}
//         gender={advSearchGender}
//         setGender={setAdvSearchGender}
//         teamCategory={advSearchCategory}
//         setTeamCategory={setAdvSearchCategory}
//         onApplyFilters={onApplyFilters}
//       />
//       <ScreenTitle
//         title="Players"
//         actionBtn={{
//           title: "Add",
//           icon: "plus",
//           iconPosition: "left",
//           onActionBtn: onAdd
//         }}
//         style={{ paddingHorizontal: 32, marginBottom: 0 }}
//       />
//       <View>
//         <View style={{ paddingHorizontal: 32, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", columnGap: 16 }}>
//           <View style={{ flex: 1 }}>
//             <ThemedSearchBar
//               searchTerm={searchTerm}
//               onChangeText={(text: string) => setSearchTerm(text)}
//               onSearch={onSearch}
//               onBlur={() => Keyboard.dismiss()}
//             />
//           </View>
//           <TouchableOpacity onPress={onAdvancedSearch}>
//             <FontAwesome5 name="sliders-h" size={20} color={lightgrey} /> 
//           </TouchableOpacity>
//         </View>
//         {
//           players.length > 0 && displayResetBtn.current &&
//           <View style={{ alignSelf: "center" }}>
//             <SecondaryButton
//               title="Reset All Filters"
//               onPress={onReset}
//               customColor={red}
//             />
//           </View>
//         }
//       </View>
//       {
//         // No filters applied or filters applied and there are both players and teams present
//         (
//           players.length > 0 && 
//           ((list.players.length === players.length && list.teams.length === teams.length) ||
//           (list.players.length > 0 && list.teams.length > 0))
//         ) &&
//         <ThemedTabView
//           tabs={[
//             { label: "Players", screen: playersTab },
//             { label: "Teams", screen: teamsTab }
//           ]}
//         />
//       }
//       {
//         // filters applied and there are only players
//         (players.length > 0 && (list.players.length !== players.length || list.teams.length !== teams.length) && list.teams.length === 0 && list.players.length > 0) &&
//         <View style={{ flex: 1, marginTop: 16 }}>
//           <View style={{ paddingHorizontal: 32 }}>
//             <ThemedText style={[TextStyles.titles.section]}>Players</ThemedText>
//           </View>
//           <View style={{ flex: 1 }}>
//             {playersTab}
//           </View>
//         </View>
//       }
//       {
//         // filters applied and there are only teams
//         (players.length > 0 && teams.length > 0 && (list.players.length !== players.length || list.teams.length !== teams.length) && list.players.length === 0 && list.teams.length > 0) &&
//         <View style={{ flex: 1, marginTop: 16 }}>
//           <View style={{ paddingHorizontal: 32 }}>
//             <ThemedText style={[TextStyles.titles.section]}>Teams</ThemedText>
//           </View>
//           <View style={{ flex: 1 }}>
//             {teamsTab}
//           </View>
//         </View>
//       }
//     </ThemedView>
//   );
// }

// // TODO - segregate this somewhere as component is used elsewhere
// function List({ data, type }: ListProps) {
//   const separatorColor = useThemeColor("itemSeparator");

//   return (
//     <ScrollView style={{ paddingHorizontal: 32 }}>
//       {
//         data.map((d, index) => (
//           <Fragment key={index}>
//             <ListItem item={d} type={type} />
//             { (index < data.length - 1) && <View style={{ width: "100%", height: 0.5, backgroundColor: separatorColor }} /> }
//           </Fragment>
//         ))
//       }
//     </ScrollView>
//   );
// }

// // TODO - segregate this somewhere as component is used elsewhere
// function ListItem({ item, type }: ListItemProps) {
//   const containerStyle = PlayerListItem.itemContainer;

//   const onPress = () => {
//     router.push(`${(item.id.startsWith("t")) ? 'team' : 'player'}/${item.id}` as Href);
//   };

//   return (
//     <TouchableOpacity onPress={onPress} style={[containerStyle]}>
//       {
//         (type === "team") ? <TeamProfileCard team={item} style={{ paddingVertical: 4, flex: 1 }} /> : <PlayerProfileCard player={item} />
//       }
//     </TouchableOpacity>
//   );
// }
