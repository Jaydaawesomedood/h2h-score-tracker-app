import { FontAwesome } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { ComponentProps } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { Modals } from "@/constants/styles/Containers";
import { TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeStore } from "@/utils/context";

// TODO - Reorganize this as its duplicating elsewhere
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type OptionProps = {
  icon: ComponentProps<typeof FontAwesome>["name"];
  title: string;
  subtitle: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function AddPlayerOptionModal({ isOpen, onClose }: ModalProps) {
  // Styling
  const contentBackgroundColor = useThemeColor("background");
  const addPlayerBackgroundColor = useThemeColor("addPlayerBackground");
  const addTeamBackgroundColor = useThemeColor("addTeamBackground");

  const onAddPlayer = () => {
    onClose();
    router.push("player/add" as Href); 
  };

  const onAddTeam = () => {
    onClose();
    router.push("team/add" as Href);
  };

  return (
    <View>
      <Modal animationType="none" transparent={true} visible={isOpen} onRequestClose={onClose}>
        <View style={[styles.modal.container]}>
          <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor }]}>
            <View style={Modals.titleContainer}>
              <ThemedText style={TextStyles.titles.screen}>Add</ThemedText>
              <SecondaryButton title="Close" onPress={onClose} />
            </View>
            <View style={{ rowGap: 16 }}>
              <Option icon="user" title="Add Player" subtitle="Add an individual player" onPress={onAddPlayer} style={{ backgroundColor: addPlayerBackgroundColor }} />
              <Option icon="users" title="Add Team" subtitle="Add a team by grouping players together" onPress={onAddTeam} style={{ backgroundColor: addTeamBackgroundColor }} />
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}


function Option({ icon, title, subtitle, onPress, style }: OptionProps) {
  const { isLightMode } = useThemeStore();
  const textColor = useThemeColor(isLightMode ? "textFlipped" : "text");

  return (
    <TouchableOpacity onPress={onPress} style={[styles.option.container, style]}>
      <View style={styles.option.iconWrapper}>
        <FontAwesome name={icon} size={32} color={"white"}></FontAwesome>
      </View>
      <View style={styles.option.contentWrapper}>
        <ThemedText numberOfLines={1} style={[TextStyles.controls.buttons.primary, { color: textColor }]}>{title}</ThemedText>
        <ThemedText numberOfLines={1} style={[TextStyles.descriptions.small, { color: textColor }]}>{subtitle}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  modal: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
  }),
  option: StyleSheet.create({
    container: {
      alignItems: "center",
      borderRadius: 16,
      columnGap: 8,
      flexDirection: "row",
      paddingVertical: 16,
    },
    iconWrapper: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 50,
    },
    contentWrapper: {
      flex: 1,
      marginLeft: 8,
    },
  }),
};