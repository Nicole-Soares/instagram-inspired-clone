import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderPost from "../../GeneralComponents/HeaderPost";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";
import Info from "../../GeneralComponents/Info";
import {
  getPostById,
  addCommentToPost,
  deletePost,
} from "../../service/post/postService";
import "../../style/Post/Post.css";
import Storage from "../../service/storage";
import UnauthorizedModal from "../../GeneralComponents/modals/UnauthorizedModal";
import NotFoundModal from "../../GeneralComponents/modals/NotFoundModal";
import DeleteConfirmationModal from "../../generalComponents/modals/DeleteConfirmationModal"
import SideBar from "../../generalComponents/SideBar";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comentario, setComentario] = useState("");
  const comentariosRef = useRef(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const token = Storage.getToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!token || Storage.isTokenExpired()) {
      setIsUnauthorized(true);
      setLoading(false);
      return;
    }

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
        if (status === 401) {
          setIsUnauthorized(true);
        } else if (status === 404) {
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
  }, [id, token, navigate]); 

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
    setShowDeleteModal(false); 

    try {
      await deletePost(id);
      toast.success("Post eliminado exitosamente.");
      navigate(`/home`);
    } catch (error) {
      toast.error("Error al borrar el post");
      console.error(error);
    }
  };

  if (isUnauthorized) return <UnauthorizedModal />;
  if (isNotFound) return <NotFoundModal />;
  if (loading) return <p className="loadingPost">Cargando post...</p>;

  const todosLosComentarios = [
    ...(post.description?.trim()
      ? [{ body: post.description, user: post.user }]
      : []),
    ...(post.comments || []),
  ];
  
  return (
    <div className="paginaPost">
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
        
        <Info post={post} postId = {id} onUpdatePost={handleUpdatePost}/>
        <CommentForm
          comentario={comentario}
          setComentario={setComentario}
          handleSubmit={handleSubmit}
        />
      </div>
     
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={confirmDelete} 
        />
      )}
    </div>
  );
};

export default Post;
