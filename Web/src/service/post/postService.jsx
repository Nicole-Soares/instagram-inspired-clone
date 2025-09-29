import Storage from '../storage';
import apiFetch from '../apiFetch';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = Storage.getToken();

const headers = {
    'Content-Type': 'application/json',
    'Authorization': (token),
};

export const getPostById = async (postId) => {
    return apiFetch(`${API_BASE_URL}/posts/${postId}`, { method: 'GET' }, "Error al obtener el post")
};

export const addCommentToPost = async (postId, commentBody) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ body: commentBody }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al enviar el comentario.");
    }
    return response.json();
};

export const likePost = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'PUT',
        headers: headers,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Error al dar like.");
    }
    return response.json();
};