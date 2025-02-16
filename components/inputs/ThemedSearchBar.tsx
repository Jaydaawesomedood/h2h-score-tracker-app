import { StyleSheet, TextInputProps, View } from "react-native";
import ThemedInput from "./ThemedInput";
import PrimaryButton from "../buttons/PrimaryButton";

type Props = TextInputProps & {
  searchTerm: string;
  onSearch: () => void;
  autoSearch?: boolean;
};

export default function ThemedSearchBar({ searchTerm, placeholder, onChangeText, onSearch, onBlur, autoSearch = false }: Props) {
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
      {
        !autoSearch &&
        <PrimaryButton
          title=""
          icon="search"
          onPress={onSearch}
          style={{ borderRadius: 0, paddingHorizontal: 16 }}
        />
      }
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