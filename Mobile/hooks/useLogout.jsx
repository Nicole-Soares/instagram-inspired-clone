import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function useLogout(setToken) {
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert("Cerrar sesión", "¿Querés salir de tu cuenta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Salir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await AsyncStorage.removeItem("token");
                        
                        if (setToken) {
                            setToken("");
                        }
                        router.replace("/login");
                        
                    } catch (e) {
                        console.error("Error during logout:", e);
                    }
                },
            },
        ]);
    };

    return handleLogout;
}