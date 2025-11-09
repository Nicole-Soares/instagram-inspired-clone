import { Stack } from 'expo-router';
export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="comments/[postId]"
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          contentStyle: { backgroundColor: 'rgba(0,0,0,0.2)' },
        }}
      />
    </Stack>
  );
}
