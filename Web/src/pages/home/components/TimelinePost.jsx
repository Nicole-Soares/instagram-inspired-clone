import HeaderPost from '../../../GeneralComponents/HeaderPost';
import Info from '../../../GeneralComponents/Info';
import { useNavigate } from 'react-router-dom';
import '../../../style/TimelinePost.css';

export default function TimelinePost({ post, onUpdatePost }) {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/post/${post.id}`);
    };

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
                onClick={handleRedirect}
            />

            <Info
                post={post}
                postId={post.id}
                onUpdatePost={onUpdatePost}
                handleRedirect={handleRedirect}
            />


            <div className="post-description">
                <p>{post.description}</p>
            </div>
        </div>
    );
};

