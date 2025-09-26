// src/services/postService.js
const API_BASE_URL = 'http://localhost:7070';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyXzEiLCJpYXQiOjE3NTg4NDkxNTMsImV4cCI6MTc1ODkzNTU1M30.jbWtPAZAi_vFj-eLYRrINxo3BJawgHUUgj9MehNRwX4';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': AUTH_TOKEN,
};

export const getPostById = async (postId) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'GET',
        headers: headers,
    });
    if (!response.ok) {
        throw new Error("Error al obtener el post.");
    }
    return response.json();
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