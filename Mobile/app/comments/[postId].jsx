import { router, useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CommentsModal() {
  const { postId } = useLocalSearchParams();

  return (
    <Pressable style={styles.overlay} onPress={() => router.back()}>
      <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
        <View style={styles.handle} />
        <Text style={styles.header}>Comentarios del post #{postId}</Text>

        <ScrollView contentContainerStyle={styles.scroll}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Text key={i} style={styles.comment}>
              <Text style={styles.commentUser}>Usuario </Text>
              Comentario de ejemplo
            </Text>
          ))}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          keyboardVerticalOffset={12}
        >
          <View style={styles.containerInputButton}>
            <TextInput
              placeholderTextColor="#8A8FA3" 
              placeholder="Agrega un comentario"
              style={styles.input}
            />
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Publicar</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", 
    justifyContent: "flex-end",
  },
  sheet: {
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ddd",
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    fontWeight: "700",
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
  },
  scroll: {
    padding: 16,
    flexGrow: 1,
  },
  comment: {
    marginBottom: 12,
  },
  commentUser: {
    fontWeight: "700",
  },
  containerInputButton: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingTop: 10,       
    paddingBottom: 14,    
    height: 90,           
    backgroundColor: "#fafafa",
    fontSize: 14,
    textAlignVertical: "top", 
    color: "#222",
  },  
  button: {
    alignSelf: "center", 
    width: "100%",        
    backgroundColor: "#7F8CFF",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    alignItems:"center"
  },
});
