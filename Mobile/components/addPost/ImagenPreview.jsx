import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ImagenPreview({ imagen }) {
  return (
    <View style={styles.preview}>
      {imagen ? (
        <Image
          source={{ uri: imagen }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <MaterialIcons name="add-a-photo" size={60} color="#aaa" />
          <Text style={styles.text}>Agregar imagen</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: "100%",
    height: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    color: "#777",
  },
});
