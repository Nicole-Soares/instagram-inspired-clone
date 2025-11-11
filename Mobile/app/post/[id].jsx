import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Redirect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import ErrorScreen from "../../components/ErrorScreen";
import Info from "../../components/Info";
import InstagramSpinner from "../../components/InstagramSpinner";
import NotFoundScreen from "../../components/NotFoundScreen";
import HeaderPost from "../../components/post/HeaderPost";
import { addCommentToPost, deletePost, getPostById } from "../../service/Api";
import { isTokenExpired } from "../../utils/isTokenExpired";

export default function Post() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [comentario, setComentario] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const navigation = useNavigation();

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
        //  Setea el título del header
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

  const handleSubmit = async () => {
    if (!comentario.trim()) {
      Alert.alert("Aviso", "El comentario no puede estar vacío.");
      return;
    }

    try {
      const updatedPost = await addCommentToPost(id, comentario);
      setPost(updatedPost);
      setComentario("");
      Alert.alert("Éxito", "Comentario publicado 🎉");
    } catch (error) {
      Alert.alert("Error", "No se pudo publicar el comentario.");
    }
  };

  const handleEdit = () => router.push(`/post/edit/${id}`);

  const handleDelete = () => {
    Alert.alert(
      "Eliminar post",
      "¿Seguro que querés eliminar este post?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDelete = async () => {
    try {
      await deletePost(id);
      Alert.alert("Éxito", "Post eliminado exitosamente.");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "Error al borrar el post.");
    }
  };

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

  const todosLosComentarios = [
    ...(post.description?.trim()
      ? [{ body: post.description, user: post.user }]
      : []),
    ...(post.comments || []),
  ];

  return (
    <View style={styles.container}>
      <HeaderPost
        user={post.user}
        date={post.date}
        isOwner={isOwner}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.image} />
        )}
        <Info
          post={post}
          postId={id}
          onUpdatePost={handleUpdatePost}
          onShowComments={() => router.push(`/comments/${post.id}`)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 16 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
});
