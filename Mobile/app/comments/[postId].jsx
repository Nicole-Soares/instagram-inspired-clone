import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import InstagramSpinner from "../../components/InstagramSpinner";
import { addComment } from "../../service/Api";

export default function CommentsModal() {
  const { post: postParam } = useLocalSearchParams();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState(postParam ? JSON.parse(postParam) : null);

  const scrollViewRef = useRef(null);

  if (!post) {
    return (
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.header}>No se pudo cargar el post</Text>
        </Pressable>
      </Pressable>
    );
  }

  const comentarios = [
    ...(post.description?.trim()
      ? [{ body: post.description, user: post.user }]
      : []),
    ...(post.comments || []),
  ];

  const handlePublish = async () => {
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    try {
      setIsLoading(true);
      const updatedPost = await addComment(post.id, trimmedComment);
      setPost(updatedPost);
      setComment("");
      setError("");

      // scroll automático al final (último comentario)
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error(
        "Error al publicar comentario:",
        error.response?.data || error
      );
      setError(
        error.response?.data?.message || "No se pudo publicar el comentario."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.replace({
      pathname: `/post/${post.id}`,
      params: { updatedPost: JSON.stringify(post) },
    });
  };

  return (
    <Pressable style={styles.overlay} onPress={handleClose}>
      <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
        <View style={styles.handle} />
        <Text style={styles.header}>Comentarios de {post.user.name}</Text>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {comentarios.map((item, i) => (
            <View key={i} style={styles.commentRow}>
              <Image source={{ uri: item.user.image }} style={styles.avatar} />
              <View style={styles.commentBody}>
                <Text style={styles.commentUser}>{item.user.name}</Text>
                <Text style={i === 0 ? styles.description : styles.commentText}>
                  {item.body}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          keyboardVerticalOffset={12}
        >
          <View style={styles.containerInputButton}>
            <TextInput
              placeholderTextColor="#8A8FA3"
              placeholder="Agrega un comentario"
              style={[styles.input, error ? { borderColor: "#e74c3c" } : {}]}
              value={comment}
              onChangeText={(text) => {
                setComment(text);
                if (error) setError("");
              }}
              editable={!isLoading}
              multiline
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              style={[styles.button, isLoading ? styles.buttonDisabled : {}]}
              onPress={handlePublish}
              disabled={isLoading}
            >
              {isLoading ? (
                <InstagramSpinner />
              ) : (
                <Text style={styles.buttonText}>Publicar</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ddd",
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    fontWeight: "700",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
  },
  scroll: {
    padding: 16,
    flexGrow: 1,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentBody: {
    flex: 1,
  },
  commentUser: {
    fontWeight: "700",
    marginBottom: 2,
  },
  description: {
    fontSize: 15,
    color: "#222",
  },
  commentText: {
    fontSize: 14,
    color: "#444",
  },
  containerInputButton: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    height: 90,
    backgroundColor: "#fafafa",
    fontSize: 14,
    textAlignVertical: "top",
    color: "#222",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 13,
    marginTop: -4,
    marginBottom: 4,
  },
  button: {
    alignSelf: "center",
    width: "100%",
    backgroundColor: "#7F8CFF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
