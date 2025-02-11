import { StyleSheet, TextInputProps, View } from "react-native";
import ThemedInput from "./ThemedInput";
import PrimaryButton from "../buttons/PrimaryButton";
import { BorderDebug } from "../../constants/styles/Containers"

type Props = TextInputProps & {
  searchTerm: string;
  onSearch: () => void;
};

export default function ThemedSearchBar({ searchTerm, placeholder, onChangeText, onSearch, onBlur }: Props) {
  return (
    <View style={[styles.container]}>
      <ThemedInput
        value={searchTerm}
        onChangeText={onChangeText}
        placeholder={placeholder ?? "Search"}
        style={{ borderRadius: 0 }}
        containerStyle={{ flex: 1 }}
        onBlur={onBlur}
      />
      <PrimaryButton
        title=""
        icon="search"
        onPress={onSearch}
        style={{ borderRadius: 0, paddingHorizontal: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    flexDirection: "row",
    overflow: "hidden",
  }
});