import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#2b2b2b",
        tabBarInactiveTintColor: "#9e9e9e",
        tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0.3, borderTopColor: "#dcdcdc", height: 58 },
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
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"} 
              size={size + 4}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
