import React from 'react';

const CommentForm = ({ comentario, setComentario, handleSubmit }) => {
    return (
        <div className="contenedorInput">
            <textarea
                placeholder="Agregar un comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
            />
            <button onClick={handleSubmit} className="botonAgregarPost">
                Publicar
            </button>
        </div>
    );
};

export default CommentForm;