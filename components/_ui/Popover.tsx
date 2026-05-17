import useThemeColor from "@/hooks/v2/useThemeColor";
import { Dispatch, PropsWithChildren, RefObject, SetStateAction } from "react";
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

type IPopoverProps = PropsWithChildren & {
  visible: boolean,
  setVisible: Dispatch<SetStateAction<boolean>>,
  anchor: RefObject<View | null>
}

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
          props.anchor && {
            top: (props.anchor.current?.getBoundingClientRect().y ?? 0) + (props.anchor.current?.getBoundingClientRect().height ?? 0) + 8,
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