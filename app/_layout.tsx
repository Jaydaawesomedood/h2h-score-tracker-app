import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import * as SQLite from 'expo-sqlite';
import { DbContext } from '@/utils/context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <DbContext.Provider value={db}>
          <Stack>
            <Stack.Screen name="(tabs)" options={screenOptions} />
            <Stack.Screen name="(profiles)" options={screenOptions} />
            <Stack.Screen name="(edit)" options={screenOptions} />
            <Stack.Screen name="(add)" options={screenOptions} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </DbContext.Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
