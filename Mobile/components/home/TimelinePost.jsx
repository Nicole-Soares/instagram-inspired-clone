import { useMemo, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import Info from "../Info";
import { formateoFecha } from "../../utils/formateoFecha";
import styles from "./styles";

export default function TimelinePost({ post, onUpdatePost, following=false, pending=false, onToggleFollow, }) {
  const user      = post?.user ?? {};
  const postDate  = post?.date || post?.createdAt || "";
  const imageUri  = post?.image;

  const [liked, setLiked] = useState(!!(post?.liked ?? post?.isLiked));
  const [likesCount, setLikesCount] = useState(
    Number(post?.likesCount ?? post?.likes ?? 0)
  );

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
        {isOwner && (
          <TouchableOpacity
            onPress={onToggleFollow}
            disabled={pending}
            style={[
              styles.followBtn,
              following ? styles.followBtnOutline : styles.followBtnPrimary,
              pending && styles.followBtnDisabled,
            ]}
          >
            <Text
              style={[
                styles.followBtnText,
                following && styles.followBtnTextOutline,
              ]}
            >
              {pending ? "..." : following ? "Dejar de seguir" : "Seguir"}
            </Text>
          </TouchableOpacity>
        )}
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

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  userBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eaeaea",
  },
  avatarFallback: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontWeight: "700",
    color: "#555",
  },
  userName: {
    fontWeight: "700",
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: "#777",
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  followBtnPrimary: {
    backgroundColor: "#1a57ff",
    borderColor: "#1a57ff",
  },
  followBtnOutline: {
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
  },
  followBtnDisabled: {
    opacity: 0.6,
  },
  followBtnText: {
    fontWeight: "600",
    color: "#fff",
  },
  followBtnTextOutline: {
    color: "#111827",
  },
  imageWrap: {
    marginTop: 6,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 4,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
  },
  liked: {
    color: "#FE2C55",
    fontWeight: "700",
  },
  description: {
    marginTop: 4,
  },
});
