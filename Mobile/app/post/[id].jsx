import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import ErrorScreen from "../../components/ErrorScreen";
import Info from "../../components/Info";
import InstagramSpinner from "../../components/InstagramSpinner";
import NotFoundScreen from "../../components/NotFoundScreen";
import CommentForm from "../../components/post/CommentForm";
import CommentList from "../../components/post/CommentList";
import HeaderPost from "../../components/post/HeaderPost";
import {
  addCommentToPost,
  deletePost,
  getPostById,
} from "../../service/Api";
import { isTokenExpired } from "../../utils/isTokenExpired";

export default function Post() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [comentario, setComentario] = useState("");
  const comentariosRef = useRef(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isError, setIsError] = useState(false);

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
      } catch (error) {
        const status = error.response?.status || error.status;
        if (status === 401) setIsUnauthorized(true);
        else if (status === 404) setIsNotFound(true);
        else setIsError(true);;
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

  if (isError) return <ErrorScreen/>;
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {post.image && (
            <Image source={{ uri: post.image }} style={styles.image} />
          )}

          <HeaderPost
            user={post.user}
            date={post.date}
            isOwner={isOwner}
            onEditClick={handleEdit}
            onDeleteClick={handleDelete}
          />

          <View style={styles.separator} />

          <CommentList
            todosLosComentarios={todosLosComentarios}
            handleNavigateToUser={(userId) => router.push(`/user/${userId}`)}
          />

          <View style={styles.separator} />

          <Info post={post} postId={id} onUpdatePost={handleUpdatePost} />

          <CommentForm
            comentario={comentario}
            setComentario={setComentario}
            handleSubmit={handleSubmit}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
