import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useFollow } from "../../hooks/followContext";
import { formateoFecha } from "../../utils/formateoFecha";
import InfoTimeline from "./InfoTimeline";
import styles from "./styles";

// 👉 IMPORTANTE
import { navigateToUser } from "../../utils/navigateToUser";

export default function TimelinePost({ post, onUpdatePost }) {
  const user = post.user;
  const imageUri = post.image;

  // likes
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(
    post.likesCount ?? post.likes?.length ?? 0
  );

  // follow info
  const { isFollowing } = useFollow();
  const alreadyFollowing = isFollowing(user.id);

  // 👉 Usamos LA FUNCIÓN GLOBAL
  const handleNavigateToUser = () => {
    navigateToUser(user.id);
  };

  const handleRedirectToPost = () => {
    router.push(`/post/${post.id}`);
  };

  const handleShowComments = () => {
    router.push({
      pathname: "/(modal)/comments/[id]",
      params: { id: post.id, post: JSON.stringify(post) },
    });
  };

  // optimistically update
  const handleLocalLike = (nextLiked) => {
    setLiked(nextLiked);
    setLikesCount((prev) => {
      const newCount = nextLiked ? prev + 1 : Math.max(prev - 1, 0);
      requestAnimationFrame(() => {
        onUpdatePost?.({ ...post, liked: nextLiked, likesCount: newCount });
      });
      return newCount;
    });
  };

  const handleLikeError = () => {
    handleLocalLike(!liked); // revert
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.userBlock} onPress={handleNavigateToUser}>
          <Image
            source={{ uri: user.image }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.dateText}>{formateoFecha(post.date)}</Text>
          </View>
        </Pressable>
      </View>

      {/* IMAGE */}
      <Pressable onPress={handleRedirectToPost} style={styles.imageWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ color: "#999" }}>Sin imagen</Text>
          </View>
        )}
      </Pressable>

      {/* INFO */}
      <View style={{ marginTop: 8 }}>
      <InfoTimeline post={post} onUpdatePost={onUpdatePost} />
      </View>
    </View>
  );
}
