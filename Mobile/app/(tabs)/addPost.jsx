// app/(tabs)/addPost.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createPost } from "../../service/Api"; // usa tu API real

export default function AddPost() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const onPublish = async () => {
    if (!imageUrl.trim()) {
      Alert.alert("Falta imagen", "Ingresá una URL de imagen (http/https).");
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Sesión expirada", "Iniciá sesión para publicar.");
        return router.replace("/login");
      }

      const { id } = await createPost(imageUrl.trim(), comment.trim());
      setImageUrl("");
      setComment("");
      Alert.alert("Éxito", "Post creado con éxito 🎉");
      router.push(`/post/${id}`);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error al crear la publicación.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header propio (porque en tabs tenés headerShown:false) */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Crear publicación</Text>
        <View style={{ width: 24 }} />{/* spacer para centrar el título */}
      </View>

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {/* Input: Image (URL) */}
        <TextInput
          style={s.input}
          placeholder="Image"
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
        />

        {/* Preview gris con ícono y texto, o la imagen si hay URL */}
        <View style={s.preview}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={s.previewImage} />
          ) : (
            <View style={s.placeholder}>
              <MaterialCommunityIcons name="camera-plus-outline" size={72} color="#222" />
              <Text style={s.placeholderText}>Agregar imagen</Text>
            </View>
          )}
        </View>

        {/* Textarea: comentario */}
        <TextInput
          style={[s.input, s.textarea]}
          placeholder="Agrega un comentario"
          value={comment}
          onChangeText={setComment}
          multiline
          textAlignVertical="top"
        />

        {/* Botón Publicar */}
        <TouchableOpacity
          onPress={onPublish}
          disabled={loading}
          style={[s.primaryBtn, loading && { opacity: 0.7 }]}
        >
          <Text style={s.primaryBtnText}>{loading ? "Publicando…" : "Publicar"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  backBtn: { width: 24, height: 24, justifyContent: "center", alignItems: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600", color: "#111" },

  content: { padding: 12, gap: 12 },

  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
  },

  preview: {
    height: 400,               // alto grande como el figma
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },

  placeholder: { justifyContent: "center", alignItems: "center", gap: 10 },
  placeholderText: { fontSize: 20, color: "#222" },

  textarea: { minHeight: 90 },

  primaryBtn: {
    backgroundColor: "#7F8CFF", // violeta del figma
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
