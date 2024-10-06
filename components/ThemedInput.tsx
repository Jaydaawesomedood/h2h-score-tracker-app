import { Text } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dispatch, SetStateAction, useState } from "react";
import { TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedInputProps = TextInputProps & {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  label?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

export default function ThemedInput({ placeholder, style, value, setValue, label, labelStyle, containerStyle, ...props }: ThemedInputProps) {
  const inputStyle = Text.input;
  const backgroundColor = useThemeColor('input');
  const placeholderColor = useThemeColor('inputPlaceholder');
  const color = useThemeColor('text');
  
  return (
    <View style={containerStyle}>
      <ThemedText style={labelStyle}>{label}</ThemedText>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={setValue}
        style={[
          { backgroundColor, color },
          style,
          inputStyle
        ]}
        { ...props }
      />
    </View>
  );
}