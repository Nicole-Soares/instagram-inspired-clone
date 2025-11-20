import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import { TimelineRefreshProvider } from "../context/TimelineRefreshContext";
import { FollowProvider } from "../hooks/followContext";

export const unstable_settings = {
  anchor: "(tabs)",
  initialRouteName: "/splash",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TimelineRefreshProvider>   
        <FollowProvider>
          <Stack
            screenOptions={{
              headerTitleAlign: "left",
              headerShadowVisible: false,
              headerStyle: { backgroundColor: "#fff" },
              headerTintColor: "#111827",
              headerShown: false, 
            }}
          >
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="users" />
            <Stack.Screen name="post" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen
              name="(modal)"
              options={{ presentation: "transparentModal", headerShown: false }}
            />
          </Stack>

          <StatusBar style="dark" backgroundColor="#fff" />
        </FollowProvider>
      </TimelineRefreshProvider>
    </GestureHandlerRootView>
  );
}