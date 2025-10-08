import apiFetch from '../apiFetch';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getPostById = async (postId) => {
    return apiFetch(`${API_BASE_URL}/posts/${postId}`, { method: 'GET' }, "Error al obtener el post")
};

export const addCommentToPost = async (postId, commentBody) => {
    return apiFetch(
        `${API_BASE_URL}/posts/${postId}/comment`, 
        { 
            method: 'POST', 
            body: JSON.stringify({ body: commentBody }) 
        }, 
        "Error al enviar el comentario" 
    );
};

export const likePost = async (postId) => {
    return apiFetch(
        `${API_BASE_URL}/posts/${postId}/like`, 
        { 
            method: 'PUT' 
        }, 
        "Error al dar like o sacar like" 
    );
};