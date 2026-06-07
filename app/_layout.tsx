import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { Canvas, Mask, Group, Rect } from '@shopify/react-native-skia';
import ThemeProvider from '@/providers/ThemeProvider';
import { usePlayersStore } from '@/store/usePlayersStore';
import { useMatchesStore } from '@/store/useMatchesStore';
import { useOnboardingTour } from '@/hooks/v2/useOnboardingTour';
import OnboardingTourProvider from '@/providers/OnboardingTourProvider';
import { Styles } from '@/constants/v2/Styles';
import useThemeColor from '@/hooks/v2/useThemeColor';
import ThemedText from '@/components/_ui/ThemedText';
import Button from '@/components/_ui/button/Button';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://3384bbf63859cb4de9b305440ed7a0bc@o4511518901272576.ingest.us.sentry.io/4511518917066752',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const screenOptions = { headerShown: false };
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const initPlayerListener = usePlayersStore(state => state.initPlayerListener);
  const initMatchListener = useMatchesStore(state => state.initMatchListener);
  const terminatePlayerListener = usePlayersStore(state => state.terminatePlayerListener);
  const terminateMatchListener = useMatchesStore(state => state.terminateMatchListener);

  const [loaded] = useFonts({
    LeagueSpartanLight: require("../assets/fonts/LeagueSpartan-ExtraLight.ttf"),
    LeagueSpartanRegular: require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    LeagueSpartanBold: require("../assets/fonts/LeagueSpartan-SemiBold.ttf"),
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
  const [setupCompleted, setSetupCompleted] = useState<boolean>(false);

  // Actions on app initialization
  useEffect(() => {
    let firstLaunch = false;

    // Check if 'launched' property is in storage
    // If not, it means it is the user's first time using the app
    // We will also check the 'onboarded' property
    async function getInitState() {
      const launched = await AsyncStorage.getItem('launched');

      if (launched === null) {
        firstLaunch = true;
        setIsFirstLaunch(true);
      }
    };

    async function initApp() {
      initPlayerListener();
      initMatchListener();

      getInitState().then(() => {
        setSetupCompleted(true);
      });
    }

    initApp();

    return () => {
      terminatePlayerListener();
      terminateMatchListener();
    }
  }, []);

  useEffect(() => {
    if (loaded && setupCompleted) {
      SplashScreen.hideAsync();
    }
  }, [loaded, setupCompleted]);

  if (!loaded || !setupCompleted) {
    return null;
  }

  return (
    // View is needed to wrap the entire stack or a white flicker will happen between navigation (due to OS color wrongly setup)
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"}/>
      <ThemeProvider>
        <OnboardingTourProvider>
          <RootLayoutContent isFirstLaunch={isFirstLaunch} />
        </OnboardingTourProvider>
      </ThemeProvider>
    </View>
  );
});

function AppStack() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={screenOptions} />
      <Stack.Screen name='player/[id]/index' options={screenOptions} />
      <Stack.Screen name='player/[id]/edit' options={screenOptions} />
      <Stack.Screen name='match/[id]/index' options={screenOptions} />
      <Stack.Screen name='match/[id]/edit' options={screenOptions} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

function RootLayoutContent({ isFirstLaunch }: { isFirstLaunch: boolean }) {
  const card = useThemeColor('card');

  const { activeStep, activeStepName, steps, nextStep, startTour } = useOnboardingTour();
  const tourTriggered = useRef(false); 

  useEffect(() => {
    // Fire only when it's a first launch, and we haven't fired yet
    if (isFirstLaunch && !tourTriggered.current) {
      tourTriggered.current = true;
      startTour();
    }
  }, [isFirstLaunch]); // Catch layout registrations
  
  // Get current active step data based on sort order
  const orderedSteps = Object.values(steps).sort((a, b) => a.order - b.order);
  const currentStep = activeStep !== null ? orderedSteps[activeStep] : null;

  // Intercept the Next button press to change screens if moving to step 3
  const handleNextPress = async () => {
    if (activeStepName === 'players_tab') {
      // Automatically push them to the players tab layout before lighting step 3
      router.push('/(tabs)/players'); 
    }
    else if (activeStep === Object.keys(steps).length - 1) {
      await AsyncStorage.setItem('launched', 'true');
    }

    nextStep();
  };
  
  if (currentStep === null || currentStep.x  === undefined || currentStep.y === undefined || currentStep.width === undefined || currentStep.height === undefined) {
    return (
      <Fragment>
        <AppStack />
        {
          tourTriggered.current && currentStep !== null && (
            <Canvas style={[StyleSheet.absoluteFill, { zIndex: 20, elevation: 20 }]} pointerEvents="auto">
                <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} color="rgba(0, 0, 0, 0.9)" />
            </Canvas>
          )
        }
      </Fragment>
    );
  }

  const { x, y, width, height, title, description } = currentStep;

  // Determine Tooltip Positioning
  // If the spotlight target is in the bottom half of the screen, place the tooltip ABOVE it.
  const isBottomHalf = y > SCREEN_HEIGHT / 2;
  const tooltipStyle = isBottomHalf 
    ? { bottom: SCREEN_HEIGHT - y + 16 } // Above target
    : { top: y + height + 16 };                  // Below target

  return (
    <Fragment>
      <AppStack />
      
      {/* 1. DARK SKIA BACKGROUND WITH HOLE */}
      <Canvas style={[StyleSheet.absoluteFill, { zIndex: 20, elevation: 20 }]} pointerEvents="auto">
        <Mask
          mode="luminance"
          mask={
            <Group>
              <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} color="white" />
              {/* <Circle cx={x} cy={y} r={r} color="black" /> */}
              <Rect x={x} y={y} width={width} height={height} color="black" />
            </Group>
          }
        >
          <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} color="rgba(0, 0, 0, 0.9)" />
        </Mask>
      </Canvas>

      {/* 2. DYNAMIC FLOATING TOOLTIP */}
      <View style={[styles.tooltipCard, tooltipStyle, { backgroundColor: card }]}>
        <ThemedText weight="bold" style={[{ fontSize: 18 }]}>{title}</ThemedText>
        <ThemedText style={[{ lineHeight: 20 }]}>{description}</ThemedText>

        <View style={[Styles.FLEX_HORIZONTAL_SIDE]}>
          <View style={[{ marginLeft: 'auto' }]}>
            <Button
              type="primary"
              text={activeStep === orderedSteps.length - 1 ? 'Finish' : 'Next'}
              onPress={handleNextPress}
              buttonStyle={[{ paddingVertical: 8, paddingHorizontal: 16 }]}
              weight="bold"
            />
          </View>
        </View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tooltipCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    zIndex: 100,
    rowGap: 16,
  }
});
