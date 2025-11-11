import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../../utils/theme";

export default function CommentForm({ comentario, setComentario, handleSubmit }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Agrega un comentario"
        value={comentario}
        onChangeText={setComentario}
        style={styles.input}
        placeholderTextColor={colors.placeholder}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: spacing.s,
    marginTop: spacing.s,
  },
  input: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    fontSize: 14,
    marginRight: spacing.s,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.m,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
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