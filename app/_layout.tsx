import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider as bye } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import 'react-native-reanimated';
import { DefaultTheme as PaperDefault, MD3DarkTheme, PaperProvider } from 'react-native-paper';

import ThemedView from '@/components/ThemedView';
import OnboardingScreen from '@/components/screens/OnboardingScreen';

import { DbQueries } from '@/constants/messages/DbQueries';
import { DbContext, useDataStore, useThemeStore } from '@/utils/context';
import { showErrorToast } from '@/utils/toast.util';
import { GetAllMatches } from '@/utils/repositories/MatchRepository';
import { GetAllParticipants } from '@/utils/repositories/PlayerRepository';
import { DARK_THEME, LIGHT_THEME } from '@/constants/Themes';
import ThemeProvider from '@/providers/ThemeProvider';

const screenOptions = { headerShown: false };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLightMode, setIsLightMode } = useThemeStore();
  const dataStore = useDataStore();

  const [loaded] = useFonts({
    LeagueSpartanLight: require("../assets/fonts/LeagueSpartan-ExtraLight.ttf"),
    LeagueSpartanRegular: require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    LeagueSpartanBold: require("../assets/fonts/LeagueSpartan-SemiBold.ttf"),
  });

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [setupCompleted, setSetupCompleted] = useState<boolean>(false);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | undefined>();

  // Actions on app initialization
  useEffect(() => {
    let firstLaunch = false;

    // Check if 'launched' property is in storage
    // If not, it means it is the user's first time using the app
    // We will also check the 'onboarded' property
    async function getInitState() {
      const launched = await AsyncStorage.getItem('launched');
      const onboarded = await AsyncStorage.getItem('onboarded');

      if (launched === null) {
        firstLaunch = true;
        setIsFirstLaunch(true);
      }

      if (Boolean(onboarded) === true) {
        setOnboardingCompleted(true);
      }
    };

    // Set light/dark theme by getting user preference
    async function setTheme() {
      try {
        const value = await AsyncStorage.getItem('lightmode');
        if (value === 'true') setIsLightMode();
      }
      catch (err: any) {
        console.log(err);
      }
    };

    // Prepare database
    async function openDb() {
      const db = await SQLite.openDatabaseAsync('h2h.db');
      setDb(db);
      return db;
    };

    // Check if app is on first launch or not, if yes, and db connection is open, create db tables
    async function handleData(database: SQLite.SQLiteDatabase) {
      try {
        if (firstLaunch) {
          await database.execAsync(DbQueries.CreateAllTables);
          await AsyncStorage.setItem('launched', 'true');
        }
        else if (!firstLaunch) {
          // Get data if its not first time launching
          await GetAllParticipants(database, dataStore.setPlayers, dataStore.setTeams, showErrorToast);
          await GetAllMatches(database, dataStore.setSinglesMatches, dataStore.setDoublesMatches, showErrorToast);
        }
      }
      catch (err: any) {
        console.log(err);
        showErrorToast();
      }
    };
    
    getInitState().then(() => {
      setTheme().then(() => {
        if(!db) {
          openDb().then((database: SQLite.SQLiteDatabase) => {
            handleData(database).then(() => {
              setSetupCompleted(true);
            });
          });
        }
        else {
          setSetupCompleted(true);
        }
      });
    })
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
        {/* <ThemeProvider value={DARK_THEME}> */}
          {/* <PaperProvider theme={!isLightMode ? MD3DarkTheme : PaperDefault}> */}
            <DbContext.Provider value={db}>
              {/* {
                !onboardingCompleted ?
                <OnboardingScreen setOnboarded={setOnboardingCompleted} />
                : */}
                <Stack>
                  <Stack.Screen name="(tabs)" options={screenOptions} />
                  {/* <Stack.Screen name='player/add' options={screenOptions} />
                  <Stack.Screen name='player/[id]/index' options={screenOptions} />
                  <Stack.Screen name='player/[id]/edit' options={screenOptions} />
                  <Stack.Screen name='team/add' options={screenOptions} />
                  <Stack.Screen name='team/[id]/index' options={screenOptions} />
                  <Stack.Screen name='team/[id]/edit' options={screenOptions} />
                  <Stack.Screen name='match/add' options={screenOptions} />
                  <Stack.Screen name='match/[id]/index' options={screenOptions} />
                  <Stack.Screen name='match/[id]/edit' options={screenOptions} />
                  <Stack.Screen name="+not-found" /> */}
                </Stack>
              {/* } */}
            </DbContext.Provider>
          {/* </PaperProvider> */}
        {/* </ThemeProvider> */}
      </ThemeProvider>
    </View>
  );
}
