import { FontAwesome } from "@expo/vector-icons";
import { View, ViewProps } from "react-native";

export default function ActionButton({ style }: ViewProps) {
  return (
    <View style={style}>
      <FontAwesome name="plus" color={"white"} size={28} />
    </View>
  );
}