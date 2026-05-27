import { FontAwesome6 } from "@expo/vector-icons";
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";

interface IButtonProps {
  text: string,
  type?: 'primary' | 'secondary',
  icon?: string,
  iconPlacement?: 'left' | 'right',
  disabled?: boolean,
  onPress: () => void,
  buttonStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
  weight?: 'light' | 'regular' | 'bold',
}

export default function Button(props: IButtonProps) {
  const color = useThemeColor('muted');
  const primary = useThemeColor('primary');
  const primaryDisabled = useThemeColor('primaryDisabled');

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={props.disabled}
      style={[
        styles[props.type ?? 'primary'],
        props.type === 'primary' && { backgroundColor: props.disabled ? primaryDisabled : primary, display: 'flex', alignItems: 'center', justifyContent: 'center' },
        props.buttonStyle,
        props.iconPlacement === 'right' && { flexDirection: 'row-reverse' },
      ]}
      onPress={props.onPress}
    >
      {
        props.icon && 
        <FontAwesome6
          name={props.icon}
          color={ props.textStyle ? StyleSheet.flatten(props.textStyle)?.color : props.type === 'secondary' ? color : 'white' }
          size={props.textStyle ? StyleSheet.flatten(props.textStyle)?.fontSize : 16}
        />
      }
      <ThemedText
        weight={props.weight ?? 'regular'}
        style={[
          props.type === 'secondary' && { color },
          props.textStyle,
        ]}
      >
        {props.text}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    ...Styles.FLEX_HORIZONTAL_SIDE,
    borderRadius: 8,
    paddingVertical: 8,
  },
  secondary: {
    ...Styles.FLEX_HORIZONTAL_SIDE
  },
});