import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Info from "./components/Info";
import Comment from "./components/Comment";
import { getPostById, addCommentToPost, likePost } from "../../service/post/postService";

import "../../style/Post.css";

const Post= () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comentario, setComentario] = useState("");
    const comentariosRef = useRef(null);

    //se ejecuta esto apenas se navega a esta pantalla
    useEffect(() => {
        (async () => {
            try {
                const data = await getPostById(id); // constante que hace el fetch del post_id
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
            const nuevoComentario = {
                body: comentario,
                user: {
                    name: "TuNombre",
                    image: "https://i.pravatar.cc/40",
                },
            };
            await addCommentToPost(id, comentario);
            setPost((prevPost) => ({
                ...prevPost,
                comments: [...prevPost.comments, nuevoComentario],
            }));
            setComentario('');
            comentariosRef.current?.scrollTo({
                top: comentariosRef.current.scrollHeight,
                behavior: "smooth",
            });
            toast.success("Comentario publicado. 🎉");
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

    const formatearFecha = (isoString) => {
        const fecha = new Date(isoString);
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const día = String(fecha.getDate()).padStart(2, '0');
        const hora = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        return `${año}/${mes}/${día} - ${hora}:${minutos}`;
    };

    if (!post) return <p>Cargando post...</p>;

    const todosLosComentarios = [
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
                {post.image && <img src={post.image} alt="Imagen del post" />}
            </div>
            <div className="contenedorUsuarioInput">
                <div className="contenedorImagenUsuario">
                    <img src={post.user.image} alt="Imagen del usuario" />
                    <div className="datosUsuarioPost">
                        <p className="nombreUsuario">{post.user.name || "Usuario desconocido"}</p>
                        <p className="fechaPost">{formatearFecha(post.date)}</p>
                    </div>
                </div>
                <hr className="lineaDivisora" />
                <div className="comentariosScroll" ref={comentariosRef}>
                    {todosLosComentarios.map((comment) => (
                       <Comment comment={comment}/>
                    ))}
                </div>
                <hr className="lineaDivisora" />
                <div className="contenedorInput">
                    <Info post={post} onLikeClick={handleClickLike} />
                    <textarea
                        placeholder="Agregar un comentario"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />
                    <button onClick={handleSubmit} className="botonAgregarPost">
                        Publicar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Post;
