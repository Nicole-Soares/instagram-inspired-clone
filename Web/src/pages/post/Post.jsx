import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderPost from "./components/HeaderPost";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";
import Info from "./components/Info";
import { getPostById, addCommentToPost, likePost } from "../../service/post/postService";
import "../../style/Post.css";
import Storage from "../../service/storage";
import UnauthorizedModal from "../../generalComponents/UnauthorizedModal";
import { getUserId } from "../../service/getId";

const Post= () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comentario, setComentario] = useState("");
    const comentariosRef = useRef(null);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const token = Storage.getToken();
    const navigate = useNavigate()

    useEffect(() => {
       

        if (!token) {
            setIsUnauthorized(true);
            return;
        }

        const fetchPost = async () => {
            try {
                const data = await getPostById(id, navigate);
                const loggedUserId = Storage.getUserId();
                const postId = data.user.id;
                setPost(data);
                setIsOwner(String(loggedUserId) === String(postId));
                console.log(isOwner)
            } catch (error) {
                toast.error("Error al cargar el post.");
                //tendria que volver al home ??
                console.error(error);
            }
        };

        fetchPost();
    }, [id, token]); // si pasa algun cambio vuelve a ejecutar el useEffect


    const handleSubmit = async () => {
        if (!comentario.trim()) {
            toast.warn("El comentario no puede estar vacío.");
            return;
        }
        try {
            const updatedPost = await addCommentToPost(id, comentario);
            setPost(updatedPost);
            toast.success("Comentario publicado. 🎉");
            setComentario('');
        } catch (error) {
            toast.error("Error al cargar el comentario.");
            console.error(error);
        }
    };

   


    const handleClickLike = async () => {
        try {
            const currentUserId = getUserId();
            if (!currentUserId) {
                toast.error("Debes iniciar sesión para dar 'Me gusta'.");
                return;
            }
         
            const updatedPost = await likePost(id); 
    
            const userHasLiked =  updatedPost.likes.some(like => like.id === currentUserId);
            //si aparece el like despues de haber hecho el fetch entonces es porque es nuevo
            if (userHasLiked) {
                toast.success("¡Me gusta registrado! ❤️");
                

            } else {
               
                toast.success("¡Me gusta eliminado! 💔");
            }

            //actualizo mi estado porque ahora el post que tengo esta desactualziado
            setPost(updatedPost);

        } catch (error) {
            toast.error("Error al procesar el 'Me gusta'.");
            console.error(error);
        }
    };

    const handleNavigateToUser = (userId) => {
        navigate(`/usuario/${userId}`);
    };

    const handleEdit = () => {
       navigate(`/post/editPost/${id}`);

    };

    const handleDelete = () => {
        // Implementa aquí la lógica para pedir confirmación y eliminar el post
        console.log("Eliminando post:", id);
    };


    if (isUnauthorized) return <UnauthorizedModal />;
    if (!post) return <p className="loadingPost">Cargando post...</p>;
    
    const todosLosComentarios = [
        //para poner la descripcion primero
        {
            body: post.description,
            user: post.user,
        },
        ...(post.comments || []),
    ];

    return (
        <div className="paginaPost">
            <ToastContainer />
            <div className="contenedorImagen">
                {post.image && <img src={post.image} alt="Imagen del post" className="imagenPost"/>}
            </div>
            <div className="contenedorUsuarioInput">
                <HeaderPost user={post.user} date={post.date} isOwner={isOwner} onEditClick={handleEdit} onDeleteClick={handleDelete}/>
                <hr className="lineaDivisora" />
                <CommentList
                    todosLosComentarios={todosLosComentarios}
                    comentariosRef={comentariosRef} 
                    handleNavigateToUser={handleNavigateToUser} 
                />
                <hr className="lineaDivisora" />
                <Info post={post} onLikeClick={handleClickLike} />
                <CommentForm
                    comentario={comentario}
                    setComentario={setComentario}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default Post;