import Button from "@/components/_ui/button/Button";
import { usePlayersStore } from "@/store/usePlayersStore";
import { StyleSheet, View } from "react-native";
import * as Crypto from "expo-crypto";
import { useRef } from "react";
import AddPlayerForm from "../../forms/AddPlayerForm";

interface IAddPlayerBodyProps {
  onCloseModal: () => void,
}

export default function AddPlayerBody(props: IAddPlayerBodyProps) {
  const addPlayer = usePlayersStore((state) => state.addPlayer);
  const formRef = useRef(null);

  const handleAddPlayer = () => {
    addPlayer({ ...(formRef.current as any)?.getFormData(), id: Crypto.randomUUID() });
    props.onCloseModal();
  }

  return (
    <View style={[styles.body]}>
      <AddPlayerForm ref={formRef} />
      <View>
        <Button
          type="primary"
          text="Add Player"
          onPress={handleAddPlayer}
          weight='bold'
          textStyle={[styles.buttonText]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 24,
    rowGap: 16
  },
  buttonText: {
    fontSize: 16,
  }
});