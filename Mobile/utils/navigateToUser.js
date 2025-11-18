import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const navigateToUser = async (userId) => {
  try {
    const myId = await AsyncStorage.getItem("userId");

    if (!userId) return;

    if (userId === myId) {
      router.push("/(tabs)/profile");       // Perfil propio
    } else {
      router.push(`/users/${userId}`);    // Perfil ajeno
    }

  } catch (error) {
    console.log("Error navegando al perfil:", error);
  }
};
