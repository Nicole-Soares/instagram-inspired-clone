import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderPost from "../../generalComponents/HeaderPost";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";
import Info from "../../generalComponents/Info";
import {
  getPostById,
  addCommentToPost,
  deletePost,
} from "../../service/post/postService";
import "../../style/post/Post.css";
import Storage from "../../service/storage";
import UnauthorizedModal from "../../generalComponents/modals/UnauthorizedModal";
import NotFoundModal from "../../generalComponents/modals/NotFoundModal";
import DeleteConfirmationModal from "../../generalComponents/modals/DeleteConfirmationModal"
import SideBar from "../../generalComponents/SideBar";
import RenderValidation from "../../generalComponents/RenderValidation";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comentario, setComentario] = useState("");
  const comentariosRef = useRef(null);
  //const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const token = Storage.getToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  //const [error, setError] = useState(null);

  useEffect(() => {
   /* if (!token || Storage.isTokenExpired()) {
      setIsUnauthorized(true);
      setLoading(false);
      return;
    }
*/
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id, navigate);
        const loggedUserId = Storage.getUserId();
        const postId = data.user.id;
        setPost(data);
        setIsOwner(String(loggedUserId) === String(postId));
      } catch (error) {
        const status = error.response?.status || error.status;
         if (status === 404) {
          setIsNotFound(true);
        } else {
          toast.error("Error al cargar el post.");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token, navigate]); // si pasa algun cambio vuelve a ejecutar el useEffect

  //Se encarga de actualizar el estado del post
    const handleUpdatePost = (updatedPost) => {
        setPost(updatedPost);
    };

  const handleSubmit = async () => {
    if (!comentario.trim()) {
      toast.warn("El comentario no puede estar vacío.");
      return;
    }
    try {
      const updatedPost = await addCommentToPost(id, comentario);
      setPost(updatedPost);
      toast.success("Comentario publicado. 🎉");
      setComentario("");
    } catch (error) {
      toast.error("Error al cargar el comentario.");
      console.error(error);
    }
  };

  const handleNavigateToUser = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleEdit = () => {
    navigate(`/post/editPost/${id}`);
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false); // Cierra el modal primero

    try {
      await deletePost(id);
      toast.success("Post eliminado exitosamente.");
      setTimeout(() => {
        navigate(`/home`);
      }, 1000);
    } catch (error) {
      toast.error("Error al borrar el post");
      console.error(error);
    }
  };

  
  //if (isUnauthorized) return <UnauthorizedModal />;
  if (isNotFound) return <NotFoundModal />;
  if (loading) return <p className="loadingPost">Cargando post...</p>;

//if(error) return <RenderValidation error ={error}/>

  const todosLosComentarios = [
    ...(post.description?.trim()
      ? [{ body: post.description, user: post.user }]
      : []),
    ...(post.comments || []),
  ];
  
   
  

  return (
    <div className="paginaPost">
      <ToastContainer />
      <SideBar/>
     
      <div className="contenedorImagenPost">
        {post.image && (
          <img src={post.image} alt="Imagen del post" className="imagenPost" />
        )}
      </div>
      <div className="contenedorUsuarioInput">
        <HeaderPost
          user={post.user}
          date={post.date}
          isOwner={isOwner}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
          handleNavigateToUser={handleNavigateToUser}
        />
        <hr className="lineaDivisora" />
        <CommentList
          todosLosComentarios={todosLosComentarios}
          comentariosRef={comentariosRef}
          handleNavigateToUser={handleNavigateToUser}
        />
        <hr className="lineaDivisora" />
        {/*Ahora se le pasa el 'post' al componente info*/}
        <Info post={post} postId = {id} onUpdatePost={handleUpdatePost}/>
        <CommentForm
          comentario={comentario}
          setComentario={setComentario}
          handleSubmit={handleSubmit}
        />
      </div>
     
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)} // Función para cancelar
          onConfirm={confirmDelete} // Función para eliminar
        />
      )}
    </div>
  );
};

export default Post;
