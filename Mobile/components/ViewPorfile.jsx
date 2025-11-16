import { router } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useLogout from "../hooks/useLogout";

const ViewProfile = ({ user, setToken }) => {
  const handleLogout = useLogout(setToken);

  if (!user) return null;

  const posts = user.posts || [];
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <FlatList
      data={sortedPosts}
      numColumns={3}
      keyExtractor={(item) => String(item.id)}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.leftBlock}>
            <Image source={{ uri: user.image }} style={styles.avatar} />

            <View style={styles.infoColumn}>
              <Text style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>

              <View style={styles.statsColumn}>
                <Text style={styles.statLine}>
                  <Text style={styles.statNumber}>
                    {user.posts?.length || 0}
                  </Text>{" "}
                  Publicaciones
                </Text>
                <Text style={styles.statLine}>
                  <Text style={styles.statNumber}>
                    {user.followers?.length || 0}
                  </Text>{" "}
                  Seguidos
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.postTouchable}
          onPress={() => router.push(`/post/${item.id}`)}
        >
          <Image source={{ uri: item.image }} style={styles.postImage} />
        </Pressable>
      )}
      ListEmptyComponent={
        <Text style={styles.noPosts}>Aún no hay publicaciones</Text>
      }
      contentContainerStyle={{ paddingBottom: 0 }}
    />
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 30,
  },

  leftBlock: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  avatar: {
    width: 75,
    height: 75,
    borderRadius: 64,
    marginRight: 20,
    borderWidth: 1,
    borderColor: "rgba(226, 222, 226, 0.93)",
  },

  infoColumn: {
    flexShrink: 1,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
  },

  statsColumn: {
    marginTop: 10,
  },

  statLine: {
    color: "#6b7280",
    marginTop: 8,
  },

  statNumber: {
    fontWeight: "700",
    color: "#111827",
  },

  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#1a57ff",
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 13,
  },

  // 📌 FOTOS 100% AL ESTILO INSTAGRAM
  postTouchable: {
    width: "33.333%",
    aspectRatio: 1, // CUADRADO PERFECTO -> IG exacto
    borderWidth: 1,
    borderColor: "#fff",
  },

  postImage: {
    width: "100%",
    height: "100%",
  },

  noPosts: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
  },
});

export default ViewProfile;
