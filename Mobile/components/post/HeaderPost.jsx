import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePost } from "../../context/PostContext";
import { formateoFecha } from "../../utils/formateoFecha";
import { navigateToUser } from "../../utils/navigateToUser";

export default function HeaderPost() {
  const { post, isOwner, openDeleteModal } = usePost();
  const router = useRouter();

  const user = post.user;

  return (
    <View style={styles.container}>
      {/* Usuario clickable */}
      <TouchableOpacity
        style={styles.left}
        onPress={() => navigateToUser(user.id)}
      >
        <Image source={{ uri: user.image }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.date}>{formateoFecha(post.date)}</Text>
        </View>
      </TouchableOpacity>

      {/* Acciones si es dueño */}
      {isOwner && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => router.push(`/post/edit/${post.id}`)}
          >
            <MaterialIcons name="edit" size={22} color="#444" />
          </TouchableOpacity>

          <TouchableOpacity onPress={openDeleteModal}>
            <MaterialIcons name="delete-outline" size={22} color="#444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  username: {
    fontWeight: "600",
    color: "#111",
    fontSize: 15,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    gap: 14,
  },
});
