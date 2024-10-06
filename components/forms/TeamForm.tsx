import { Dispatch, SetStateAction } from "react";
import ThemedDropdown from "../ThemedDropdown";
import ThemedInput from "../ThemedInput";
import { ThemedText } from "../ThemedText";
import { Categories } from "@/models/Categories.enum";
import { Text } from "@/constants/styles/Text";
import { Player } from "@/models/Player";
import { Image, TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedView } from "../ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { AddTeamPlayer, PlayerListItem } from "@/constants/styles/Containers";

type TeamFormProps = {
  teamName: string;
  setTeamName: Dispatch<SetStateAction<string>>;
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  players: Player[];
  onAddTeamPlayer: (index: number) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  dropdownDisabled?: boolean;
  addTeamPlayerDisabled?: boolean;
  onDropdownClose: () => void;
  onKeyboardClose: () => void;
};

type AddTeamPlayerProps = {
  placeholder: string;
  disabled?: boolean;
  onPress: () => void;
  player?: Player;
  containerStyle?: ViewStyle;
};

type PlayerNameProps = {
  player: Player;
}

export default function TeamForm({
  teamName,
  setTeamName,
  category,
  setCategory,
  players,
  onAddTeamPlayer,
  isDropdownOpen,
  setIsDropdownOpen,
  dropdownDisabled,
  addTeamPlayerDisabled,
  onDropdownClose,
  onKeyboardClose
}: TeamFormProps) {

  // Styling
  const inputLabelStyle = Text.inputLabel;

  return (
    <>
      <ThemedInput
        value={teamName}
        setValue={setTeamName}
        placeholder="Enter team name"
        label="Team Name"
        labelStyle={inputLabelStyle}
        containerStyle={{ marginBottom: 24 }}
        onFocus={onDropdownClose}
      />
      <ThemedDropdown
        value={category}
        setValue={setCategory}
        options={
          Object.entries(Categories)
          .filter(([key, value]) => !value.includes("Single"))
          .map(([key, value]) => ({ label: value, value: key.toLowerCase() }))
        }
        placeholder="Select team category"
        isOpen={isDropdownOpen}
        setIsOpen={setIsDropdownOpen}
        disabled={dropdownDisabled}
        onPress={onKeyboardClose}
        label="Team Category"
        labelStyle={inputLabelStyle}
        containerStyle={{ marginBottom: 24 }}
      />
      <ThemedText style={[inputLabelStyle, { marginBottom: 24 }]}>Players</ThemedText>
      <AddTeamPlayerInput
        placeholder="Add Player 1"
        disabled={addTeamPlayerDisabled}
        onPress={() => { onAddTeamPlayer(1); }}
        player={players[0] ?? undefined}
        containerStyle={{ marginBottom: 24 }}
      />
      {
        players.length >= 1 ?
        <AddTeamPlayerInput
          placeholder="Add Player 2"
          disabled={addTeamPlayerDisabled}
          onPress={() => { onAddTeamPlayer(2); }}
          player={players[1] ?? undefined}
          containerStyle={{ marginBottom: 32 }}
        />
        : null
      }
    </>
  );
}

function AddTeamPlayerInput({ placeholder, disabled = false, onPress, player, containerStyle }: AddTeamPlayerProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <ThemedView style={[AddTeamPlayer.container, containerStyle, { opacity: disabled ? 0.4 : 1 }]}>
        {
          !player ?
          <View style={AddTeamPlayer.placeholderContainer}>
            <FontAwesome name="plus-circle" size={28} color={"grey"} />
            <ThemedText style={[Text.addTeamPlayerInput, { color: "grey" }]}>{placeholder}</ThemedText>
          </View>
          :
          <View style={[PlayerListItem.itemContainer, { flex: 1, paddingVertical: 0 }]}>
            <Image
              source={require('../../assets/images/placeholder-avatar.png')}
              style={{ borderRadius: 40, height: 40, width: 40 }}
            />
            <PlayerName player={player} />
          </View>
        }
      </ThemedView>
    </TouchableOpacity>
  );
}

function PlayerName({ player }: PlayerNameProps) {
  const flexDirection = (player.lastNameFirst) ? "row-reverse" : "row";
  const justifyContent = (player.lastNameFirst) ? "flex-end" : "flex-start";

  const textStyle = Text.listItem;

  return (
    <ThemedView style={[{ flexDirection, justifyContent }]}>
      <ThemedText numberOfLines={1} style={textStyle}>{player.firstName}{player.lastNameFirst ? "" : " "}</ThemedText>
      <ThemedText numberOfLines={1} style={[textStyle, { fontFamily: "LeagueSpartanBold" }]}>{player.lastName}{player.lastNameFirst ? " " : ""}</ThemedText>
    </ThemedView>
  );
}
