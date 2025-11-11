import { View, TextInput, Button, StyleSheet } from "react-native";

export default function FormularioPost({
  url,
  descripcion,
  onUrlChange,
  onDescripcionChange,
  onSubmit,
}) {
  return (
    <View style={styles.form}>
      <TextInput
        placeholder="URL de la imagen"
        value={url}
        onChangeText={onUrlChange}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Agrega descripción"
        value={descripcion}
        onChangeText={onDescripcionChange}
        style={[styles.input, styles.textarea]}
        multiline
      />
      <Button title="Publicar" onPress={onSubmit} color="#0095F6" />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
});
