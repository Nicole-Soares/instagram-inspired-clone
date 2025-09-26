// src/pages/PostPage/components/Comment.jsx
import React from 'react';

const Comment = ({ comment }) => {
    return (
        <div className="comentario">
        <img src={comment.user?.image} alt="imagen Usuario" />
        <h4>{comment.user?.name}</h4>
        <p>{comment.body}</p>
    </div>
    );
};

export default Comment;