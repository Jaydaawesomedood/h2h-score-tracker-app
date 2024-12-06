import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";
import { ThemedView } from "../ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { light, medium } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useContext, useEffect, useRef } from "react";
import { AddMatchContext } from "@/utils/context";
import { Player, Team } from "@/models/Player";
import PlayerProfileCard from "../views/players/PlayerProfileCard";
import TeamProfileCard from "../views/players/TeamProfileCard";
import { BorderDebug } from "@/constants/styles/Containers";

type Props = ViewProps & {
  placeholder: string; // Placeholder text for the input
  disabled?: boolean; // Specify if input is disabled (Cannot be pressed)
  onPress: () => void; // Method to execute on input is pressed
  index: number; // Index of this input field
};

export default function SelectPlayerInput({ placeholder, disabled = false, onPress, style, index }: Props) {
  const { category, teams } = useContext(AddMatchContext);
  const categoryRef = useRef<string>(category);
  
  const color = useThemeColor("inputPlaceholder");

  /**
   * This useEffect (along with categoryRef variable above) is to prevent that brief moment after another selection in the dropdown is selected where the other category details are shown.
   * E.g., After choosing a team in doubles, when user switches to singles, there is a brief moment where the player image will appear before clearing the teams data.
   * The categoryRef variable acts something like a 'delay' to only switch to the placeholder after the teams data is cleared
   * Flow - setCategory -> re-render -> setTeams -> re-render -> on teams value change, update category ref value to latest
   */
  useEffect(() => { categoryRef.current = category; }, [teams]);
  
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <ThemedView style={[styles.container, style, { opacity: disabled ? 0.4 : 1 }]}>
        {
          teams[index] ?
          categoryRef.current === "doubles" ? <TeamProfileCard team={teams[index] as Team} /> : <PlayerProfileCard player={teams[index] as Player} />
          :
          <View style={styles.placeholderContainer}>
            <FontAwesome name="plus-circle" size={28} color={color} />
            <ThemedText style={[styles.placeholderText, { color }]}>{placeholder}</ThemedText>
          </View>
        }
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "grey",
    borderRadius: 8,
    borderStyle: "dotted",
    borderWidth: 4,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexGrow: 1
  },
  placeholderContainer: {
    alignItems: "center",
    columnGap: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  placeholderText: {
    fontFamily: light,
    fontSize: medium,
  },
});