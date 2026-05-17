import { FontAwesome } from "@expo/vector-icons";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

interface IPrimaryActionTabButtonProps {
  onPress: () => void;
}

export default function PrimaryActionTabButton({ onPress} : IPrimaryActionTabButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.85}>
      <FontAwesome name="plus" size={32} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
	button: {
		position: 'absolute',
		top: -20,
		left: '50%',
		transform: [{ translateX: -40 }],
		backgroundColor: '#4F46E5',
		borderRadius: 24,
		width: 80,
		height: 80,
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
	}
});