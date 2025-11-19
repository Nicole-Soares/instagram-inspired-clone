import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useCallback, useContext, useState } from "react";
import { deletePost, getPostById, likePost } from "../service/Api";
import { isTokenExpired } from "../utils/isTokenExpired";

const PostContext = createContext();

export function PostProvider({ postId, children }) {
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // abrir/cerrar desde cualquier componente
  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  // =============== FETCH POST =====================
  const reloadPost = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      setIsUnauthorized(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getPostById(postId);

      setPost(data);

      const loggedUserId = await AsyncStorage.getItem("userId");
      setIsOwner(String(loggedUserId) === String(data.user.id));
    } catch (error) {
      const status = error.response?.status;

      if (status === 401) setIsUnauthorized(true);
      else if (status === 404) setIsNotFound(true);
      else setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // =============== LIKE ============================
  const toggleLike = async () => {
    if (!post?.id) return;

    try {
      const updated = await likePost(post.id);
      setPost(updated);
    } catch (err) {
      console.log("Error al likear:", err);
    }
  };

  // =============== DELETE =============================
  const removePost = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deletePost(post.id);
      closeDeleteModal();
      router.replace("/home");
    } catch (err) {
      console.log("Error al borrar:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PostContext.Provider
      value={{
        post,
        setPost,
        isOwner,
        loading,
        isUnauthorized,
        isNotFound,
        isError,
        isDeleting,

        // acciones
        reloadPost,
        toggleLike,
        removePost,

        // modal
        showDeleteModal,
        openDeleteModal,
        closeDeleteModal,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export const usePost = () => useContext(PostContext);
