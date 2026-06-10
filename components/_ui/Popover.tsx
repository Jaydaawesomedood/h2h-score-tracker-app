import useThemeColor from "@/hooks/v2/useThemeColor";
import { Dispatch, PropsWithChildren, RefObject, SetStateAction } from "react";
import { Dimensions, Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

type IPopoverProps = PropsWithChildren & {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>,
  anchor: RefObject<View | null>
}

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

export default function Popover({ children, ...props }: IPopoverProps) {
  const backgroundColor = useThemeColor('input');

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="none"
      onRequestClose={() => props.setVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => props.setVisible(false)}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.popover,
          props.anchor && props.anchor.current && {
            ...(
              props.anchor.current.getBoundingClientRect().y >= SCREEN_HEIGHT / 2 ? 
              {
                bottom: SCREEN_HEIGHT - (props.anchor.current.getBoundingClientRect().y ?? 0) + 8
              }
              : 
              {
                top: (props.anchor.current.getBoundingClientRect().y ?? 0) + (props.anchor.current.getBoundingClientRect().height ?? 0) + 8,
              }
            ),
            left: props.anchor.current?.getBoundingClientRect().x
          },
          { backgroundColor },
        ]}
      >
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popover: {
    position: 'absolute',
    zIndex: 50,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8
  }
});