import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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
  const { id, post: postParam } = useLocalSearchParams();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState(postParam ? JSON.parse(postParam) : null);

  const scrollViewRef = useRef(null);

  // --- animation ---
  const translateY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 7,
    }).start();
  }, []);

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: 400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => router.back());
  };

  if (!post) return null;

  const comentarios = [
    ...(post.description?.trim()
      ? [{ body: post.description, user: post.user }]
      : []),
    ...(post.comments || []),
  ];

  const handlePublish = async () => {
    const trimmed = comment.trim();
    if (!trimmed) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    try {
      setIsLoading(true);
      const updated = await addComment(post.id, trimmed);
      setPost(updated);
      setComment("");

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    } catch (e) {
      setError("No se pudo publicar el comentario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable style={styles.overlay} onPress={closeModal}>
      <BlurView intensity={25} tint="dark" style={styles.blurOverlay} />

      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Image source={{ uri: post.user.image }} style={styles.headerAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.headerUserName}>{post.user.name}</Text>
              <Text style={styles.headerDateText}>{formateoFecha(post.date)}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* COMMENTS */}
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

          {/* INPUT */}
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: "padding", android: undefined })}
          >
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Agrega un comentario"
                placeholderTextColor="#999"
                value={comment}
                multiline
                onChangeText={(t) => {
                  setComment(t);
                  if (error) setError("");
                }}
                style={[styles.input, error && { borderColor: "#e74c3c" }]}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable
                style={[styles.button, isLoading && styles.buttonDisabled]}
                disabled={isLoading}
                onPress={handlePublish}
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
      </Animated.View>
    </Pressable>
  );
}
