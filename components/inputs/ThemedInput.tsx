import { Text } from "@/constants/styles/Text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dispatch, SetStateAction, useState } from "react";
import { TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";

export type ThemedInputProps = TextInputProps & {
  value: string;
  label?: string;
  labelStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

export default function ThemedInput({ placeholder, style, value, onChangeText, label, labelStyle, containerStyle, ...props }: ThemedInputProps) {
  const inputStyle = Text.input;
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
          style,
          inputStyle
        ]}
        { ...props }
      />
    </View>
  );
}