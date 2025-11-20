import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { likePost } from "../../service/Api";

export default function InfoTimeline({ post, onUpdatePost }) {
  const router = useRouter();

  const [loggedUserId, setLoggedUserId] = useState(null);
  const [userHasLiked, setUserHasLiked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await AsyncStorage.getItem("userId");
      setLoggedUserId(id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (post && loggedUserId) {
      setUserHasLiked(post.likes?.some((like) => like.id === loggedUserId));
    }
  }, [post, loggedUserId]);

  const handleLike = async () => {
    try {
      const updated = await likePost(post.id);
      onUpdatePost?.(updated);
    } catch (e) {}
  };

  const openComments = () => {
    router.push({
      pathname: "/(modal)/comments/[postId]",
      params: {
        postId: post.id,
        post: JSON.stringify(post),
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
          <MaterialIcons
            name={userHasLiked ? "favorite" : "favorite-border"}
            size={22}
            color={userHasLiked ? "red" : "#444"}
          />
          <Text style={styles.iconText}>{post.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={openComments}>
          <MaterialIcons name="chat-bubble-outline" size={22} color="#444" />
          <Text style={styles.iconText}>
            {(post.comments?.length || 0) + (post.description ? 1 : 0)}
          </Text>
        </TouchableOpacity>
      </View>

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
  iconText: {
    marginLeft: 4,
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
