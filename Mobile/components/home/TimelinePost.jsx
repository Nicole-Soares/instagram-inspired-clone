import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { useFollow } from "../../hooks/followContext";
import { formateoFecha } from "../../utils/formateoFecha";
import { navigateToUser } from "../../utils/navigateToUser";
import InfoTimeline from "./InfoTimeline";
import styles from "./styles";

export default function TimelinePost({ post, onUpdatePost }) {
  const user = post.user;
  const imageUri = post.image;

  const { isFollowing } = useFollow();
  const alreadyFollowing = isFollowing(user.id);

  const handleNavigateToUser = () => navigateToUser(user.id);

  const handleRedirectToPost = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.userBlock} onPress={handleNavigateToUser}>
          <Image source={{ uri: user.image }} style={styles.avatar} />
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
