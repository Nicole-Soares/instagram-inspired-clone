import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Redirect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import ErrorScreen from "../../components/ErrorScreen";
import Info from "../../components/Info";
import InstagramSpinner from "../../components/InstagramSpinner";
import NotFoundScreen from "../../components/NotFoundScreen";
import DeletePostModal from "../../components/post/DeletePostModal";
import HeaderPost from "../../components/post/HeaderPost";
import { getPostById } from "../../service/Api";
import { isTokenExpired } from "../../utils/isTokenExpired";

export default function Post() {
  const { id, updatedPost } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [post, setPost] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isError, setIsError] = useState(false);

  // Si volvemos del modal y hay un post actualizado, lo usamos
  useEffect(() => {
    if (updatedPost) {
      setPost(JSON.parse(updatedPost));
    }
  }, [updatedPost]);

  // carga el post 
  useEffect(() => {
    const fetchPost = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        setIsUnauthorized(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getPostById(id);
        const loggedUserId = await AsyncStorage.getItem("userId");
        setPost(data);
        setIsOwner(String(loggedUserId) === String(data.user.id));
        navigation.setOptions({
          title: `Post - ${data.user.name}`,
        });
      } catch (error) {
        const status = error.response?.status || error.status;
        if (status === 401) setIsUnauthorized(true);
        else if (status === 404) setIsNotFound(true);
        else setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdatePost = (updatedPost) => setPost(updatedPost);

  //postEdit
  const handleEdit = () => router.push(`/post/edit/${id}`);

  //borrar el post
 /* const handleDelete = () => {
    Alert.alert("Eliminar post", "¿Seguro que querés eliminar este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: confirmDelete,
      },
    ]);
  };

  const confirmDelete = async () => {
    try {
      await deletePost(id);
      Alert.alert("Éxito", "Post eliminado exitosamente.");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "Error al borrar el post.");
    }
  };*/

  const handleDelete = () => {
    setShowDeleteModal(true);
  }

  if (isError) return <ErrorScreen />;
  if (isUnauthorized) return <Redirect href="/login" />;
  if (isNotFound) return <NotFoundScreen />;
  if (loading)
    return (
      <View style={styles.centered}>
        <InstagramSpinner size="large" />
        <Text>Cargando post...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <HeaderPost
        user={post.user}
        date={post.date}
        isOwner={isOwner}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
      />
{showDeleteModal && (
    <DeletePostModal
      visible={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      postId={id}
    />
  )}
      {post.image && <Image source={{ uri: post.image }} style={styles.image} />}

      <Info
        post={post}
        postId={id}
        onUpdatePost={handleUpdatePost}
        onShowComments={() =>
          router.push({
            pathname: `/comments/${post.id}`,
            params: { post: JSON.stringify(post) },
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 700,
    marginBottom: 16,
  },
});
