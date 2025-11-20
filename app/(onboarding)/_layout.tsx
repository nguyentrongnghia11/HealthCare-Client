import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }}/>
      <Stack.Screen name="personal-info" options={{ headerShown: false }}/>
      <Stack.Screen name="physical-stats" options={{ headerShown: false }}/>
      <Stack.Screen name="goals" options={{ headerShown: false }}/>
      <Stack.Screen name="activity-level" options={{ headerShown: false }}/>
      <Stack.Screen name="complete" options={{ headerShown: false }}/>
    </Stack>
  );
}
