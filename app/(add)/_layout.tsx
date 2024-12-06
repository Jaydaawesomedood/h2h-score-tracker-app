import { Stack } from "expo-router";

export default function ProfilesLayout() {
  const screenOptions = { headerShown: false };

  return (
    <Stack>
      <Stack.Screen name="add-player" options={screenOptions} />
      <Stack.Screen name="add-team" options={screenOptions} />
      <Stack.Screen name="add-match" options={screenOptions} />
    </Stack>
  );
};