import SecondaryButton from "@/components/buttons/SecondaryButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AddOption, Modals } from "@/constants/styles/Containers";
import { Text } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { ComponentProps } from "react";
import { Modal, TouchableOpacity, View, ViewStyle } from "react-native";

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
    router.push("/add-player"); 
  };

  const onAddTeam = () => {
    onClose();
    router.push("/add-team");
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={Modals.backdrop}>
        <ThemedView style={[Modals.content, { backgroundColor: contentBackgroundColor }]}>
          <View style={Modals.titleContainer}>
            <ThemedText style={Text.screenTitle}>Add</ThemedText>
            <SecondaryButton title="Close" onPress={onClose} />
          </View>
          <ThemedView>
            {/* TODO - Segregare colors */}
            <Option icon="user" title="Add Player" subtitle="Add an individual player" onPress={onAddPlayer} style={{ backgroundColor: "#5d6f99" }} />
            <Option icon="users" title="Add Team" subtitle="Add a team by grouping players together" onPress={onAddTeam} style={{ marginTop: 16, backgroundColor: "#99895d" }} />
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
    
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
}