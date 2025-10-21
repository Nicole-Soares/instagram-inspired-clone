import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "../../style/post/PostEdit.css";
import Storage from "../../service/storage";
import UnauthorizedModal from "../../GeneralComponents/modals/UnauthorizedModal";
import ForbiddenModal from "../../GeneralComponents/modals/ForbiddenModal";
import NotFoundModal from "../../GeneralComponents/modals/NotFoundModal";
import apiFetch from "../../service/apiFetch";
import SideBar from "../../generalComponents/SideBar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    if (!token || Storage.isTokenExpired()) {
      setIsUnauthorized(true);
      setLoading(false); 
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(
          `${API_BASE_URL}/posts/${id}`,
          {
            method: "GET",
          },
          "No se pudo obtener el post"
        ); 
        
        const currentUserId = Storage.getUserId();
        const postAuthorId = data.user.id;

        if (postAuthorId !== currentUserId) {
          setIsForbidden(true);
          throw new Error("El post no pertenece a este usuario");
        }

        setImageUrl(data.image || "");
        setCaption(data.description || "");
        setIsUnauthorized(false); 

      } catch (error) {
        const status = error.response?.status || error.status;
        if (status === 401) {
          setIsUnauthorized(true);
        } else if (status === 403) {
          setIsForbidden(true);
        } else if (status === 404) {
          setIsNotFound(true);
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
    
      await apiFetch(
        `${API_BASE_URL}/posts/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ image: imageUrl, description: caption }),
        },
        "No se pudo editar el post"
      ); 
      navigate(`/post/${id}`);
    } catch (error) {
      setErrorMessage(error.message || "Ocurrió un error al guardar.");
    }
  };

  if (isUnauthorized) return <UnauthorizedModal />; 
  if (isForbidden) return <ForbiddenModal />; 
  if (isNotFound) return <NotFoundModal />; 
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <SideBar/>
      <div className="post-edit-header">
        <h2 className="preview-title">Preview</h2>
      </div>
      <div className="post-edit-content">
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
        />
        <textarea
          placeholder="Escribe algo..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button onClick={handleSubmit}>Guardar Cambios</button>
      </div>
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
