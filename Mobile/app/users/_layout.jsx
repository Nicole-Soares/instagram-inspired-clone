import { Stack } from "expo-router";

export default function UsersLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'left', 
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#111827',
        headerBackTitle: ' ',
        headerBackTitleVisible: false
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "" }} />
    </Stack>
  );
}
