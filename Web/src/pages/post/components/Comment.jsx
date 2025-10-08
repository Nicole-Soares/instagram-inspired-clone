import React from 'react';

const Comment = ({ comment, handleNavigateToUser}) => {

    const handleUserClick = () =>{
        if(comment.user.id !== null){
            handleNavigateToUser(comment.user.id );
        }
    }
    return (
        <div className="comentario">
        <img src={comment.user?.image} alt="imagen Usuario" onClick={handleUserClick} className="imagenUsuarioComentario"/>
        <h4 onClick={handleUserClick} className="nombreUsuarioComentario">{comment.user?.name}</h4>
        <p>{comment.body}</p>
    </div>
    );
};

export default Comment;