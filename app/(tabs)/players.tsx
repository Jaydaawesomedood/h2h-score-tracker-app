import ScreenTitle from "@/components/screens/ScreenTitle";
import ThemedView from "@/components/ThemedView";
import { Containers, PlayerListItem } from "@/constants/styles/Containers";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Player, Team } from "@/models/Player";
import { Href, router, useNavigation } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import AddPlayerOptionModal from "@/components/modals/AddPlayerOptionModal";
import { showErrorToast } from "@/utils/toast.util";
import { DbContext } from "@/utils/context";
import { GetAllPlayersAndTeams } from "@/utils/repositories/PlayerRepository";
import PlayerProfileCard from "@/components/views/players/PlayerProfileCard";
import TeamProfileCard from "@/components/views/players/TeamProfileCard";
import { ThemedTabView } from "@/components/tab-view/ThemedTabView";
import { useIsFocused } from "@react-navigation/native";

export type ListProps = {
  data: any[]; // TODO - type restrict this
  type: "player" | "team";
  backgroundColor: string;
};

// TODO - segregate this somewhere as component is used elsewhere
export type ListItemProps = {
  item: any; // TODO - type restrict this
  type: "player" | "team";
};

export default function PlayersScreen() {
  // Top tab navigator
  const tabBackgroundColor = useThemeColor('background');

  const db = useContext(DbContext);
  // const isFocused = useNavigation().isFocused();
  const isFocused = useIsFocused();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const sortByRecent = (arr: any) => { return arr.slice().sort((a: any, b: any) => a.id.localeCompare(b.id)) };
  const sortByName = (arr: any) => { return arr.slice().sort((a: any, b: any) => a.lastName.localeCompare(b.lastName)) };

  const getAllPlayersAndTeams = async () => {
    if (db) {
      await GetAllPlayersAndTeams(db, setPlayers, setTeams, showErrorToast);
    }
    else {
      showErrorToast();
    }
  };

  const onAdd = () => setIsModalOpen(true);
  const onCloseModal = () => setIsModalOpen(false);

  const renderPlayersTab = () => {
    return <List data={[...players]} type="player" backgroundColor={tabBackgroundColor}/>;
  };

  const renderTeamsTab = () => {
    return <List data={[...teams]} type="team" backgroundColor={tabBackgroundColor} />;
  };

  useEffect(() => {
    if (isFocused) { getAllPlayersAndTeams(); }
  }, [isFocused]);

  return (
    <ThemedView style={[Containers.screen, { paddingBottom: 0, paddingHorizontal: 0 }]}>
      <AddPlayerOptionModal isOpen={isModalOpen} onClose={onCloseModal} />
      <ScreenTitle
        title="Players"
        actionBtn={{
          title: "Add",
          icon: "plus",
          iconPosition: "left",
          onActionBtn: onAdd
        }}
        style={{ paddingHorizontal: 32, marginBottom: 0 }}
      />
      {
        (players.length > 0) &&
        <ThemedTabView
          tabs={[
            { label: "Players", screen: renderPlayersTab() },
            { label: "Teams", screen: renderTeamsTab() }
          ]}
        />
      }
    </ThemedView>
  );
}

// TODO - segregate this somewhere as component is used elsewhere
function List({ data, type }: ListProps) {
  const separatorColor = useThemeColor("itemSeparator");

  return (
    <FlatList
      data={data}
      renderItem={ ({ item }) => <ListItem item={item} type={type} /> }
      ItemSeparatorComponent={() => <View style={{ width: "100%", height: 0.5, backgroundColor: separatorColor }} />}
      style={[{ flex: 1, paddingHorizontal: 32 }]}
    />
  );
}

// TODO - segregate this somewhere as component is used elsewhere
function ListItem({ item, type }: ListItemProps) {
  const containerStyle = PlayerListItem.itemContainer;

  const onPress = () => {
    router.push(`${(item.id.startsWith("t")) ? 'team' : 'player'}/${item.id}` as Href);
  };

  return (
    <TouchableOpacity onPress={onPress} style={[containerStyle]}>
      {
        (type === "team") ? <TeamProfileCard team={item} style={{ paddingVertical: 4, flex: 1 }} /> : <PlayerProfileCard player={item} />
      }
    </TouchableOpacity>
  );
}
