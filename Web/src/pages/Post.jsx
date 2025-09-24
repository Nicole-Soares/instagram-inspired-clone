import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import "../style/Post.css";

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comentario, setComentario] = useState(null);
    const comentariosRef = useRef(null);


    useEffect(() => {
        fetch(`http://localhost:7070/posts/${id}`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJpYXQiOjE3NTg3MzcyMDQsImV4cCI6MTc1ODgyMzYwNH0.kYIvLc9j0BJb3KvZnKu78tK-ozonPn7yoKD3l2GqdIc',
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error al obtener el post");
            return res.json();
          })
          .then((data) => setPost(data)) //el post
          .catch((err) => console.error("Error:", err));
      }, []);
      

            const handleSubmit = async () => {
                try {
                const response = await fetch(`http://localhost:7070/posts/${id}/comment`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJpYXQiOjE3NTg3NDYwMDIsImV4cCI6MTc1ODgzMjQwMn0.7mgBFoyseYPXaJ-RjcPv29-C5odp063HTWm1DVxhz58',
                    },
                    body: JSON.stringify({
                        body: comentario,
                    }),
                });
            
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.error || 'No se pudo publicar el comentario.');
                    return;
                }
            
                await response.json();
                console.log("se creó");
                // Crear el nuevo comentario localmente
                const nuevoComentario = {
                    body: comentario,
                    user: {
                    name: "TuNombre", // reemplazá con el nombre real si lo tenés
                    image: "https://i.pravatar.cc/40", // o la imagen real del usuario
                    },
                };
                
                // Actualizar el estado del post
                setPost((prevPost) => ({
                    ...prevPost,
                    comments: [...prevPost.comments, nuevoComentario],
                }));
            
                setComentario('');
                comentariosRef.current?.scrollTo({
                    top: comentariosRef.current.scrollHeight,
                    behavior: "smooth",
                  });
                  
                } catch (error) {
                console.error('Error:', error);
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
                console.log(post)
            return (
            <div className="paginaPost">
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
                    <h3>{post.description}</h3>
                    <div className="comentariosScroll" ref={comentariosRef}>
                        {Array.isArray(post.comments) && post.comments.map((comment, index) => (
                            <div key={index} className="comentario">
                            <img src={comment.user?.image || "https://i.pravatar.cc/40"} alt="avatar" />
                            <h4>{comment.user?.name || "Anónimo"}</h4>
                            <p>{comment.body}</p>
                            </div>
                        ))}
                    </div>
                    <hr className="lineaDivisora" />
                    <div className="contenedorInput">
                        <div className="infoPost">
                            <p>❤️ <strong>{post.likes?.length || 0}</strong> me gusta</p>
                            <p>💬 <strong>{post.comments?.length || 0}</strong> comentarios</p>
                        </div>
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
