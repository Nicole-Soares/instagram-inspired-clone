import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { formateoFecha } from "../../utils/formateoFecha";

export default function HeaderPost({
  user,
  date,
  isOwner,
  onEditClick,
  onDeleteClick,
  handleNavigateToUser,
}) {
  const handleUserClick = () => {
    if (user?.id) handleNavigateToUser(user.id);
  };

  return (
    <View style={styles.headerContainer}>
      {/* 🧑 Info del usuario */}
      <TouchableOpacity
        onPress={handleUserClick}
        style={styles.infoPrincipal}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: user?.image }}
          style={styles.imagenUsuario}
          resizeMode="cover"
        />

        <View style={styles.datosUsuarioPost}>
          <Text style={styles.nombreUsuario}>
            {user?.name || "Usuario desconocido"}
          </Text>
          <Text style={styles.fechaPost}>
            {formateoFecha ? formateoFecha(date) : date}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 🗑️✏️ Acciones si es dueño */}
      {isOwner && (
        <View style={styles.postActions}>
          <TouchableOpacity onPress={onDeleteClick} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={22} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onEditClick} style={styles.actionBtn}>
            <Ionicons name="pencil-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoPrincipal: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imagenUsuario: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  datosUsuarioPost: {
    flexDirection: "column",
  },
  nombreUsuario: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  fechaPost: {
    fontSize: 12,
    color: "#888",
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    marginLeft: 10,
    padding: 4,
  },
});
