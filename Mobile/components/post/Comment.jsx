import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Comment({ comment, handleNavigateToUser }) {
  const handleUserClick = () => {
    if (comment?.user?.id) handleNavigateToUser(comment.user.id);
  };

  return (
    <View style={styles.commentContainer}>
      <TouchableOpacity onPress={handleUserClick} activeOpacity={0.7}>
        <Image
          source={{ uri: comment.user?.image }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <TouchableOpacity onPress={handleUserClick} activeOpacity={0.7}>
          <Text style={styles.userName}>{comment.user?.name}</Text>
        </TouchableOpacity>
        <Text style={styles.commentBody}>{comment.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userName: {
    fontWeight: "bold",
    color: "#222",
    fontSize: 14,
  },
  commentBody: {
    color: "#555",
    fontSize: 14,
    marginTop: 2,
    lineHeight: 18,
  },
});
