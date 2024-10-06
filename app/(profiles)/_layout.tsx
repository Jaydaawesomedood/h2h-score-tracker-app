import { Stack } from "expo-router";

export default function ProfilesLayout() {
  const screenOptions = { headerShown: false };

  return (
    <Stack>
      <Stack.Screen name="player" options={screenOptions} />
      <Stack.Screen name="team" options={screenOptions} />
      <Stack.Screen name="match" options={screenOptions} />
    </Stack>
  );
};