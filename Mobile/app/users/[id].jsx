import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFollow } from "../../hooks/followContext.jsx";
import useUserHeader from "../../hooks/useUserHeader.jsx";
import * as Api from "../../service/Api.js";
import styles from "./styles.jsx";

const cleanId = (v) => String(v ?? "").replace(/^user_/, "");

export default function PublicUserPage() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const followedParam = Array.isArray(params.followed)
    ? params.followed[0]
    : params.followed;

  const userId = id;

  const { isFollowing: isFollowingCtx, toggleFollow, pendingIds } = useFollow();

  const hint =
    typeof followedParam !== "undefined" &&
    ["1", "true", "yes"].includes(String(followedParam).toLowerCase());

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null); 
  const [user, setUser] = useState(null); 
  const [isFollowingUI, setIsFollowingUI] = useState(hint);
  const [error, setError] = useState("");

  useUserHeader(user?.name, { align: "left", backTitle: "Back" });

  const followingCtx = isFollowingCtx ? isFollowingCtx(userId) : false;
  useEffect(() => {
    setIsFollowingUI(followingCtx);
  }, [followingCtx, userId]);

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

        if (!visited || !visited.id)
          throw new Error("Respuesta de API vacía o inválida.");
        if (!cancelled) setUser(visited);
      } catch {
        if (!cancelled) setError("No se encontró el usuario");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!loading && me?.id && user?.id && Number(me.id) === Number(user.id)) {
    router.replace("/profile");
    return null;
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error) return <Text style={{ padding: 16 }}>{error}</Text>;
  if (!user)
    return (
      <Text style={{ padding: 16 }}>No se encontraron datos del usuario.</Text>
    );

  const requireAuth = async (ok) => {
    const t = await AsyncStorage.getItem("token");
    if (!t) {
      router.replace({
        pathname: "/login",
        params: { returnTo: `/users/${userId}` },
      });
      return;
    }
    ok();
  };

  const handleToggleFollow = async () => {
    const originalIsFollowing = isFollowingUI;

    await requireAuth(async () => {
      setIsFollowingUI((prev) => !prev);

      try {
        const apiRes = await toggleFollow(user.id);
        const newMeData = apiRes?.data?.currentUser ?? apiRes?.data ?? apiRes;

        if (newMeData) {
          setMe(newMeData);
        }
      } catch (e) {
        console.error("Error al seguir/dejar de seguir:", e);
        setIsFollowingUI(originalIsFollowing);
      }
    });
  };

  const posts = user.posts || [];
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const pending = pendingIds?.has(cleanId(userId));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftBlock}>
          <Image source={{ uri: user.image }} style={styles.avatar} />

          <View style={styles.infoColumn}>
            <Text style={styles.name} numberOfLines={1}>
              {user.name}
            </Text>

            <View style={styles.statsColumn}>
              <Text style={styles.statLine}>
                <Text style={styles.statNumber}>{user.posts?.length || 0}</Text>{" "}
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

        <TouchableOpacity
          disabled={pending}
          onPress={handleToggleFollow}
          style={[
            styles.followButton,
            isFollowingUI ? styles.followOutline : styles.followPrimary,
            pending && { opacity: 0.2 },
          ]}
        >
          <Text
            style={[
              styles.followButtonText,
              isFollowingUI && styles.followButtonTextOutline,
            ]}
          >
            {isFollowingUI ? "Dejar de seguir" : "Seguir"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={3}
        data={sortedPosts || []}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ hovered, pressed }) => [
              styles.postTouchable,
              hovered && { opacity: 0.85 },
              pressed && { opacity: 0.9 },
            ]}
            onPress={() => {
              router.push(`/post/${item.id}`);
            }}
          >
            <Image source={{ uri: item.image }} style={styles.postImage} />
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.noPosts}>Aún no hay publicaciones</Text>
        }
      />
    </View>
  );
}
