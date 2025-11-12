import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import ViewProfile from "../../components/ViewPorfile";
import { getUserById } from "../../service/Api";
import InstagramSpinner from "../../components/InstagramSpinner";

export default function Profile() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");

        if (!savedToken || !userId) {
          setIsLoading(false);
          return;
        }
        setToken(savedToken);
        const { data } = await getUserById(userId);
        setUser(data);

      } catch (error) {
        console.log("Error al obtener usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);
  
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
