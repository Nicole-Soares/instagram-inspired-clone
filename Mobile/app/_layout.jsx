import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="post" />
        <Stack.Screen name="(auth)" />

        {/* 🔥 ESTO HACE QUE /modal/... SE REGISTRE */}
        <Stack.Screen
          name="(modal)"
          options={{ presentation: "transparentModal", headerShown: false }}
        />
      </Stack>

      <StatusBar style="dark" backgroundColor="#fff" />
    </>
  );
}
