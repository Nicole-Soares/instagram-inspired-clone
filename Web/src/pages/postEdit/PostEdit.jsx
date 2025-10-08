import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "../../style/PostEdit.css";
import Storage from "../../service/storage";
import UnauthorizedModal from "../../generalComponents/UnauthorizedModal";
import ForbiddenModal from "../../generalComponents/ForbiddenModal";
import NotFoundModal from "../../generalComponents/NotFoundModal";
import apiFetch from '../../service/apiFetch';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const token = Storage.getToken();

  useEffect(() => {
   
    if (!token) {
      setIsUnauthorized(true);
      setLoading(false); // Detenemos la carga para mostrar el modal
      return;
    }

    //me traigo los datos del post actual, relleno los valores de los inputs (si se puede) y ejecuto.
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`${API_BASE_URL}/posts/${id}`, {
          method: "GET",
        }, "No se pudo obtener el post"); // Mensaje para error no 401

        //Me guardo el id del usuario logueado y el id del autor del post para comparar
        const currentUserId = Storage.getUserId();
        const postAuthorId = data.user.id;

        //Vefifico si el post pertenece al usuario logueado
        if (postAuthorId !== currentUserId) {
          setIsForbidden(true);
          throw new Error("El post no pertenece a este usuario");
        }

        //Si la verificación pasa, relleno los inputs
        setImageUrl(data.image || "");
        setCaption(data.description || "");
        setIsUnauthorized(false); // Confirmo que el token es válido

        //Si la verificación no pasa, manejo el error con catch
      } catch (error) {
        // Error 401: Token inválido
        if (error.message === "Unauthorized") {
          setIsUnauthorized(true);
          // Si no, si es 403:
        } else if (error.message.includes("Forbidden")) {
          setIsForbidden(true);
          // Si es 404:
        } else if (error.message.includes("Not Found")) {
          setIsNotFound(true)
          // Si no es 401, 403 ni 404, asume un error de datos o conexión y muestra un modal genérico
        } else {
          setErrorMessage(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, token]);


  const handleSubmit = async () => {
    try {
      // solicitud PUT usando apiFetch
      await apiFetch(`${API_BASE_URL}/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ image: imageUrl, description: caption }),
      }, "No se pudo editar el post"); // Mensaje para error no 401
      // Si todo sale bien, navego al post actualizado
      navigate(`/post/${id}`);
    } catch (error) {
      setErrorMessage(error.message || "Ocurrió un error al guardar.");
    }
  };

  // 3. Renderizado Condicional de Seguridad y Carga
  if (isUnauthorized) return <UnauthorizedModal />; // Muestra el modal si no hay token o es inválido (401)

  if (isForbidden) return <ForbiddenModal />; // Muestra el modal si no tiene permiso (403)

  if (isNotFound) return <NotFoundModal />; // Muestra el modal si el post no existe (404)

  if (loading) {
    return <div>Cargando...</div>;
  }


  return (
    <div className="container">
      <h2 className="preview-title">Preview</h2>
      <div className="preview-section">
        <div className="preview">
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" />
          ) : (
            <div className="placeholder">Preview</div>
          )}
        </div>
      </div>

      <div className="inputs">
        <input
          type="text"
          placeholder="URL de la imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <textarea
          placeholder="Escribe algo..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button onClick={handleSubmit}>Guardar Cambios</button>
      </div>

      {errorMessage && (
        <div className="modalOverlay">
          <div className="modalContent">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage("")}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostEdit;