import useThemeColor from "@/hooks/v2/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

interface IPrimaryActionTabButtonProps {
  onPress: () => void;
}

export default function PrimaryActionTabButton({ onPress} : IPrimaryActionTabButtonProps) {
  const primary = useThemeColor('primary');
  const background = useThemeColor('background');

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: primary }]} activeOpacity={0.85}>
      <FontAwesome name="plus" size={32} color={background} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
	button: {
		position: 'absolute',
		top: -30,
		left: '50%',
		transform: [{ translateX: -40 }],
		borderRadius: 24,
		width: 80,
		height: 80,
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
	}
});