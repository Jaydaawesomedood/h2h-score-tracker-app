import SecondaryButton from "@/components/buttons/SecondaryButton";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { AddOption, Modals } from "@/constants/styles/Containers";
import { Text } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { ComponentProps } from "react";
import { Modal, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

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
      <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose} style={{ zIndex: 20 }}>
        <View style={[styles.modal]}>
          <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor }]}>
            <View style={Modals.titleContainer}>
              <ThemedText style={Text.screenTitle}>Add</ThemedText>
              <SecondaryButton title="Close" onPress={onClose} />
            </View>
            <View>
              {/* TODO - Segregare colors */}
              <Option icon="user" title="Add Player" subtitle="Add an individual player" onPress={onAddPlayer} style={{ backgroundColor: "#5d6f99" }} />
              <Option icon="users" title="Add Team" subtitle="Add a team by grouping players together" onPress={onAddTeam} style={{ marginTop: 16, backgroundColor: "#99895d" }} />
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}


function Option({ icon, title, subtitle, onPress, style }: OptionProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[AddOption.container, style]}>
      <View style={AddOption.iconContainer}>
        <FontAwesome name={icon} size={32} color={"white"}></FontAwesome>
      </View>
      <View style={AddOption.textContainer}>
        <ThemedText numberOfLines={1} style={Text.primaryBtnTitle}>{title}</ThemedText>
        <ThemedText numberOfLines={1} style={Text.message}>{subtitle}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modal: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    // zIndex: 10,
  },
});