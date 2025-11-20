import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // ← IMPORTANTE
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePost } from "../../context/PostContext";

export default function Info() {
  const { post, toggleLike } = usePost();
  const router = useRouter(); 

  const [loggedUserId, setLoggedUserId] = useState(null);
  const [userHasLiked, setUserHasLiked] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setLoggedUserId(id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (post && loggedUserId) {
      setUserHasLiked(post.likes?.some((like) => like.id === loggedUserId));
    }
  }, [post, loggedUserId]);

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleLike}>
          <MaterialIcons
            name={userHasLiked ? "favorite" : "favorite-border"}
            size={22}
            color={userHasLiked ? "red" : "#444"}
            style={styles.icon}
          />
          <Text style={styles.iconText}>{post.likes?.length || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            router.push({
              pathname: "/(modal)/comments/[postId]",
              params: { postId: post.id, post: JSON.stringify(post) },
            })
          }
        >
          <MaterialIcons
            name="chat-bubble-outline"
            size={22}
            color="#444"
            style={styles.icon}
          />
          <Text style={styles.iconText}>
            {(post.comments?.length || 0) +
              (post.description?.trim() ? 1 : 0)}
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
