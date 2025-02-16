import { Dispatch, SetStateAction } from "react";
import ThemedDropdown from "../inputs/ThemedDropdown";
import ThemedInput from "../inputs/ThemedInput";
import ThemedText from "../ThemedText";
import { Categories } from "@/models/Categories.enum";
import { Text, TextStyles } from "@/constants/styles/Text";
import { Player } from "@/models/Player";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import ThemedView from "../ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { AddTeamPlayer } from "@/constants/styles/Containers";
import PlayerProfileCard from "../views/players/PlayerProfileCard";
import React from "react";

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
  const inputLabelStyle = TextStyles.controls.input.label;

  return (
    <>
      <ThemedInput
        value={teamName}
        onChangeText={(text: string) => setTeamName(text)}
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
        containerStyle={{ marginBottom: 24 }}
      />
      <ThemedText style={[inputLabelStyle, { marginBottom: 24 }]}>Players</ThemedText>
      <AddTeamPlayerInput
        placeholder="Add Player 1"
        disabled={addTeamPlayerDisabled}
        onPress={() => { onAddTeamPlayer(1); }}
        player={players[0] ?? undefined}
      />
      {
        players.length >= 1 ?
        <AddTeamPlayerInput
          placeholder="Add Player 2"
          disabled={addTeamPlayerDisabled}
          onPress={() => { onAddTeamPlayer(2); }}
          player={players[1] ?? undefined}
          containerStyle={{ marginTop: 24 }}
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
            <ThemedText style={[TextStyles.descriptions.medium, { color: "grey" }]}>{placeholder}</ThemedText>
          </View>
          :
          <PlayerProfileCard player={player} />
        }
      </ThemedView>
    </TouchableOpacity>
  );
};
