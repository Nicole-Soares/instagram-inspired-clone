import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Platform, Pressable, Text, View } from "react-native";

export default function useUserHeader(name) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",                
      headerShadowVisible: false,
      headerStyle: { backgroundColor: "#fff" },
      headerTintColor: "#111827",
      headerBackTitleVisible: false,

      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => (navigation.canGoBack() ? navigation.goBack() : router.back())}
            hitSlop={12}
            style={{ paddingHorizontal: 4, paddingVertical: Platform.OS === "ios" ? 2 : 0 }}
          >
            <Text style={{ fontSize: 34, lineHeight: 32, color: "#111827" }}>‹</Text>
          </Pressable>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ marginLeft: 4, fontSize: 20, fontWeight: "600", color: "#111827", maxWidth: 260 }}
          >
            {name ? `@${name}` : ""}
          </Text>
        </View>
      ),
      headerLeftContainerStyle: { marginLeft: -4 },
    });
  }, [navigation, name]);
}