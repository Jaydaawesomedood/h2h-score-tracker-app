import { TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import { ContainerStyles } from "@/constants/styles/Containers";
import { TextStyles } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedInputProps = TextInputProps & {
  value: string;
  label?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

export default function ThemedInput({ placeholder, style, value, onChangeText, label, labelStyle, containerStyle, ...props }: ThemedInputProps) {
  const backgroundColor = useThemeColor('input');
  const placeholderColor = useThemeColor('inputPlaceholder');
  const color = useThemeColor('text');
  
  return (
    <View style={containerStyle}>
      { label ? <ThemedText style={labelStyle}>{label}</ThemedText> : null }
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        style={[
          { backgroundColor, color },
          ContainerStyles.controls.input,
          TextStyles.controls.input.form,
          style,
        ]}
        { ...props }
      />
    </View>
  );
}