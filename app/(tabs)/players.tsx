import ScreenTitle from "@/components/screens/ScreenTitle";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Containers, PlayerListItem, TopTab } from "@/constants/styles/Containers";
import { Text } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Player, Team } from "@/models/Player";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleProp, TextStyle, TouchableOpacity, View } from "react-native";
import { DbContext } from "../_layout";
import { GetAllPlayers, GetAllTeams } from "@/utils/database/database";
import AddPlayerOptionModal from "@/components/modals/AddPlayerOptionModal";
import { showErrorToast } from "@/utils/toast.util";
import PlayerName from "@/components/text/PlayerName";

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
  const Tab = createMaterialTopTabNavigator();
  const tabLabelStyle = Text.topTabLabel as StyleProp<TextStyle>;
  const tabBackgroundColor = useThemeColor('background');
  const tabIndicatorColor = useThemeColor('primary');

  // const onAddPlayer = () => { router.push("/add-player"); };

  const db = useContext(DbContext);
  const isFocused = useIsFocused();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const sortByRecent = (arr: any) => { return arr.slice().sort((a: any, b: any) => a.id.localeCompare(b.id)) };
  const sortByName = (arr: any) => { return arr.slice().sort((a: any, b: any) => a.lastName.localeCompare(b.lastName)) };

  const getAllPlayersAndTeams = async () => {
    if (db) {
      await GetAllPlayers(db)
      .then((allPlayers: Player[]) => {
        if (allPlayers && allPlayers.length > 0) {
          setPlayers([...allPlayers]);
        }
        else {
          setPlayers([]);
        }
      })
      .catch((error: any) => {
        showErrorToast();
      });

      await GetAllTeams(db)
      .then((allTeams: Team[]) => {
        if (allTeams && allTeams.length > 0) {
          setTeams([...allTeams]);
        }
        else {
          setTeams([]);
        }
      })
      .catch((error: any) => {
        showErrorToast();
      })
    }
    else {
      showErrorToast();
    }
  };

  const onAdd = () => setIsModalOpen(true);
  const onCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isFocused) getAllPlayersAndTeams();
  }, [isFocused]);

  return (
    <ThemedView style={[Containers.screen, { paddingBottom: 0 }]}>
      <AddPlayerOptionModal isOpen={isModalOpen} onClose={onCloseModal} />
      <ScreenTitle
        title="Players"
        actionBtn={{
          title: "Add",
          icon: "plus",
          iconPosition: "left",
          onActionBtn: onAdd
        }}
      />
      {
        (players.length > 0) ? 
        <Tab.Navigator
          screenOptions={{
            swipeEnabled: false,
            tabBarIndicatorContainerStyle: { zIndex: 5 },
            tabBarIndicatorStyle: { backgroundColor: tabIndicatorColor },
            tabBarItemStyle: { backgroundColor: tabBackgroundColor },
            tabBarLabelStyle: tabLabelStyle,
          }}
        >
          <Tab.Screen name="Players" children={() => (
            <List data={[...players]} type="player" backgroundColor={tabBackgroundColor}/>
          )} />
          <Tab.Screen name="Teams" children={() => (
            <List data={[...teams]} type="team" backgroundColor={tabBackgroundColor} />
          )} />
        </Tab.Navigator>
        : null
      }
    </ThemedView>
  );
}

// TODO - segregate this somewhere as component is used elsewhere
function List({ data, type, backgroundColor }: ListProps) {
  const separatorColor = useThemeColor("itemSeparator");

  return (
    <FlatList
      data={data}
      renderItem={ ({ item, index, separators }) => <ListItem item={item} type={type} /> }
      ItemSeparatorComponent={() => <View style={{ width: "100%", height: 0.5, backgroundColor: separatorColor }} />}
      style={[{ backgroundColor }, TopTab.topTabList]}
    />
  );
}

// TODO - segregate this somewhere as component is used elsewhere
function ListItem({ item, type }: ListItemProps) {
  const containerStyle = PlayerListItem.itemContainer;
  const teamTextContainerStyle = PlayerListItem.teamTextContainer;

  const textStyle = Text.listItem;

  const onPress = () => {
    router.push({
      pathname: (item.id.startsWith("t")) ? "/(profiles)/team" : "/(profiles)/player",
      params: { id: item.id }
    });
  };

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      {
        (type === "team") ?
        <View>
          <View style={[teamTextContainerStyle]}>
            <PlayerName player={item.players[0]} />
            <ThemedText style={textStyle}> / </ThemedText> 
            <PlayerName player={item.players[1]} />
          </View>
          { (item.name) ? <ThemedText style={Text.listSubtitle}>{item.name}</ThemedText> : null }
        </View>
        :
        <>
          <Image
            source={require('../../assets/images/placeholder-avatar.png')}
            style={{ borderRadius: 40, height: 40, width: 40 }}
          />
          <PlayerName player={item} />
        </>
      }
    </TouchableOpacity>
  );
}
