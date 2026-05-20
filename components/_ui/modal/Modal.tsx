import useThemeColor from "@/hooks/v2/useThemeColor";
import { Fragment, PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Keyboard, KeyboardAvoidingView, KeyboardEvent, Platform, Modal as RNModal, StyleSheet, TouchableWithoutFeedback, useWindowDimensions, View, ViewStyle } from "react-native";

type ModalProps = PropsWithChildren & {
  visible: boolean,
  onClose: () => void,
  height: ViewStyle['height'],
}

function getModalHeightValue(height: ViewStyle['height'], windowHeight: number) {
  if (typeof height === "number") {
    return height;
  }

  if (typeof height === "string" && height.endsWith("%")) {
    const percentage = Number.parseFloat(height);

    if (!Number.isNaN(percentage)) {
      return (percentage / 100) * windowHeight;
    }
  }

  return 0;
}

function Modal({ children, ...props }: ModalProps) {
  const [mounted, setIsMounted] = useState<boolean>(false);

  const backgroundColor = useThemeColor('background');

  const { height: windowHeight } = useWindowDimensions();
  const slideAnimation = useRef(new Animated.Value(windowHeight)).current;

  useEffect(() => {
    if (props.visible) {
      setIsMounted(true);
    }
    else {
      slideAnimation.stopAnimation();
      slideAnimation.setValue(0);
      Animated.timing(slideAnimation, {
        toValue: windowHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsMounted(false);
        }
      });
    }
  }, [props.visible]);

  useEffect(() => {
    if (mounted && props.visible) {
      slideAnimation.stopAnimation();
      slideAnimation.setValue(windowHeight);
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [mounted]);

  // const keyboardOffset = useRef(new Animated.Value(0)).current;

  // Keyboard events subscription
  // useEffect(() => {
  //   const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
  //   const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

  //   const onShow = (e: KeyboardEvent) => {
  //     Animated.timing(keyboardOffset, {
  //       toValue: -e.endCoordinates.height,
  //       duration: e.duration || 250,
  //       useNativeDriver: true,
  //     }).start();
  //   };

  //   const onHide = (e: KeyboardEvent) => {
  //     Animated.timing(keyboardOffset, {
  //       toValue: 0,
  //       duration: e.duration || 250,
  //       useNativeDriver: true,
  //     }).start();
  //   };

  //   const showSub = Keyboard.addListener(showEvent, onShow);
  //   const hideSub = Keyboard.addListener(hideEvent, onHide);

  //   return () => {
  //     showSub.remove();
  //     hideSub.remove();
  //   };
  // }, [keyboardOffset, props.height, windowHeight]);

  if (!mounted) return null;

  return (
    <RNModal
      visible={props.visible}
      transparent
      animationType="none"
      onRequestClose={props.onClose}
    >
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={props.onClose}>
          <View style={styles.backdrop}></View>
        </TouchableWithoutFeedback>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={[{ justifyContent: 'flex-end', height: props.height }]}
            keyboardVerticalOffset={0}
          >  
            <Animated.View
              style={[
                styles.content,
                { height: '100%', backgroundColor },
                // { transform: [
                //   { translateY: slideAnimation },
                // ] },
              ]}
            >
              {children}
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </RNModal>
  );
}

function ModalHeader({ children }: { children: ReactNode | undefined }) {
  return (
    <Fragment>{children}</Fragment>
  );
}

function ModalBody({ children }: { children: ReactNode | undefined }) {
  return (
    <Fragment>{children}</Fragment>
  );
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;

export default Modal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  content: {
    paddingTop: 24,
    paddingBottom: 32,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // bottom: 0,
    // position: "absolute",
    width: "100%",
  },
});
