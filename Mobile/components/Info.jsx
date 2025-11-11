import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { likePost } from "../service/Api";

export default function Info({ post, postId, onUpdatePost, handleRedirect }) {
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setCurrentUserId(id);
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (post?.likes && currentUserId) {
      setUserHasLiked(post.likes.some((like) => String(like.id) === String(currentUserId)));
    }
  }, [post, currentUserId]);

  const handleClickLike = async () => {
    try {
      const updatedPost = await likePost(postId);

      const hasLikedNow = updatedPost.likes.some(
        (like) => String(like.id) === String(currentUserId)
      );

      setUserHasLiked(hasLikedNow);

      Alert.alert(
        "Me gusta",
        hasLikedNow
          ? "¡Me gusta registrado! ❤️"
          : "¡Me gusta eliminado! 💔"
      );

      if (onUpdatePost) onUpdatePost(updatedPost);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al procesar el 'Me gusta'.");
    }
  };

  return (
    <View style={styles.infoPost}>
      <TouchableOpacity onPress={handleClickLike} style={styles.row}>
        <Text style={styles.icon}>{userHasLiked ? "❤️" : "🤍"}</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>{post.likes?.length || 0}</Text> me gusta
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRedirect} style={styles.row}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>{post.comments?.length || 0}</Text>{" "}
          comentarios
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  infoPost: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    marginRight: 4,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
});
