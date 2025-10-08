import React from "react";
import { formateoFecha } from "../../../utils/formateoFecha";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";

const HeaderPost = ({
  user,
  date,
  isOwner,
  onEditClick,
  onDeleteClick,
  handleNavigateToUser,
}) => {
  const handleUserClick = () => {
    if (user.id !== null) {
      handleNavigateToUser(user.id);
    }
  };
  return (
    <div className="contenedorImagenUsuario">
      <div className="infoPrincipal">
        <img
          src={user.image}
          alt="Imagen del usuario"
          onClick={handleUserClick}
          className="imagenUsuario"
        />
        <div className="datosUsuarioPost">
          <p className="nombreUsuario" onClick={handleUserClick}>
            {user.name || "Usuario desconocido"}
          </p>
          <p className="fechaPost">{formateoFecha(date)}</p>
        </div>
      </div>
      {isOwner && (
        <div className="postActions">
          <DeleteOutlineIcon onClick={onDeleteClick} className="deleteIcon" />

          <EditIcon onClick={onEditClick} className="editIcon" />
        </div>
      )}
    </div>
  );
};

export default HeaderPost;
