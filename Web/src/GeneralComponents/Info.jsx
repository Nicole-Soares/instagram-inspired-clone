import { toast } from "react-toastify";
import Storage from "../service/storage";
import { likePost } from "../service/post/postService";
import "../style/generalComponents/Info.css";
import { useEffect, useState } from "react";

const Info = ({ post, postId, onUpdatePost, handleRedirect}) => {

  const[ userHasLiked, setUserHasLiked] = useState(false);
  const currentUserId = Storage.getUserId();

  useEffect(() => {
    if (post?.likes && currentUserId) {
      setUserHasLiked(post.likes.some((like) => like.id === currentUserId));
    }
  }, [post, currentUserId]);

  const handleClickLike = async () => {
    try {
      const updatedPost = await likePost(postId);

      const hasLikedNow = updatedPost.likes.some(
        (like) => like.id === currentUserId
      );
  
      setUserHasLiked(hasLikedNow);
  
      if (hasLikedNow) {
        toast.success("¡Me gusta registrado! ❤️");
      } else {
        toast.success("¡Me gusta eliminado! 💔");
      }

      if (onUpdatePost) {
        onUpdatePost(updatedPost);
      }

    } catch (error) {
      toast.error("Error al procesar el 'Me gusta'.");
      console.error(error);
    }
  };

  return (
    <div className="infoPost">
      <p onClick={handleClickLike}>
      {userHasLiked ? "❤️" : "🤍"}{" "}
         <strong>{post.likes?.length || 0}</strong> me gusta
      </p>
      <p onClick={handleRedirect}>
        💬 <strong>{post.comments?.length || 0}</strong> comentarios
      </p>
    </div>
  );
};

export default Info;
