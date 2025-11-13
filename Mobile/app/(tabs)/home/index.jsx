import { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, RefreshControl, Alert } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "../../../service/Api";
import { isTokenExpired } from "../../../utils/isTokenExpired";
import useFetchDataEffect from "../../../hooks/useFetchDataEffect";
import InstagramSpinner from "../../../components/InstagramSpinner";
import TimelinePost from "../../../components/home/TimelinePost";
import { useFollow } from "../../../hooks/followContext";

const cleanId = (v) => String(v ?? "").replace(/^user_/, "");
const getAuthorId = (p) =>
  cleanId(
    p?.user?.id ??
    p?.author?.id ??
    p?.userId ??
    p?.authorId ??
    ""
  );

export default function Home() {
  const [unauthorized, setUnauthorized] = useState(false);
  const { isFollowing, toggleFollow, pendingIds } = useFollow();

  const fetchTimeline = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      const error = new Error("UNAUTHORIZED");
      error.status = 401;
      throw error;
    }

    const { data } = await getUser(); // axios
    return data;
  };

  // Uso del hook reutilizable
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

  //  Redirección si no hay token válido
  if (unauthorized) {
    return <Redirect href="/login" />;
  }

  //  Cargando...
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <InstagramSpinner />
        <Text style={{ marginTop: 8, color: "#666" }}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  //  Error de fetch
  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#555" }}>Ocurrió un error al cargar el timeline.</Text>
      </SafeAreaView>
    );
  }

  //  Publicaciones del usuario
  const posts = data?.timeline ?? data?.posts ?? [];

  //  Sin publicaciones
  if (!posts || posts.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 }}>
          <Text style={{ color: "#555", textAlign: "center" }}>
            Seguí a tus amigos para ver fotos y videos.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  //  Lista de publicaciones
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const authorId = getAuthorId(item);
          const following = isFollowing(authorId);
          const pending = pendingIds.has(authorId);
          
          return (
            <TimelinePost
              post = {item}
              following = {following}
              pending = {pending}
              onToggleFollow = {() => toggleFollow(authorId)}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={reloadScreen} />
        }
      />
    </SafeAreaView>
  );
}
