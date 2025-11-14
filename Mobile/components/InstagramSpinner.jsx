import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export default function InstagramSpinner({ size = 80, strokeWidth = 8 }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const radius = size / 2;
  const innerSize = size - strokeWidth * 2;

  return (
    <View style={styles.center}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: radius,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <LinearGradient
          colors={["#feda75", "#fa7e1e", "#d62976", "#962fbf", "#4f5bd5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        />
        {/* Centro hueco */}
        <View
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: "white",
            position: "absolute",
            top: strokeWidth,
            left: strokeWidth,
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    overflow: "hidden",
  },
});
