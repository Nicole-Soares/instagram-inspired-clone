import React from 'react';

const Info = ({ post, onLikeClick }) => {
    return (
        <div className="infoPost">
            <p onClick={onLikeClick}>
                ❤️ <strong>{post.likes?.length || 0}</strong> me gusta
            </p>
            <p>
                💬 <strong>{post.comments?.length || 0}</strong> comentarios
            </p>
        </div>
    );
};

export default Info;