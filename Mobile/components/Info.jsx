import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Info({
  post,
  liked = false,
  likesCount = 0,
  commentsCount,
  onToggleLike,
  onShowComments,
}) {
  const safeLikes =
    Number.isFinite(likesCount)
      ? likesCount
      : Number(post?.likesCount ?? post?.likes?.length ?? 0) || 0;

  const safeComments =
    typeof commentsCount === "number"
      ? commentsCount
      : Number(post?.commentsCount ?? post?.comments?.length ?? 0) +
        (post?.description?.trim() ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onToggleLike?.(!liked)}
        >
          <MaterialIcons
            name={liked ? "favorite" : "favorite-border"}
            size={22}
            color={liked ? "red" : "#444"}
            style={styles.icon}
          />
          <Text style={styles.iconText}>{safeLikes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={onShowComments}>
          <MaterialIcons
            name="chat-bubble-outline"
            size={22}
            color="#444"
            style={styles.icon}
          />
          <Text style={styles.iconText}>{safeComments}</Text>
        </TouchableOpacity>
      </View>

      {post?.description ? (
        <Text style={styles.description}>{post.description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8, marginHorizontal: 12 },
  actionsRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  iconButton: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  icon: { marginRight: 4 },
  iconText: { fontSize: 15, color: "#444" },
  description: { fontSize: 15, color: "#222", marginTop: 6, lineHeight: 20 },
});
