import { useState, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import styles from "./styles"; 
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
  const [isError, setIsError] = useState(false);
  const [errDesc, setErrDesc] = useState("");
  const [posts, setPosts] = useState([]); 

  // Función que pide el timeline
  const fetchTimeline = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      const error = new Error("UNAUTHORIZED");
      error.status = 401;
      throw error;
    }

    setIsError(false);
    setErrDesc("");

    const { data } = await getUser();
    return data;
  };

  const {
    isLoading,
    dataState: data,
    reloadScreen,
  } = useFetchDataEffect(fetchTimeline, {}, [], (error) => {
    const status = error?.response?.status || error?.status;
    if (status === 401) {
      setUnauthorized(true);
    } else {
      console.error("Error timeline:", error);
      setIsError(true);
      setErrDesc("Hubo un fallo en la conexión. Intenta de nuevo.");
    }
  });

  // Actualiza los posts locales cuando cambian los datos del backend
  useEffect(() => {
    if (data?.timeline || data?.posts) {
      setPosts(data.timeline ?? data.posts);
    }
  }, [data]);

  // Solo recarga los datos cuando la pestaña Home está activa
  useFocusEffect(
    useCallback(() => {
      reloadScreen();
    }, [])
  );

  if (unauthorized) return <Redirect href="/login" />;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <InstagramSpinner />
        <Text style={{ marginTop: 8, color: "#666" }}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorTitle}>¡Error de Conexión!</Text>
        <Text style={styles.errorText}>{errDesc}</Text>
        <TouchableOpacity onPress={reloadScreen} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (String(p.id) === String(updatedPost.id) ? updatedPost : p))
    );
  };

  if (!posts || posts.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>
            Seguí a tus amigos para ver fotos y videos.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
              onUpdatePost={handleUpdatePost}
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
