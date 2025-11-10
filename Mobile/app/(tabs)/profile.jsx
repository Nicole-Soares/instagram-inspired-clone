import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import ViewProfile from "../../components/ViewPorfile";
import { getUser } from "../../service/Api";
import InstagramSpinner from "../../components/InstagramSpinner";

/*profile (tab) = perfil del usuario logueado. 
Es la pantalla “Mi perfil”: ver tus posts, editar/eliminar, cerrar sesión. 
Ruta fija de la tab: /(tabs)/profile.jsx Pide token y usa getUser() para traer al usuario logueado.
*/
export default function Profile() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (!savedToken) {
          setIsLoading(false);
          return;
        }
  
        setToken(savedToken);
  
        // simulamos que la request tarda 2.5s
        await new Promise((resolve) => setTimeout(resolve, 2500));
  
        const { data } = await getUser();
        setUser(data);
      } catch (error) {
        console.log("Error al obtener usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  
  // Spinner mientras carga
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <InstagramSpinner />
      </SafeAreaView>
    );
  }

  // Si no hay token va al login
  if (!token) {
    return <Redirect href="/login" />;
  }

  // Render del perfil logueado
  return (
    <SafeAreaView style={styles.container}>
      <ViewProfile user={user} setToken={setToken} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
