import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { toggleLike } from "../service/Api";

export default function Info({ post, postId, onUpdatePost, onShowComments }) {
  const handleLike = async () => {
    try {
      const updatedPost = await toggleLike(postId);
      onUpdatePost(updatedPost);
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* ---- ICONOS (like y comentarios) ---- */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
          <MaterialIcons
            name="favorite-border"
            size={22}
            color="#444"
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
            {post.comments?.length || 0}
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
});
