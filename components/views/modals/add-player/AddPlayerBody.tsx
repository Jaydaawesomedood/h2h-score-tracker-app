import Button from "@/components/_ui/button/Button";
import { usePlayersStore } from "@/store/usePlayersStore";
import { StyleSheet, View } from "react-native";
import { useRef } from "react";
import PlayerForm from "../../forms/AddPlayerForm";

interface IAddPlayerBodyProps {
  onCloseModal: () => void,
}

export default function AddPlayerBody(props: IAddPlayerBodyProps) {
  const addPlayer = usePlayersStore((state) => state.addPlayer);
  const formRef = useRef(null);

  const handleAddPlayer = () => {
    const form = formRef.current as any;

    if (form && form.validateForm()) {
      addPlayer({ ...form.getFormData() });
      props.onCloseModal();
    }
  }

  return (
    <View style={[styles.body]}>
      <PlayerForm ref={formRef} />
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