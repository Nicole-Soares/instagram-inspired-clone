import React, { useMemo } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import Info from "../Info";
import { formateoFecha } from "../../utils/formateoFecha";
import styles from "./styles";

export default function TimelinePost({ post, onUpdatePost }) {
  const user = post?.user ?? {};
  const postDate = post?.date || post?.createdAt || "";
  const imageUri = post?.image;

  const commentsCount = useMemo(
    () => Number(post?.commentsCount ?? post?.comments?.length ?? 0),
    [post]
  );

  const handleNavigateToUser = () => {
    if (user?.id != null) router.push(`/users/${user.id}`);
  };

  const handleRedirectToPost = () => {
    router.push(`/post/${post.id}`);
  };

  const handleShowComments = () => {
    router.push({
      pathname: `/comments/${post.id}`,
      params: { post: JSON.stringify(post) },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable style={styles.userBlock} onPress={handleNavigateToUser}>
          {user?.image ? (
            <Image source={{ uri: user.image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>
                {(user?.name?.[0] ?? "U").toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.userName}>{user?.name ?? "Usuario"}</Text>
            {!!postDate && <Text style={styles.dateText}>{formateoFecha(postDate)}</Text>}
          </View>
        </Pressable>
      </View>

      <Pressable onPress={handleRedirectToPost} style={styles.imageWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ color: "#999" }}>Sin imagen</Text>
          </View>
        )}
      </Pressable>

      <View style={{ marginTop: 8 }}>
        <Info
          post={post}
          postId={post.id}
          onUpdatePost={onUpdatePost}
          onShowComments={handleShowComments}
        />
      </View>
    </View>
  );
}

