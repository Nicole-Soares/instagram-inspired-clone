import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';

import '../../style/Home.css';


import Storage from '../../service/storage';
import apiFetch from '../../service/apiFetch';
import UnauthorizedModal from '../../generalComponents/UnauthorizedModal';
import TimelinePost from './components/TimelinePost';


const Home = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const navigate = useNavigate();
    const token = Storage.getToken();

    useEffect(() => {
        // Redirección si no hay token (verificación inicial)
        if (!token) {
            setIsUnauthorized(true);
            setLoading(false);
            return;
        }

        const fetchTimeline = async () => {
            try {
                const data = await apiFetch(`${API_BASE_URL}/user`, { method: 'GET' });
                setPosts(data.timeline || []);
                setIsUnauthorized(false);
            } catch (err) {
                if (err.message === "Unauthorized") {
                    setIsUnauthorized(true);
                } else {
                    console.error("Error al obtener la línea de tiempo:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, [navigate, token]);

    if (isUnauthorized) {
        return <UnauthorizedModal />;
    }

    if (loading) {
        return <div>Cargando...</div>;
    }

    const handleUpdatePost = (updatedPost) => {
        setPosts(posts.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        ));
    };

    return (
        <div className="home-container">
            <ToastContainer />
            <div className="main-content-container">
                <div className="timeline-container">
                    {posts.length > 0 ? (
                        posts.map(post =>
                            <TimelinePost
                                key={post.id}
                                post={post}
                                onUpdatePost={handleUpdatePost} />)
                    ) : (
                        <p>No hay publicaciones para mostrar.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;