// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    // Stack này sẽ kiểm soát 'login' và 'register'
    <Stack screenOptions={{ headerShown: false }}>
      {/* Bạn không cần khai báo <Stack.Screen> ở đây
          vì nó sẽ tự động tìm các file .tsx 
      */}
    </Stack>
  );
}