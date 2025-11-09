import { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { ActivityIndicator, Button, Image, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../../service/Api";

export default function PublicUserPage() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const userId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);     // usuario logueado (si hay token)
  const [user, setUser] = useState(null); // usuario visitado
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) si hay token, intento obtener “me”
        const token = await AsyncStorage.getItem("token");
        if (token) {
          try {
            // Soporta ambas APIs: Api.getMe() o Api.getUser() sin id
            const meRes = Api.getMe ? await Api.getMe() : await Api.getUser();
            const meData = meRes?.data ?? meRes;
            if (!cancelled) setMe(meData);
          } catch {
            // si falla, no bloquea el público
            await AsyncStorage.removeItem("token");
          }
        }

        // 2) obtengo el usuario visitado
        const res = await Api.getUser(userId); // en tu profe: Api.getUser(Number(id))
        const visited = res?.data ?? res;
        if (!cancelled) {
          setUser(visited);
          navigation.setOptions({ title: visited?.name ?? "Usuario" });
        }
      } catch {
        if (!cancelled) setError("No se encontró el usuario");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [userId, navigation]);

  // Si estoy mirando MI propio perfil, redirijo al tab de perfil
  if (!loading && me?.id && user?.id && Number(me.id) === Number(user.id)) {
    router.replace("/profile");
    return null;
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error)   return <Text style={{ padding: 16 }}>{error}</Text>;

  const requireAuth = async (ok) => {
    const t = await AsyncStorage.getItem("token");
    if (!t) {
      router.replace({ pathname: "/login", params: { returnTo: `/users/${userId}` } });
      return;
    }
    ok();
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{user?.name}</Text>
      <Text>{user?.email}</Text>
      {!!user?.image && (
        <Image
          source={{ uri: user.image }}
          style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "#eee" }}
        />
      )}

      {/* Seguir / Dejar de seguir — protegido */}
      <Button
        title="Seguir / Dejar de seguir"
        onPress={() =>
          requireAuth(async () => {
            // TODO: llamá a tu endpoint real de follow/unfollow con userId
            // await Api.toggleFollow(userId)
          })
        }
      />

      <View style={{ marginTop: 12 }}>
        <Text style={{ fontWeight: "700" }}>Posts</Text>
        {/* TODO: renderizá user.posts si tu API lo trae */}
      </View>
    </View>
  );
}
