import { Styles } from "@/constants/v2/Styles";
import useThemeColor from "@/hooks/v2/useThemeColor";
import { Fragment, PropsWithChildren, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Animated, DimensionValue, Keyboard, KeyboardEvent, LayoutChangeEvent, Platform, Modal as RNModal, StyleSheet, TouchableWithoutFeedback, useWindowDimensions, View, ViewStyle } from "react-native";
import ThemedText from "../ThemedText";
import Button from "../button/Button";

type ModalProps = PropsWithChildren & {
  visible: boolean,
  onClose: () => void,
  height: ViewStyle['height'],
}

type IModalHeaderProps = {
  title: string,
  onCloseModal: () => void,
}

function Modal({ children, height = '50%', ...props }: ModalProps) {
  const [mounted, setIsMounted] = useState<boolean>(false);

  const backgroundColor = useThemeColor('background');

  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const slideAnimation = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (props.visible) {
      setIsMounted(true);
    }
    else {
      slideAnimation.stopAnimation();
      slideAnimation.setValue(0);
      Animated.timing(slideAnimation, {
        toValue: SCREEN_HEIGHT,
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
      slideAnimation.setValue(SCREEN_HEIGHT);
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [mounted]);

  function toPx(value: DimensionValue): number | null {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.endsWith('%')) {
      return (parseFloat(value) / 100) * SCREEN_HEIGHT;
    }
    return null; // 'auto' or unresolvable — fall back to onLayout
  }

  // Resolved pixel height used for keyboard math.
  const baseHeight = useRef<number>(toPx(height) ?? 0);
  const animatedBottom = useRef(new Animated.Value(0)).current;
  // Initialise with the resolved pixel value; falls back to 0 until onLayout fires for 'auto' heights.
  const animatedHeight = useRef(new Animated.Value(toPx(height) ?? 0)).current;

  // Sync baseHeight + animatedHeight when props.height changes,
  // as long as the keyboard isn't currently open.
  useEffect(() => {
    const px = toPx(height);
    if (px !== null) {
      baseHeight.current = px;
      animatedHeight.setValue(px);
    }
    // If px is null (i.e. 'auto'), onLayout handles it — nothing to do here.
  }, [height]);

  // Captures the natural rendered height for 'auto' (or any value toPx
  // can't resolve). Guarded so it only fires once and doesn't fight the
  // keyboard-driven height animation.
  const heightMeasured = useRef(false);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (!heightMeasured.current && toPx(height) === null) {
        const measured = e.nativeEvent.layout.height;
        baseHeight.current = measured;
        animatedHeight.setValue(measured);
        heightMeasured.current = true;
      }
    },
    [height],
  );

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleShow = (e: KeyboardEvent) => {
      const kbHeight = e.endCoordinates.height;
      const duration = e.duration ?? 250;
      const base = baseHeight.current; // always the latest pixel value

      const targetHeight = base + kbHeight > SCREEN_HEIGHT ? SCREEN_HEIGHT - kbHeight : base;

      Animated.parallel([
        Animated.timing(animatedBottom, {
          toValue: kbHeight,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(animatedHeight, {
          toValue: targetHeight,
          duration,
          useNativeDriver: false,
        }),
      ]).start();
    };

    const handleHide = (e: KeyboardEvent) => {
      const duration = e.duration ?? 250;

      Animated.parallel([
        Animated.timing(animatedBottom, {
          toValue: 0,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(animatedHeight, {
          toValue: baseHeight.current,
          duration,
          useNativeDriver: false,
        }),
      ]).start();
    };

    const showSub = Keyboard.addListener(showEvent, handleShow);
    const hideSub = Keyboard.addListener(hideEvent, handleHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
        <Animated.View
          onLayout={handleLayout}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: animatedBottom,
            height: animatedHeight,
          }}
        >
          <Animated.View
            style={[styles.content, { flex: 1, backgroundColor }]}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </View>
    </RNModal>
  );
}

function ModalHeader(props: IModalHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText weight="bold" style={{ fontSize: 24 }}>{props.title}</ThemedText>
      <Button type="secondary" text="Cancel" onPress={props.onCloseModal} />
    </View>
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
    width: "100%",
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 24,
    ...Styles.FLEX_HORIZONTAL_SIDE
  },
});
