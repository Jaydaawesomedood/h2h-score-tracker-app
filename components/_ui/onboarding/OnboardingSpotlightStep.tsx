import { useOnboardingTour } from '@/hooks/v2/useOnboardingTour';
import React, { useEffect, useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type OnboardingSpotlightStepProps = {
  children: React.ReactNode,
  name: string,
  style?: StyleProp<ViewStyle>,
};

export function OnboardingSpotlightStep({ children, name, style }: OnboardingSpotlightStepProps) {
  const viewRef = useRef<View>(null);
  const { activeStepName, updateStepCoords } = useOnboardingTour();

  useEffect(() => {
    // Only measure when this specific step becomes the active spotlight target
    if (activeStepName === name) {
      const timer = setTimeout(() => {
        if (viewRef.current) {
          viewRef.current.measureInWindow((x, y, width, height) => {
            if (width && height && x !== undefined && y !== undefined) {
              updateStepCoords(name, { x, y, width, height });
            }
          });
        }
      }, 250); // Gives screen mounting animations time to settle completely

      return () => clearTimeout(timer);
    }
  }, [activeStepName, name, updateStepCoords]);

  return (
    <View ref={viewRef} collapsable={false} style={style}>
      {children}
    </View>
  );
}