import { useMemo, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import Info from "../Info";
import { formateoFecha } from "../../utils/formateoFecha";
import styles from "./styles";
import { useFollow } from "../../hooks/followContext";

const cleanId = (v) => String(v ?? "").replace(/^user_/, "");

export default function TimelinePost({ post, onUpdatePost }) {
  const user      = post?.user ?? {};
  const postDate  = post?.date || post?.createdAt || "";
  const imageUri  = post?.image;

  const [liked, setLiked] = useState(!!(post?.liked ?? post?.isLiked));

  const initialLikes = (() => {
    const n = Number(post?.likesCount);
    if (Number.isFinite(n)) return n;
    if (Array.isArray(post?.likes)) return post.likes.length;
    return Number(post?.likes ?? 0) || 0;
  })();
  const [likesCount, setLikesCount] = useState(initialLikes);

  const commentsCount = useMemo(
    () =>
      Number(post?.commentsCount ?? post?.comments?.length ?? 0) +
      (post?.description?.trim() ? 1 : 0),
    [post]
  );

  const { isFollowing } = useFollow();
  const authorId = cleanId(user?.id ?? post?.userId);
  const alreadyFollowing = isFollowing ? isFollowing(authorId) : false;

  const handleNavigateToUser = () => {
    if (!user?.id) return;
    router.push({
      pathname: `/users/${user.id}`,
      params: { followed: alreadyFollowing ? "1" : "0" },
    });
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

  const handleLocalLike = (nextLiked) => {
    setLiked(nextLiked);
    setLikesCount((prev) => {
      const nextCount = nextLiked ? prev + 1 : Math.max(0, prev - 1);
      if (onUpdatePost) {
        requestAnimationFrame(() => {
          onUpdatePost({ ...post, liked: nextLiked, likesCount: nextCount });
        });
      }
      return nextCount;
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
          liked={liked}
          likesCount={likesCount}
          commentsCount={commentsCount}
          onToggleLike={handleLocalLike}
          onShowComments={handleShowComments}
        />
      </View>
    </View>
  );
}