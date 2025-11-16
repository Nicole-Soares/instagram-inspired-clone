import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { likePost } from "../service/Api";

export default function Info({
  post,
  postId,
  onUpdatePost,
  onShowComments,
  onLikeError,
}) {
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [userHasLiked, setUserHasLiked] = useState(false);


  useEffect(() => {
    // Cargar el ID del usuario logueado
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setLoggedUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (post && loggedUserId) {
      const hasLiked = post.likes?.some((like) => like.id === loggedUserId);
      setUserHasLiked(hasLiked);
    }
  }, [post, loggedUserId]);

  const handleLike = async () => {
    try {
      const updatedPost = await likePost(postId);
      if (onUpdatePost) onUpdatePost(updatedPost);
    } catch (error) {
      if (onLikeError) onLikeError(); 
    }
  };

  return (
    <View style={styles.container}>
      {/* ---- LIKE Y COMENTAR ---- */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
          <MaterialIcons
            name={userHasLiked ? "favorite" : "favorite-border"}
            size={22}
            color={userHasLiked ? "red" : "#444"}
            style={styles.icon}
          />
          <Text style={styles.iconText}>{post.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={onShowComments}>
          <MaterialIcons
            name="chat-bubble-outline"
            size={22}
            color="#444"
            style={styles.icon}
          />
          <Text style={styles.iconText}>
            {(post.comments?.length || 0) + (post.description?.trim() ? 1 : 0)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---- DESCRIPCIÓN ---- */}
      {post.description ? (
        <Text style={styles.description}>{post.description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginHorizontal: 12,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    marginRight: 4,
  },
  iconText: {
    fontSize: 15,
    color: "#444",
  },
  description: {
    fontSize: 15,
    color: "#222",
    marginTop: 6,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: "#ffe6e6",
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  errorText: {
    color: "#b00020",
    fontSize: 14,
  },
});
