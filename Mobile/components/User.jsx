import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const User = ({ id, name, email, image }) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/users/${id}`)} style={styles.mainContainer}>
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.image} />
        <View>
          <Text>Name: {name}</Text>
          <Text>Email: {email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  }
});

export default User;