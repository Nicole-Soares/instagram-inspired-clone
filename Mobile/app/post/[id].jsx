import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import ErrorScreen from "../../components/ErrorScreen";
import InstagramSpinner from "../../components/InstagramSpinner";
import NotFoundScreen from "../../components/NotFoundScreen";
import DeletePostModal from "../../components/post/DeletePostModal";
import HeaderPost from "../../components/post/HeaderPost";
import Info from "../../components/post/Info";
import { PostProvider, usePost } from "../../context/PostContext";

//encapsula la screen dentro del contexto
export default function Wrapper() {
  const { id } = useLocalSearchParams();

  //postProvider ya se encarga de hacer el fetch del post y cargar todos los estados
  return (
    <PostProvider postId={id}>
      <PostScreen />
    </PostProvider>
  );
}

function PostScreen() {
  const { post, loading, isNotFound, isError, reloadPost } = usePost();
  const navigation = useNavigation();
  const [showDelete, setShowDelete] = useState(false);

   // titulo del post
   useEffect(() => {
    if (post) {
      navigation.setOptions({
        title: `Post - ${post.user?.name ?? ""}`,
      });
    }
  }, [post])

  //cuando la pantalla vuelve a estar en foco, lo vuelve a cargar, sirve para cuando el modal de los comentarios se cierra
  useFocusEffect(
    useCallback(() => {
      reloadPost();
    }, [])
  );

  if (isError) return <ErrorScreen />;
  if (isNotFound) return <NotFoundScreen />;

  if (loading || !post)
    return (
      <View style={styles.centered}>
        <InstagramSpinner size="large" />
        <Text>Cargando post...</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HeaderPost />
        {post.image && <Image source={{ uri: post.image }} style={styles.image} />}
        <Info />
        <DeletePostModal visible={showDelete} onClose={() => setShowDelete(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 12,
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 700,
    borderRadius: 8,
    marginBottom: 16,
  },
});
