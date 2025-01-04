import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import * as SQLite from 'expo-sqlite';
import { DbContext } from '@/utils/context';
import ThemedView from '@/components/ThemedView';

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
    // View is needed to wrap the entire stack or a white flicker will happen between navigation (due to OS color wrongly setup)
    <ThemedView style={{ flex: 1 }}> 
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <DbContext.Provider value={db}>
          <Stack>
            <Stack.Screen name="(tabs)" options={screenOptions} />
            <Stack.Screen name='player/add' options={screenOptions} />
            <Stack.Screen name='player/[id]/index' options={screenOptions} />
            <Stack.Screen name='player/[id]/edit' options={screenOptions} />
            <Stack.Screen name='team/add' options={screenOptions} />
            <Stack.Screen name='team/[id]/index' options={screenOptions} />
            <Stack.Screen name='team/[id]/edit' options={screenOptions} />
            <Stack.Screen name='match/add' options={screenOptions} />
            <Stack.Screen name='match/[id]/index' options={screenOptions} />
            <Stack.Screen name='match/[id]/edit' options={screenOptions} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </DbContext.Provider>
      </ThemeProvider>
    </ThemedView>
  );
}
