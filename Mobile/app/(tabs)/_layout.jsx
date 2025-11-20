import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, router } from "expo-router";
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import InstagramSpinner from '../../components/InstagramSpinner';
import ProfileTabImage from "../../components/ProfileTabImage";
import useProfileImage from "../../hooks/useProfileImage";
import { isTokenExpired } from '../../utils/isTokenExpired';

export default function TabsLayout() {
  const userImage = useProfileImage();
  const insets = useSafeAreaInsets();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      
      if (!token || isTokenExpired(token)) {
        await AsyncStorage.removeItem('token');
        router.replace('/login');
        return;
      }
      
      setChecking(false);
    })();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <InstagramSpinner />
      </View>
    );
  }

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
          height: 58 + insets.bottom,
          paddingBottom: insets.bottom,
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