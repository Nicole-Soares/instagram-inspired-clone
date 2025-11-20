import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addComment } from "../../../service/Api";
import { formateoFecha } from "../../../utils/formateoFecha";
import { navigateToUser } from "../../../utils/navigateToUser";
import styles from "./styles";

export default function CommentsModal() {
  const { id, post: postParam } = useLocalSearchParams();
  const [post, setPost] = useState(JSON.parse(postParam));
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const insets = useSafeAreaInsets();

  const comentarios = [
    ...(post.description ? [{ body: post.description, user: post.user }] : []),
    ...(post.comments ?? []),
  ];

  const closeModal = () => router.back();

  const translateY = useSharedValue(600);

  React.useEffect(() => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
  }, []);

  const animatedSheet = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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

  const publish = async () => {
    const text = comment.trim();

    if (!text) {
      setError("No podés enviar un comentario vacío");
      return;
    }

    setError("");

    try {
      setLoading(true);
      const updated = await addComment(post.id, text);
      setPost(updated);
      setComment("");

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 250);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Pressable onPress={closeModal} style={StyleSheet.absoluteFillObject}>
        <BlurView
          intensity={25}
          tint="dark"
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)" }}
        />
      </Pressable>
      <Animated.View style={[styles.sheet, animatedSheet]}>
        <GestureDetector gesture={pan}>
          <View style={styles.handle} />
        </GestureDetector>

        <Pressable
          style={styles.headerContainer}
          onPress={() => navigateToUser(post.user.id)}
        >
          <Image source={{ uri: post.user.image }} style={styles.headerAvatar} />

          <View style={{ flex: 1 }}>
            <Text style={styles.headerUserName}>{post.user.name}</Text>
            <Text style={styles.headerDateText}>
              {formateoFecha(post.date)}
            </Text>
          </View>
        </Pressable>

        <View style={styles.separator} />

        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {comentarios.map((c, i) => (
              <View key={i} style={styles.commentRow}>
                <Pressable onPress={() => navigateToUser(c.user.id)}>
                  <Image source={{ uri: c.user.image }} style={styles.avatar} />
                </Pressable>

                <View style={{ flex: 1 }}>
                  <Pressable onPress={() => navigateToUser(c.user.id)}>
                    <Text style={styles.commentUser}>{c.user.name}</Text>
                  </Pressable>

                  <Text
                    style={i === 0 ? styles.description : styles.commentText}
                  >
                    {c.body}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            style={[
              styles.inputContainer,
              { paddingBottom: insets.bottom + 12 },
            ]}
          >
            <TextInput
              placeholder="Agrega un comentario"
              placeholderTextColor="#999"
              value={comment}
              onChangeText={(t) => {
                setComment(t);
                if (error) setError("");
              }}
              multiline
              style={styles.input}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
              onPress={publish}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>
                {loading ? "Publicando..." : "Publicar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
