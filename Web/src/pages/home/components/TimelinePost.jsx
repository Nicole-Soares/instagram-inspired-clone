import HeaderPost from '../../../GeneralComponents/HeaderPost';
import Info from '../../../GeneralComponents/Info';
import { useNavigate } from 'react-router-dom';

export default function TimelinePost({ post }) {
    const navigate = useNavigate();

    return (
        <div className="timeline-post">
            <HeaderPost
                user={post.user}
                date={post.date}
                handleNavigateToUser={() => navigate(`/profile/${post.user.id}`)}
                isOwner={false}
            />

            <img
                src={post.image}
                alt="Post content"
                className="post-image"
                onClick={() => navigate(`/post/${post.id}`)}
            />

            <Info
                post={post}
                onLikeClick={() => {
                    // Lógica para dar like
                }}
            />

            <div className="post-description" onClick={() => navigate(`/post/${post.id}`)}>
                <p>{post.description}</p>
            </div>
        </div>
    );
};

