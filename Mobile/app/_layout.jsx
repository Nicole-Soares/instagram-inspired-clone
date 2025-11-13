import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { FollowProvider } from '../hooks/followContext';

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  return (
    <FollowProvider>
      <Stack
         screenOptions={{
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#111827'
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="users" options={{ headerShown: false }} />
        <Stack.Screen name="post" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </FollowProvider>
  );
}
