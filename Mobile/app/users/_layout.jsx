import { Stack } from "expo-router";

export default function UsersLayout() {
  return (
    <Stack>
      {/* listado de usuarios */}
      <Stack.Screen name="index" options={{ title: "Users", headerShown: false }} />
      {/* detalle público */}
      <Stack.Screen name="[id]" options={{ title: "Usuario" }} />
    </Stack>
  );
}
