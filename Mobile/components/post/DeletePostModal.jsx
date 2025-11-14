import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { deletePost } from "../../service/Api";

export default function DeletePostModal({ visible, onClose, postId }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await deletePost(postId);
      onClose();
      router.replace("/home");
    } catch (e) {
      console.error("Error al eliminar el post:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Eliminar Posteo</Text>
          <Text style={styles.message}>
            ¿Estás seguro que querés eliminar el post?
          </Text>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && { opacity: 0.5 },
              ]}
              onPress={onClose}
              disabled={isDeleting}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.deleteText}>Borrar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  cancelText: {
    color: "#555",
    fontSize: 15,
  },
  deleteButton: {
    backgroundColor: "#7F8CFF",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
