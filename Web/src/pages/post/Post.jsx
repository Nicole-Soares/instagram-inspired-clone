import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderPost from "./components/HeaderPost";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";
import Info from "./components/Info";
import { getPostById, addCommentToPost, likePost } from "../../service/post/postService";
import "../../style/Post.css";

const Post= () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comentario, setComentario] = useState("");
    const comentariosRef = useRef(null);
    //const token = localStorage.getItem('token');

    useEffect(() => {
        (async () => {
            try {
                const data = await getPostById(id);
                setPost(data);
            } catch (err) {
                toast.error(err.message);
            }
        })();
    }, [id]);

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
            toast.error(error.message);
        }
    };

    const handleClickLike = async () => {
        try {
            const updatedPost = await likePost(id);
            setPost(updatedPost);
            toast.success("¡Me gusta registrado! ❤️");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const todosLosComentarios = [
        {
            body: post.description,
            user: post.user,
        },
        ...(post.comments || []),
    ];

    //if (!token) return <ModalBloqueo />;
    if (!post) return <p>Cargando post...</p>;

    return (
        <div className="paginaPost">
            <ToastContainer />
            <div className="contenedorImagen">
                {post.image && <img src={post.image} alt="Imagen del post" />}
            </div>
            <div className="contenedorUsuarioInput">
                <HeaderPost user={post.user} date={post.date} />
                <hr className="lineaDivisora" />
                <CommentList
                    todosLosComentarios={todosLosComentarios}
                    comentariosRef={comentariosRef} 
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
