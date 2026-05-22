import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { PropsWithChildren, ReactNode } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

type SelectableOptionProps = PropsWithChildren & {
  selected: boolean,
  onPress: () => void,
  renderLeftSegment?: () => ReactNode,
  renderContent?: () => ReactNode,
  containerStyle?: StyleProp<ViewStyle>,
  type?: 'primary' | 'secondary',
};

export default function SelectableOption({ children, ...props }: SelectableOptionProps) {
  const primary = useThemeColor('primary');
  const secondary = useThemeColor('secondary');
  const background = useThemeColor('card');
  const unselected = useThemeColor('border');

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={[
        styles.card,
        props.containerStyle,
        {
          borderColor: props.selected ? (props.type === 'secondary' ? secondary : primary) : unselected,
          backgroundColor: background 
        }
      ]}
    >
      {
        props.renderLeftSegment &&
        <View style={{ width: '20%' }}>
          {props.renderLeftSegment()}
        </View>
      }
      { 
        props.renderContent && 
        <View style={[{ flex: 1, flexShrink: 1 }]}>
          {props.renderContent()}
        </View>
      }
      <View 
        style={[
          styles.selectorIcon,
          props.selected ? { backgroundColor: props.type === 'secondary' ? secondary : primary } : { borderWidth: 2, borderColor: unselected }
        ]}
      ></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...Styles.FLEX_HORIZONTAL_CENTER,
    justifyContent: 'flex-start',
    borderWidth: 4,
    borderStyle: 'solid',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  selectorIcon: {
    borderRadius: '100%',
    minWidth: 10,
    aspectRatio: 1 / 1,
  }
});