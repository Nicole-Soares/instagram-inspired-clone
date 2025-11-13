import { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { ActivityIndicator, Image, Text, View, StyleSheet, TouchableOpacity, FlatList, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Api from "../../service/Api.js";
import useUserHeader from "../../hooks/useUserHeader.jsx";

export default function PublicUserPage() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const userId = Array.isArray(id) ? id[0] : id;

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);     //usuario logueado
  const [user, setUser] = useState(null);     //usuario visitado
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState("");
  const [followPending, setFollowPending] = useState(false);

  useUserHeader(user?.name, { align: "left", backTitle: "Back" });
  
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setError(""); 
      setLoading(true);
      let meData = null;

      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          try {
            const meRes = await Api.getUser();
            meData = meRes?.data ?? meRes;
            if (!cancelled) setMe(meData);
          } catch {
            await AsyncStorage.removeItem("token");
          }
        }

        const res = await Api.getUserById(userId);
        const visited = res?.data ?? res;

        if (!visited || !visited.id) {
          throw new Error("Respuesta de API vacía o inválida.");
        }

        if (!cancelled) {
          setUser(visited);

          if (meData) {
            const visitedNumericId = Number(String(visited.id).replace("user_", ""));
            const isFollow = meData.following?.some((f) => 
              Number(typeof f === 'object' ? f.id : f) === visitedNumericId
            );
            setIsFollowing(!!isFollow);
          } else {
            setIsFollowing(false);
          }
        }
      } catch {
        if (!cancelled) setError("No se encontró el usuario");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [userId]);

  if (!loading && me?.id && user?.id && Number(me.id) === Number(user.id)) {
    router.replace("/profile");
    return null;
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error) return <Text style={{ padding: 16 }}>{error}</Text>;
  if (!user) return <Text style={{ padding: 16 }}>No se encontraron datos del usuario.</Text>;

  const requireAuth = async (ok) => {
    const t = await AsyncStorage.getItem("token");
    if (!t) {
      router.replace({ pathname: "/login", params: { returnTo: `/users/${userId}` } });
      return;
    }
    ok();
  };

  const handleToggleFollow = async () => {
  await requireAuth(async () => {
    if (!user) return;

    try {
      setFollowPending(true);
      const next = !isFollowing;
      setIsFollowing(next);

      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        const list = Array.isArray(prevUser.followers) ? prevUser.followers : [];
        const myId = me?.id ?? "me";
        const newFollowers = next
          ? [...list, { id: myId }]
          : list.slice(0, Math.max(0, list.length - 1));
        return { ...prevUser, followers: newFollowers };
      });

      await Api.toggleFollow(user.id);
    } catch (e) {
      
      setIsFollowing((prev) => !prev);
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        const list = Array.isArray(prevUser.followers) ? prevUser.followers : [];
        const myId = me?.id ?? "me";
        
        return isFollowing
          ? { ...prevUser, followers: [...list, { id: myId }] }
          : { ...prevUser, followers: list.slice(0, Math.max(0, list.length - 1)) };
      });
      console.error("Error al cambiar el estado de seguimiento:", e);
    } finally {
      setFollowPending(false);
    }
  });};

  const posts = user.posts || [];
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftBlock}>
          <Image source={{ uri: user.image }} style={styles.avatar} />

          <View style={styles.infoColumn}>
            <Text style={styles.name} numberOfLines={1}>{user.name}</Text>

            <View style={styles.statsColumn}>
              <Text style={styles.statLine}>
                <Text style={styles.statNumber}>{user.posts?.length || 0}</Text> Publicaciones
              </Text>
              <Text style={styles.statLine}>
                <Text style={styles.statNumber}>{user.followers?.length || 0}</Text> Seguidos
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.logoutButton, isFollowing && { backgroundColor: '#f3f4f6', borderColor: '#e5e7eb' }]}
          onPress={handleToggleFollow}
          disabled={followPending}
        >
          <Text style={[styles.logoutButtonText, isFollowing && { color: '#111827' }]}>
            {followPending ? "..." : (isFollowing ? "Dejar de seguir" : "Seguir")}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={3}
        data={sortedPosts || []}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={({ hovered, pressed }) => [
                styles.postTouchable,
                hovered && { opacity: 0.85 },
                pressed && { opacity: 0.9 } 
            ]}
            onPress={() => {
                router.push(`/post/${item.id}`); 
            }} >
            <Image
                source={{ uri: item.image }}
                style={styles.postImage}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.noPosts}>Aún no hay publicaciones</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 40,
  },

  leftBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,            
  },

  avatar: { 
    width: 75, 
    height: 75,
    borderRadius: 64,
    marginRight: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 222, 226, 0.93)'
  },

  infoColumn: {
    flexShrink: 1 
  },

  name: { 
    fontSize: 24, 
    fontWeight: '700'
  },

  statsColumn: {
    marginTop: 10
  },

  statLine: {
    color: '#6b7280',
    marginTop: 8
  },

  statNumber: {
    fontWeight: '700',
    color: '#111827'
  },

  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1a57ffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },

  logoutButtonText: {
    color: "#fff", 
    fontWeight: "500",
    fontSize: 13
  },

  postTouchable: {
    width: "33.3333%", 
    aspectRatio: 0.6,
    borderWidth: 1.5, 
    borderColor: '#fff',
  },
  
  postImage: { 
    width: '100%',
    height: '100%'
  },

  noPosts: { 
    textAlign: "center", 
    color: "#888", 
    marginTop: 40 
  }

});
