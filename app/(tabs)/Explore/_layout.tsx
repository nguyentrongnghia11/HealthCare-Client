import { Stack } from 'expo-router';

export default function IndexStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="two" options={{ headerShown: false }} />
      <Stack.Screen name="nutrition" options={{ headerShown: false }} />
    </Stack>
  );
}
