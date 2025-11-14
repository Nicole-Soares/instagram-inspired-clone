import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Redirect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorScreen from "../../components/ErrorScreen";
import Info from "../../components/Info";
import InstagramSpinner from "../../components/InstagramSpinner";
import NotFoundScreen from "../../components/NotFoundScreen";
import DeletePostModal from "../../components/post/DeletePostModal";
import HeaderPost from "../../components/post/HeaderPost";
import { getPostById } from "../../service/Api";
import { isTokenExpired } from "../../utils/isTokenExpired";

import { useFocusEffect } from "@react-navigation/native";

export const options = {
  headerShown: false,
};

export default function Post() {
  const { id, updatedPost } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [post, setPost] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isError, setIsError] = useState(false);


  const fetchPost = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      setIsUnauthorized(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getPostById(id);
      const loggedUserId = await AsyncStorage.getItem("userId");

      setPost(data);
      setIsOwner(String(loggedUserId) === String(data.user.id));

      navigation.setOptions({
        title: `Post - ${data.user.name}`, 
      });

    } catch (error) {
      const status = error.response?.status || error.status;
      if (status === 401) setIsUnauthorized(true);
      else if (status === 404) setIsNotFound(true);
      else setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // carga del post
  useEffect(() => {
    fetchPost();
  }, [id]);

  // cuando se cierra el modal de los comentarios
  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [id])
  );

  const handleUpdatePost = (updated) => setPost(updated);

  const handleEdit = () => router.push(`/post/edit/${id}`);
  const handleDelete = () => setShowDeleteModal(true);
  const handleNavigateToUser = (userId) => {
    router.push(`/users/${userId}`);
  };
  
  

  if (isError) return <ErrorScreen />;
  if (isUnauthorized) return <Redirect href="/login" />;
  if (isNotFound) return <NotFoundScreen />;

  if (loading)
    return (
      <View style={styles.centered}>
        <InstagramSpinner size="large" />
        <Text>Cargando post...</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <HeaderPost
        user={post.user}
        date={post.date}
        isOwner={isOwner}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
        handleNavigateToUser={handleNavigateToUser}
      />

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.image} />
      )}

      <Info
        post={post}
        postId={id}
        onUpdatePost={handleUpdatePost}
        onShowComments={() =>
          router.push({
            pathname: "/(modal)/comments/[postId]",
            params: { postId: post.id, post: JSON.stringify(post) }
          })

        }

      />

      {showDeleteModal && (
        <DeletePostModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          postId={id}
        />
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: 12,
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 700,
    borderRadius: 8,
    marginBottom: 16,
  },
});