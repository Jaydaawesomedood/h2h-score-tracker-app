import Button from "@/components/_ui/button/Button";
import PopupModal from "@/components/_ui/modal/PopupModal";
import ThemedText from "@/components/_ui/ThemedText";
import ThemedView from "@/components/_ui/ThemedView";
import PlayerForm from "@/components/views/forms/AddPlayerForm";
import ScreenHeader from "@/components/views/headers/ScreenHeader";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Player } from "@/models/v2/data/Player";
import { usePlayersStore } from "@/store/usePlayersStore";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useShallow } from "zustand/react/shallow";

export default function EditPlayerScreen() {
  const deleteColor = useThemeColor('red');
  const { id } = useLocalSearchParams();

  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

  const formRef = useRef(null);

  const player = usePlayersStore(
    useShallow(state => state.players.find(player => player.id === id))
  );

  const updatePlayer = usePlayersStore(state => state.updatePlayer);
  const deletePlayer = usePlayersStore(state => state.removePlayer);

  const handleSaveChanges = () => {
    const form = formRef.current as any;
    if (!form || !player) return;

    if (form.validateForm()) {
      updatePlayer(({ ...player, ...form.getFormData()}) as Player);
      router.back();
    }
  }

  const handleDelete = async () => {
    const success = await deletePlayer(id as string);

    if (success) {
      setIsDeleteModalVisible(false);
      router.dismissTo('/(tabs)/players');
    }
  }
  
  const renderDeleteButton = () => {
    if (player?.isMe) return (<></>);

    return (
      <Button
        text=""
        onPress={() => setIsDeleteModalVisible(true)}
        type="secondary"
        icon="trash"
        iconPlacement="left"
        buttonStyle={{ columnGap: 8, paddingHorizontal: 4 }}
        textStyle={{ color: deleteColor, fontSize: 18 }}
      />
    );
  }

  const handleOnFormChange = () => {
    if (!formRef.current || !player) return;

    const formData = (formRef.current as any).getFormData();
    let disabled = true;

    for(const key of Object.keys(formData)) {
      if (formData[key] !== (player as any)[key]) {
        disabled = false;
        break;
      }
    }

    setIsSaveDisabled(disabled);
  }

  return (
    <ThemedView style={[ Styles.SCREEN_BODY]}>
      <ScrollView contentContainerStyle={{ rowGap: 24 }}>
        <ScreenHeader
          renderActionButton={renderDeleteButton}
        />
        <ThemedText weight="bold" style={{ fontSize: 32 }}>Edit Player</ThemedText>
        <PlayerForm
          player={player}
          onFormChange={handleOnFormChange}
          ref={formRef}
        />
        <Button
          text="Save Changes"
          onPress={handleSaveChanges}
          type="primary"
          weight="bold"
          textStyle={{ fontSize: 16 }}
          disabled={isSaveDisabled}
        />
      </ScrollView>

      <PopupModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
      >
        <PopupModal.Body>
          <View style={{ rowGap: 8 }}>
            <ThemedText style={{ fontSize: 18 }}>Are you sure you want to delete this player?</ThemedText>
            <ThemedText weight="light">All matches involving this player will be deleted!</ThemedText>
          </View>
        </PopupModal.Body>
        <PopupModal.Footer>
          <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
            <Button
              type="secondary"
              text="Cancel"
              onPress={() => setIsDeleteModalVisible(false)}
              buttonStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <Button
              type="primary"
              text="Yes, delete"
              onPress={handleDelete}
              buttonStyle={{ flex: 1, backgroundColor: deleteColor }}
              weight="bold"
            />
          </View>
        </PopupModal.Footer>
      </PopupModal>
    </ThemedView>
  );
}