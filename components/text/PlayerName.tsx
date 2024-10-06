import { Player } from "@/models/Player";
import { ThemedText } from "../ThemedText";
import { Text } from "@/constants/styles/Text";
import { View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface NameSettings {
  bold?: boolean;
  colorize?: boolean;
  truncate?: boolean;
};

export type PlayerNameProps = {
  player: Player;
  firstNameSettings?: NameSettings;
  lastNameSettings?: NameSettings;
}

export default function PlayerName({ player, firstNameSettings = { bold: false, colorize: false, truncate: false }, lastNameSettings = { bold: true, colorize: false, truncate: false } }: PlayerNameProps) {
  const flexDirection = (player.lastNameFirst) ? "row-reverse" : "row";
  const justifyContent = (player.lastNameFirst) ? "flex-end" : "flex-start";

  const textStyle = Text.listItem;
  const isBold = (settings: NameSettings) => settings.bold ? { fontFamily: "LeagueSpartanBold" } : {};
  const isTruncated = (name: string, settings: NameSettings) => settings.truncate ? name.split(" ").map((name: string) => name[0]).join(" ") : name;
  const color = useThemeColor("primary");

  return (
    <View style={[{ flexDirection, justifyContent }]}>
      <ThemedText numberOfLines={1} style={[textStyle, firstNameSettings.colorize ? { color } : {}, isBold(firstNameSettings)]}>{isTruncated(player.firstName, firstNameSettings)}{player.lastNameFirst ? "" : " "}</ThemedText>
      <ThemedText numberOfLines={1} style={[textStyle, lastNameSettings.colorize ? { color }: {}, isBold(lastNameSettings)]}>{isTruncated(player.lastName, lastNameSettings)}{player.lastNameFirst ? " " : ""}</ThemedText>
    </View>
  );
}