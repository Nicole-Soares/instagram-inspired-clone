import React, { useRef, useEffect } from 'react';
import Comment from './Comment'; 

const CommentList = ({ todosLosComentarios }) => {
    const comentariosRef = useRef(null);

   
    useEffect(() => {
        if (comentariosRef.current) {
            comentariosRef.current.scrollTop = comentariosRef.current.scrollHeight;
        }
    }, [todosLosComentarios]);

    return (
        <div className="comentariosScroll" ref={comentariosRef}>
            {todosLosComentarios.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export default CommentList;