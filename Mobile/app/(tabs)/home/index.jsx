import { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, RefreshControl, Alert } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { getUser } from "../../../service/Api";
import { isTokenExpired } from "../../../utils/isTokenExpired";
import useFetchDataEffect from "../../../hooks/useFetchDataEffect";
import InstagramSpinner from "../../../components/InstagramSpinner";
import TimelinePost from "../../../components/home/TimelinePost";

export default function Home() {
  const [unauthorized, setUnauthorized] = useState(false);

  //  Función que pide el timeline
  const fetchTimeline = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      const error = new Error("UNAUTHORIZED");
      error.status = 401;
      throw error;
    }

    const { data } = await getUser();
    return data;
  };

  //  Hook genérico para manejar la carga
  const {
    isLoading,
    isError,
    dataState: data,
    reloadScreen,
  } = useFetchDataEffect(fetchTimeline, {}, [], (error) => {
    const status = error?.response?.status || error?.status;
    if (status === 401) {
      setUnauthorized(true);
    } else {
      console.error("Error timeline:", error);
      Alert.alert("Error", "Error al cargar publicaciones.");
    }
  });

  // Solo recarga los datos cuando la pestaña Home está activa
  useFocusEffect(
    useCallback(() => {
      reloadScreen();
    }, [])
  );

  //  Si no hay token válido
  if (unauthorized) {
    return <Redirect href="/login" />;
  }

  //  Cargando
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <InstagramSpinner />
        <Text style={{ marginTop: 8, color: "#666" }}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  // 🔸 Error
  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#555" }}>Ocurrió un error al cargar el timeline.</Text>
      </SafeAreaView>
    );
  }

  // 🔸 Posts del usuario
  const posts = data?.timeline ?? data?.posts ?? [];

  // 🔸 Si no tiene publicaciones
  if (!posts || posts.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ color: "#555", textAlign: "center" }}>
            Seguí a tus amigos para ver fotos y videos.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🔸 Lista de publicaciones
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TimelinePost post={item} />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={reloadScreen} />
        }
      />
    </SafeAreaView>
  );
}
