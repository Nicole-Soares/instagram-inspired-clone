import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home"); 
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splashLogo_200.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
