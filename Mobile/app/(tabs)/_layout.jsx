import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileTabImage from "../../components/ProfileTabImage";
import useProfileImage from "../../hooks/useProfileImage";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const userImage = useProfileImage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2b2b2b",
        tabBarInactiveTintColor: "#9e9e9e",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.3,
          borderTopColor: "#dcdcdc",
          height: 58,
          // ✅ Solo aplicamos padding extra si es iPhone (Android ya lo maneja)
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={size + 4}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size + 3} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addPost"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-box-outline"
              size={size + 4}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => ( 
            <ProfileTabImage 
              focused={focused} 
              userImage={userImage} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
