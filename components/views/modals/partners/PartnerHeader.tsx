import Button from "@/components/_ui/button/Button";
import ThemedText from "@/components/_ui/ThemedText";
import { Styles } from "@/constants/v2/Styles";
import { StyleSheet, View } from "react-native";

interface IPartnerHeaderProps {
  onCloseModal: () => void,
}

export default function PartnerHeader(props: IPartnerHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText weight="bold" style={{ fontSize: 24 }}>Partners</ThemedText>
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