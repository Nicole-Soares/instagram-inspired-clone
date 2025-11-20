import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { usePost } from "../../context/PostContext";

export default function DeletePostModal() {
  const {
    showDeleteModal,
    closeDeleteModal,
    removePost,
    isDeleting
  } = usePost();

  return (
    <Modal visible={showDeleteModal} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Eliminar Posteo</Text>
          <Text style={styles.message}>
            ¿Estás seguro que querés eliminar el post?
          </Text>

          <View style={styles.buttonsContainer}>
            <Pressable
              style={styles.cancelButton}
              onPress={closeDeleteModal}
              disabled={isDeleting}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={removePost}
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
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },
  message: {
    fontSize: 15,
    color: "#555",
    marginBottom: 22,
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
  },
  deleteButton: {
    backgroundColor: "#FF4F70",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});
