import { Player } from "@/models/Player";
import ThemedText from "../ThemedText";
import { bold, Text, TextStyles } from "@/constants/styles/Text";
import { TextStyle, View, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface NameSettings {
  bold?: boolean; // Specifies whether the text should be in bold
  colorize?: boolean; // Specifies whether the text should have primary color applied
  truncate?: boolean; // Specifies whether the text should only display first character
};

type PlayerNameProps = {
  player: Player;
  isVertical?: boolean;
  firstNameSettings?: NameSettings;
  lastNameSettings?: NameSettings;
  textStyle?: TextStyle;
};

export default function PlayerName({
  player,
  isVertical = false,
  firstNameSettings = { bold: false, colorize: false, truncate: false },
  lastNameSettings = { bold: true, colorize: false, truncate: false },
  textStyle,
}: PlayerNameProps) {
  const containerStyle: ViewStyle = isVertical ?
  {
    alignItems: "center",
    flex: 1,
    flexDirection: (player.lastNameFirst) ? "column-reverse" : "column",
    // rowGap: 8,
  } :
  {
    flexDirection: (player.lastNameFirst) ? "row-reverse" : "row",
    justifyContent: (player.lastNameFirst) ? "flex-end" : "flex-start",
  };

  const style = textStyle ?? TextStyles.content.main;

  const isBold = (settings: NameSettings) => settings.bold ? { fontFamily: bold } : {};
  const isTruncated = (name: string, settings: NameSettings) => settings.truncate ? name.split(" ").map((name: string) => name[0]).join(" ") : name;
  const color = useThemeColor("primary");

  return (
    <View style={[containerStyle]}>
      <ThemedText
        numberOfLines={1}
        style={[
          style, 
          firstNameSettings.colorize && { color }, 
          isBold(firstNameSettings),
        ]}>
          {isTruncated(player.firstName, firstNameSettings)}{!isVertical && (player.lastNameFirst ? "" : " ")}
      </ThemedText>
      <ThemedText
        numberOfLines={1} 
        style={[
          style,
          lastNameSettings.colorize && { color },
          isBold(lastNameSettings)
        ]}>
          {isTruncated(player.lastName, lastNameSettings)}{!isVertical && (player.lastNameFirst ? " " : "")}
      </ThemedText>
    </View>
  );
};