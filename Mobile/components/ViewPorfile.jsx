import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ViewProfile = ({ user, setToken }) => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Querés salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          setToken("");
          router.replace("/login");
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header con avatar e info */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              user.image ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.username}>@{user.username || user.name}</Text>
          <Text style={styles.name}>{user.name || "Usuario"}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.posts?.length || 0}</Text>
              <Text style={styles.statLabel}>Publicaciones</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.followers?.length || 0}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.following?.length || 0}</Text>
              <Text style={styles.statLabel}>Seguidos</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts grid */}
      <FlatList
        numColumns={3}
        data={user.posts || []}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={styles.postImage}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.noPosts}>Aún no hay publicaciones</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },
  header: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 10 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginRight: 16 },
  infoContainer: { flex: 1 },
  username: { fontSize: 18, fontWeight: "bold" },
  name: { color: "#777", fontSize: 14, marginBottom: 6 },
  statsRow: { flexDirection: "row", marginTop: 8 },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontWeight: "bold", fontSize: 16 },
  statLabel: { color: "#777", fontSize: 12 },
  editButton: {
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbdbdb",
    alignItems: "center",
  },
  editButtonText: { color: "black", fontWeight: "500" },
  logoutButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#efefef",
    alignItems: "center",
  },
  logoutText: { color: "red", fontWeight: "500" },
  postImage: { width: "33%", height: 120 },
  noPosts: { textAlign: "center", color: "#888", marginTop: 20 },
});

export default ViewProfile;
