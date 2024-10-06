import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import * as SQLite from 'expo-sqlite';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Creating the database context
export const DbContext = createContext<SQLite.SQLiteDatabase | undefined>(undefined);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    LeagueSpartanLight: require("../assets/fonts/LeagueSpartan-ExtraLight.ttf"),
    LeagueSpartanRegular: require("../assets/fonts/LeagueSpartan-Regular.ttf"),
    LeagueSpartanBold: require("../assets/fonts/LeagueSpartan-SemiBold.ttf"),
  });

  const screenOptions = { headerShown: false };

  const [db, setDb] = useState<SQLite.SQLiteDatabase | undefined>();

  useEffect(() => {
    async function openDb() {
      const db = await SQLite.openDatabaseAsync('h2h.db');
      setDb(db);
    }

    if(!db) openDb();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <DbContext.Provider value={db}>
        <Stack>
          <Stack.Screen name="(tabs)" options={screenOptions} />
          <Stack.Screen name="(profiles)" options={screenOptions} />
          <Stack.Screen name="add-player" options={screenOptions} />
          <Stack.Screen name="add-team" options={screenOptions} />
          <Stack.Screen name="add-match" options={screenOptions} />
          <Stack.Screen name="edit-player" options={screenOptions} />
          <Stack.Screen name="edit-team" options={screenOptions} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </DbContext.Provider>
    </ThemeProvider>
  );
}
