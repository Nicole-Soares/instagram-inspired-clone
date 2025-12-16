import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import '../../style/Home/Home.css';
import Storage from '../../service/storage';
import apiFetch from '../../service/apiFetch';
import UnauthorizedModal from '../../GeneralComponents/modals/UnauthorizedModal';
import TimelinePost from './components/TimelinePost';
import SideBar from '../../generalComponents/SideBar';


const Home = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const navigate = useNavigate();
    const token = Storage.getToken();

    useEffect(() => {
        if (!token || Storage.isTokenExpired()) {
            setIsUnauthorized(true);
            setLoading(false);
            return;
        }

        const fetchTimeline = async () => {
            try {
                const data = await apiFetch(`${API_BASE_URL}/user`, { method: 'GET' });
                setPosts(data.timeline || []);
                setIsUnauthorized(false);
            } catch (error) {
                const status = error.response?.status || error.status;
                if (status === 401) {
                    setIsUnauthorized(true);
                } else {
                    toast.error("Error al cargar las publicaciones de los usuarios que seguis.");
                    console.error(error);
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
            <SideBar/>
            <div className="main-content-container">
                <div className="timeline-container">
                    {posts.length > 0 ? (
                        posts.map(post =>
                            <TimelinePost
                                key={post.id}
                                post={post}
                                onUpdatePost={handleUpdatePost} />)
                    ) : (
                        <div className='home-container-sinSeguidos'>
                        <p>Seguí a tus amigos para ver fotos y videos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;