import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ViewProfile = ({ user, setToken }) => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Querés salir de tu cuenta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          setToken("");
          router.replace("/login");
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.leftBlock}>
          <Image source={{ uri: user.image }} style={styles.avatar} />

          <View style={styles.infoColumn}>
            <Text style={styles.name} numberOfLines={1}>{user.name}</Text>

            <View style={styles.statsColumn}>
              <Text style={styles.statLine}>
                <Text style={styles.statNumber}>{user.posts?.length || 0}</Text> Publicaciones
              </Text>
              <Text style={styles.statLine}>
                <Text style={styles.statNumber}>{user.followers?.length || 0}</Text> Seguidos
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.logoutButton]} onPress={handleLogout} >
            <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        numColumns={3}
        data={user.posts || []}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={styles.postImage}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.noPosts}>Aún no hay publicaciones</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 12,
  paddingTop: 12,
  paddingBottom: 40,
  },

  leftBlock: {
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 1,            
  },

  avatar: { 
    width: 84, 
    height: 84,
    borderRadius: 64,
    marginRight: 20 
  },

  infoColumn: {
    flexShrink: 1 
  },

  name: { 
    fontSize: 24, 
    fontWeight: '700'
  },

  statsColumn: {
    marginTop: 10
  },

  statLine: {
    color: '#6b7280',
    marginTop: 8
  },

  statNumber: {
    fontWeight: '700',
    color: '#111827'
  },

  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1a57ffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  logoutButtonText: {
    color: "#fff", 
    fontWeight: "500",
    fontSize: 14
  },
  
  postImage: { 
    width: "33.33%",
    height: 120, 
    aspectRatio: 0.6, 
    borderWidth: 1, 
    borderColor: '#fff' 
  },

  noPosts: { 
    textAlign: "center", 
    color: "#888", 
    marginTop: 40 
  }

});

export default ViewProfile;
