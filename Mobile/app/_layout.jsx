import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="post" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* ✅ Modal de comentarios (mover comments/[postId].jsx al nivel raíz de /app/comments) */}
        <Stack.Screen
          name="comments/[postId]"
          options={{
            presentation: "transparentModal", // 🔥 permite ver el fondo del post
            animation: "slide_from_bottom",   // animación suave tipo Instagram
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
