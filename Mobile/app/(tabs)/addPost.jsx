import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Redirect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InstagramSpinner from "../../components/InstagramSpinner";
import { createPost } from "../../service/Api";
import { isTokenExpired } from "../../utils/isTokenExpired";

export default function AgregarPost() {
  const [url, setUrl] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errDesc, setErrDesc] = useState("");
  const router = useRouter();
  const scrollRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token || isTokenExpired(token)) setIsUnauthorized(true);
    };
    checkAuth();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsError(false);
      setErrDesc("");
      setUrl("");
      setDescripcion("");
    }, [])
  );

  useEffect(() => {
    if (isError && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [isError]);

  const isValidUrl = (string) => /^https?:\/\/.+/i.test(string);

  const handleSubmit = async () => {
    if (!url.trim()) {
      setIsError(true);
      setErrDesc("Tiene que agregar una URL");
      return;
    }

    try {
      setLoading(true);
      const nuevoPost = await createPost(url, descripcion);
      router.replace(`/post/${nuevoPost.id}?from=add`);
      setUrl("");
      setDescripcion("");
      setIsError(false);
      setErrDesc("");
    } catch (error) {
      const status = error.response?.status || error.status;
      if (status === 401) {
        setIsUnauthorized(true);
      } else {
        setIsError(true);
        setErrDesc(
          "Error al crear la publicación: solo se permiten URLs del tipo http o https."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (isUnauthorized) return <Redirect href="/login" />;

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <InstagramSpinner />
        <Text style={{ marginTop: 8, color: "#666" }}>Publicando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear publicación</Text>
        </View>

        <TextInput
          style={[
            styles.input,
            isError && !url.trim() ? { borderColor: "#f5c6cb" } : {},
          ]}
          placeholder="URL de la imagen"
          value={url}
          onChangeText={(text) => {
            setUrl(text);
            if (isError) {
              setIsError(false);
              setErrDesc("");
            }
          }}
          placeholderTextColor="#999"
        />

        <View style={styles.imageBox}>
          {isValidUrl(url) ? (
            <Image source={{ uri: url }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <MaterialIcons name="add-a-photo" size={70} color="#666" />
              <Text style={styles.placeholderText}>Agregar imagen</Text>
            </View>
          )}
        </View>

        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Agrega un comentario"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          placeholderTextColor="#999"
        />

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonActive,
            loading && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.buttonText}>Publicar</Text>
        </Pressable>

        {isError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {errDesc ? `⚠️ ${errDesc}` : "Ocurrió un error inesperado."}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 4,
    color: "#333",
  },
  imageBox: {
    width: "100%",
    height: 300,
    backgroundColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: "#555",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#7F8CFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonActive: {
    backgroundColor: "#6E79E6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: "#fdecea",
    borderWidth: 1,
    borderColor: "#f5c6cb",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    alignItems: "center",
  },
  errorText: {
    color: "#a94442",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
