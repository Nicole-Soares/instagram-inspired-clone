import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InstagramSpinner from "../../components/InstagramSpinner";
import ViewProfile from "../../components/ViewPorfile";
import { getUserById } from "../../service/Api";

export default function Profile() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      const fetchUser = async () => {
        setIsLoading(true);
        try {
          const savedToken = await AsyncStorage.getItem("token");
          const userId = await AsyncStorage.getItem("userId");

          if(!savedToken || !userId) {
            if(!isCancelled) setToken("");
            return;
          }

          if (!isCancelled) setToken(savedToken);

          const { data } = await getUserById(userId);
          if (!isCancelled) setUser(data);

        } catch (e) {
          console.log("Error al obtener usuario:", e);
          if (!isCancelled) setToken("");
        } finally {
          if (!isCancelled) setIsLoading(false);
        }
      };

      fetchUser();

      return () => {
        isCancelled = true;
      };
    }, [])
  );
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <InstagramSpinner />
      </SafeAreaView>
    );
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

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
