import { BlurView } from "expo-blur";
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
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { addComment } from "../../../service/Api";
import { formateoFecha } from "../../../utils/formateoFecha";
import styles from "./styles";

export default function CommentsModal() {
  const { id, post: postParam } = useLocalSearchParams();
  const [post, setPost] = useState(JSON.parse(postParam));
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const comentarios = [
    ...(post.description ? [{ body: post.description, user: post.user }] : []),
    ...(post.comments ?? []),
  ];

  const closeModal = () => router.back();

  // ========= BOTTOM SHEET ANIMATION ==========
  const translateY = useSharedValue(600); // empieza abajo del todo

  React.useEffect(() => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
  }, []);

  const animatedSheet = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Gesture para bajar el modal
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 120) {
        translateY.value = withTiming(600, { duration: 200 }, () =>
          runOnJS(closeModal)()
        );
      } else {
        translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
      }
    });

  // ========= COMENTAR ==========
  const publish = async () => {
    const text = comment.trim();
    if (!text) return;

    try {
      setLoading(true);
      const updated = await addComment(post.id, text);
      setPost(updated);
      setComment("");

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      {/* BLUR BACKGROUND IG STYLE */}
      <Pressable
        onPress={closeModal}
        style={StyleSheet.absoluteFillObject}
      >
        <BlurView
          intensity={25}
          tint="dark"
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)" }}
        />
      </Pressable>

      {/* BOTTOM SHEET + PAN GESTURE */}
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sheet, animatedSheet]}>
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
            ref={scrollRef}
            style={{ maxHeight: "60%" }}
            showsVerticalScrollIndicator={false}
          >
            {comentarios.map((c, i) => (
              <View key={i} style={styles.commentRow}>
                <Image source={{ uri: c.user.image }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentUser}>{c.user.name}</Text>
                  <Text
                    style={i === 0 ? styles.description : styles.commentText}
                  >
                    {c.body}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* INPUT */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Agrega un comentario"
                placeholderTextColor="#999"
                value={comment}
                onChangeText={setComment}
                multiline
                style={styles.input}
              />

              <Pressable
                onPress={publish}
                style={[styles.button, loading && { opacity: 0.6 }]}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Publicando..." : "Publicar"}
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
