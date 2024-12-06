import { Stack } from "expo-router";

export default function ProfilesLayout() {
  const screenOptions = { headerShown: false };

  return (
    <Stack>
      <Stack.Screen name="edit-player" options={screenOptions} />
      <Stack.Screen name="edit-team" options={screenOptions} />
      <Stack.Screen name="edit-match" options={screenOptions} />
    </Stack>
  );
};