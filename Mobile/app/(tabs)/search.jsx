import { useState } from 'react';
import { View, TextInput, Pressable, FlatList, StyleSheet, Image, Text} from 'react-native';
import { search } from '../../service/Api'; 
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import InstagramSpinner from '../../components/InstagramSpinner';

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults({ users: [], posts: [] });
      setHasSearched(false); 
      return;
    }

    setLoading(true);

    try {
      const { data } = await search(query);
      setResults(data);
      setHasSearched(true);
    } catch (error) {
      console.log("Error searching:", error);
    }
      finally {
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      
      {/* INPUT */}
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Buscar..."
        value={query}
        onChangeText={setQuery}
      />

      <Pressable style={styles.iconButton} onPress={handleSearch}>
        <MaterialCommunityIcons name="magnify" size={22} color="#666" />
      </Pressable>
    </View>

      {/* LOADING */}
      {loading && (
        <View  style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <InstagramSpinner />
            <Text style={{ marginTop: 8, color: "#666" }}>Cargando...</Text>
          </View >
      )}

    {/* NO RESULTS */}
    {hasSearched && !loading && results.users.length === 0 && results.posts.length === 0 && (
      <View style={{  height: '86%', justifyContent: 'center' }}>
        <Text style={styles.noResults}>No se encontraron resultados!</Text>
      </View>
    )}

      {/* USERS */}
      {!loading && results.users.length > 0 && (
      <FlatList
        data={results.users}
        style={styles.userList}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.userListContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/users/${item.id}`)}
            style={({ pressed }) => [
              pressed && { opacity: 0.6 } 
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.user} />
          </Pressable>
        )}
      />
      )}

      {/* POSTS */}
      {!loading && results.posts.length > 0 && (
        <FlatList
          data={results.posts}
          numColumns={3}
          contentContainerStyle={styles.postsList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/post/${item.id}`)}
              style={({ pressed }) => [
                pressed && { opacity: 0.6 }
              ]}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.postImage}
              />
            </Pressable>
          )}
        />
      )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     gap: 10,
     backgroundColor: '#fff',
    },

  inputContainer: {
    position: "relative",
    width: "100%",
    justifyContent: "center",
    padding: 16,
  },

  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    height: 42,
    padding: 8,
  },

  iconButton: {
    position: "absolute",
    right: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  userList: {
    height: 75,
    minHeight: 75, 
  },

  userListContent: {
    gap: 10,
    paddingHorizontal: 6,
  },

  user: {
    width: 75,
    height: 75,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },

  postsList: {
    paddingTop: 16,
    alignSelf: 'center',
  },

  postImage: {
    width: 124,
    height: 170,
    margin: 2,
  },

  noResults: {
    color: '#666',
    fontSize: 20,
    textAlign: 'center',
  }
});