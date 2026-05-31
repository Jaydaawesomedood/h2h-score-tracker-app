import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Fragment, PropsWithChildren } from "react";
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

type PopupModalProps = PropsWithChildren & {
  visible: boolean,
  onClose: () => void,
}

type IPopupModalBodyProps = PropsWithChildren & {
  
}

function PopupModal(props: PopupModalProps) {
  const backgroundColor = useThemeColor('card');
  
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="none"
      onRequestClose={props.onClose}
    >
      <View style={[Styles.FLEX_HORIZONTAL_CENTER, { flex: 1, paddingHorizontal: 24 }]}>
        <TouchableWithoutFeedback onPress={props.onClose}>
          <View style={styles.backdrop}></View>
        </TouchableWithoutFeedback>
        <View style={[Styles.FLEX_COLUMN, styles.content, { backgroundColor }]}>
          { props.children }
        </View>
      </View>
    </Modal>
  );
}

function PopupModalBody(props: IPopupModalBodyProps) {
  return (
    <View>
      { props.children }
    </View>
  );
}

function PopupModalFooter(props: PropsWithChildren) {
  return (<Fragment>{props.children}</Fragment>);
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  content: {
    padding: 24,
    rowGap: 24,
    borderRadius: 16,
  }
});

PopupModal.Body = PopupModalBody;
PopupModal.Footer = PopupModalFooter;

export default PopupModal;