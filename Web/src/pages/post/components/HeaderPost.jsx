import React from 'react';
import { formateoFecha } from '../../../utils/formateoFecha';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

const HeaderPost = ({ user, date, isOwner, onEditClick, onDeleteClick }) => {

     // Imprime la prop recibida. Esto se ejecuta en el renderizado actualizado.
     console.log("HeaderPost recibió isOwner:", isOwner); 
    //si el post actual es del que lo esta viendo ahora tendria que aparecerle dos iconos, uno de editar otro de eliminar
    return (
        <div className="contenedorImagenUsuario">
            <div className="infoPrincipal">
                <img src={user.image} alt="Imagen del usuario" />
                <div className="datosUsuarioPost">
                    <p className="nombreUsuario">{user.name || "Usuario desconocido"}</p>
                    <p className="fechaPost">{formateoFecha(date)}</p>
                </div>
            </div>
            {isOwner && (
                <div className="postActions">

                    <DeleteOutlineIcon 
                        onClick={onDeleteClick} // Agregar manejador de evento
                        style={{ cursor: 'pointer', color: '#d32f2f' }} // Estilos inline para prueba
                    />

                    <EditIcon 
                        onClick={onEditClick} // Agregar manejador de evento
                        style={{ cursor: 'pointer', color: '#1976d2', marginRight: '8px' }} // Estilos inline para prueba
                    />
                </div>
                
            )}
        </div>
    );
};

export default HeaderPost;