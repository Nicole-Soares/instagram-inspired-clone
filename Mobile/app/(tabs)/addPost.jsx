import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Redirect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

  //verifica token
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token || isTokenExpired(token)) setIsUnauthorized(true);
    };
    checkAuth();
  }, []);

  //Limpia al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      setIsError(false);
      setErrDesc("");
      setUrl("");
    }, [])
  );

  const isValidUrl = (string) => {
    return /^https?:\/\/.+/i.test(string);
  };

  //crea el post
  const handleSubmit = async () => {
    if (!url.trim()) {
      setIsError(true);
      setErrDesc("Tiene que agregar una url");
      return;
    }

    try {
      setLoading(true);
      const nuevoPost = await createPost(url, descripcion);
      router.replace(`/post/${nuevoPost.id}?from=add`);
      setUrl("");
      setDescripcion("");
      setIsError("");
    } catch (error) {
      const status = error.response?.status || error.status;
      if (status === 401) {
        setIsUnauthorized(true);
      } else {
        setIsError(true);
        setErrDesc(
          "Error al crear la publicacion: Solo se permiten URLs del tipo http o https."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (isUnauthorized) {
    return <Redirect href="/login" />;
  }

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
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear publicación</Text>
        </View>

        {/* Input de URL de la imagen */}
        <TextInput
          style={styles.input}
          placeholder="URL de la imagen"
          value={url}
          onChangeText={setUrl}
          placeholderTextColor="#999"
        />

        {/* Preview de la imagen*/}

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
        {/* Input de descripción */}
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Agrega un comentario"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          placeholderTextColor="#999"
        />

        {/*boton publicar*/}
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
        {/*mensaje de error*/}
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
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 8,
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
    transition: "background-color 0.2s",
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
