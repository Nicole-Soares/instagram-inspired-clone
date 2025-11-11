import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CommentForm({ comentario, setComentario, handleSubmit }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Agrega un comentario"
          placeholderTextColor="#999"
          value={comentario}
          onChangeText={setComentario}
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#222",
    backgroundColor: "#FAFAFA",
    marginRight: 8,
    maxHeight: 100,
  },
  button: {
    backgroundColor: "#5B5BFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});


/*<TouchableOpacity
  style={[
    styles.button,
    { opacity: comentario.trim() ? 1 : 0.5 },
  ]}
  onPress={handleSubmit}
  disabled={!comentario.trim()}
>
  <Text style={styles.buttonText}>Publicar</Text>
</TouchableOpacity>
*/