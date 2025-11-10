import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import User from "../../components/User";
import Api from "../../service/Api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await Api.getUsers();
        const list = Array.isArray(res) ? res : res?.data ?? [];
        if (!cancelled) setUsers(list);
      } catch {
        if (!cancelled) setError("Error al obtener usuarios");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <InstagramSpinner size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.title}>Users:</Text>
      <FlatList
        style={styles.list}
        contentContainerStyle={users.length ? styles.spacing : styles.empty}
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <User {...item} />}
        ListEmptyComponent={<Text>No se encontraron usuarios.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { padding: 8, flex: 1 },
  title: { fontSize: 24, fontWeight: "bold" },
  list: { padding: 8 },
  spacing: { gap: 8 },
  empty: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
