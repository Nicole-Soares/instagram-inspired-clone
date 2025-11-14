import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Button, ScrollView, ActivityIndicator, Image, Alert } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPostById, updatePost } from "../../../service/Api";
import { isTokenExpired } from "../../../utils/isTokenExpired";
import NotFoundScreen from "../../../components/NotFoundScreen";
import ErrorScreen from "../../../components/ErrorScreen";
import styles from "./styles";

export default function PostEdit() {
    const { id } = useLocalSearchParams(); // Obtiene el ID del post desde la URL

    // Estados de datos
    const [imageUrl, setImageUrl] = useState("");
    const [caption, setCaption] = useState("");

    // Estados de UI y control
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Estados de errores y permisos
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [isForbidden, setIsForbidden] = useState(false); 
    const [isNotFound, setIsNotFound] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // --- LÓGICA DE CARGA Y VERIFICACIÓN ---
    const fetchPost = useCallback(async () => {
        const token = await AsyncStorage.getItem("token");

        if (!token || isTokenExpired(token)) {
            setIsUnauthorized(true);
            return;
        }

        try {
            setLoading(true);
            const data = await getPostById(id);
            const loggedUserId = await AsyncStorage.getItem("userId");

            if (String(loggedUserId) !== String(data.user.id)) {
                setIsForbidden(true);
                return;
            }

            setImageUrl(data.image || "");
            setCaption(data.description || "");

        } catch (error) {
            const status = error.response?.status || error.status;
            if (status === 401) setIsUnauthorized(true);
            else if (status === 404) setIsNotFound(true);
            else setErrorMessage("Error al cargar el post para editar.");

        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleSubmit = async () => {
        if (submitting) return;

        try {
            setSubmitting(true);

            // Lógica de validación básica
            if (!imageUrl.trim()) {
                setErrorMessage("La URL de la imagen no puede estar vacía.");
                return;
            }

            // 1. Llamada a la API para la edición (PUT)
            await updatePost(id, imageUrl, caption);

            // 2. Redireccionar al post actualizado
            router.replace(`/post/${id}`);

        } catch (error) {
            const msg = error.response?.data?.message || "No se pudo guardar la edición.";
            setErrorMessage(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // --- RENDERIZADO CONDICIONAL DE ERRORES/PERMISOS ---

    if (isUnauthorized) return <Redirect href="/login" />;
    if (isForbidden) return <ErrorScreen title="Acceso Denegado" message="No tienes permiso para editar este post." />;
    if (isNotFound) return <NotFoundScreen />;
    if (loading) return <ActivityIndicator size="large" style={styles.centered} />;
    if (errorMessage) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
        );
    }



    // --- RENDERIZADO DEL FORMULARIO ---
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Editar Publicación</Text>

            <View style={styles.previewBox}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                ) : (
                    <Text style={styles.placeholder}>Vista Previa de Imagen</Text>
                )}
            </View>

            <TextInput
                style={styles.input}
                placeholder="URL de la imagen"
                value={imageUrl}
                onChangeText={(text) => {
                    setCaption(text); 
                    if (errorMessage) setErrorMessage(""); 
                }}
                keyboardType="url"
                autoCapitalize="none"
                editable={!submitting}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Escribe una descripción..."
                value={caption}
                onChangeText={(text) => {
                    setCaption(text); 
                    if (errorMessage) setErrorMessage("");
                }}
                multiline
                editable={!submitting}
            />

            <Button
                title={submitting ? "Guardando..." : "Guardar Cambios"}
                onPress={handleSubmit}
                disabled={submitting}
                color="#7F8CFF"
            />
        </ScrollView>
    );
}

