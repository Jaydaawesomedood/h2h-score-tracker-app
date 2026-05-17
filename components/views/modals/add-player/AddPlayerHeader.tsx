import Button from "@/components/_ui/button/Button";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import { View, StyleSheet } from "react-native";

interface IAddPlayerHeaderProps {
  onCloseModal: () => void,
}

export default function AddPlayerHeader(props: IAddPlayerHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText weight="bold" style={{ fontSize: 24 }}>Add Player</ThemedText>
      <Button type="secondary" text="Cancel" onPress={props.onCloseModal} />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    paddingHorizontal: 24,
    ...Styles.FLEX_HORIZONTAL_SIDE
  },
});