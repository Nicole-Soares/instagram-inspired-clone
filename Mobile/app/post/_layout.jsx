import { Stack } from "expo-router";

export default function PostLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Post",
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
