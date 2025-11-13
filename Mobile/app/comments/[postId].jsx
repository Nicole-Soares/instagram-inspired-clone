import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import InstagramSpinner from "../../components/InstagramSpinner";
import { addComment } from "../../service/Api";
import { formateoFecha } from "../../utils/formateoFecha";
import styles from "./styles";

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

        <View style={styles.headerContainer}>
          {post.user?.image ? (
            <Image source={{ uri: post.user.image }} style={styles.headerAvatar} />
          ) : (
            <View style={[styles.headerAvatar, styles.headerAvatarFallback]}>
              <Text style={styles.headerAvatarInitial}>
                {(post.user?.name?.[0] ?? "U").toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerUserName}>{post.user?.name}</Text>
            {!!post.date && <Text style={styles.headerDateText}>{formateoFecha(post.date)}</Text>}
          </View>
        </View>
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

