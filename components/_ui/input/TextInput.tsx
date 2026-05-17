import ThemedText from "@/components/ThemedText";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Fragment, PropsWithChildren } from "react";
import { TextInput as RNTextInput, StyleSheet, TextInputProps, TextProps } from "react-native";

type ITextInputProps = TextInputProps & {};

function TextInput(props: PropsWithChildren) {
  return (
    <Fragment>{props.children}</Fragment>
  );
}

function TextInputLabel(props: TextProps) {
  return (
    <ThemedText {...props}>{props.children}</ThemedText>
  );
}

function TextInputControl(props: ITextInputProps) {
  const backgroundColor = useThemeColor('input');
  const color = useThemeColor('inputPlaceholder');
  const textColor = useThemeColor('text');

  return (
    <RNTextInput
      {...props}
      style={[{ backgroundColor, color: textColor, fontFamily: 'LeagueSpartanRegular' }, styles.container, props.style]}
      placeholderTextColor={color}
    />
  );
}

TextInput.Label = TextInputLabel;
TextInput.Control = TextInputControl;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  }
});

export default TextInput;