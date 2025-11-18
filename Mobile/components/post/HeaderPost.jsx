import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formateoFecha } from "../../utils/formateoFecha";

export default function HeaderPost({
  user,
  date,
  isOwner,
  onEditClick,
  onDeleteClick,
  handleNavigateToUser,
}) {
  return (
    <View style={styles.container}>
      
      {/* Usuario clickable */}
      <TouchableOpacity
        style={styles.left}
        onPress={() => handleNavigateToUser(user.id)}
      >
        <Image source={{ uri: user.image }} style={styles.avatar} />

        <View>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.date}>{formateoFecha(date)}</Text>
        </View>
      </TouchableOpacity>

      {/* Acciones solo si es dueño */}
      {isOwner && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onDeleteClick}>
            <MaterialIcons name="delete-outline" size={22} color="#444" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onEditClick} style={{ marginLeft: 10 }}>
            <MaterialIcons name="edit" size={22} color="#444" />
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
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
