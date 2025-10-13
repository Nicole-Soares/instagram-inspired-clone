import { toast } from "react-toastify";
import Storage from "../service/storage";
import { likePost } from "../service/post/postService";
import "../style/Info.css";

const Info = ({ post, postId, onUpdatePost, handleRedirect}) => {

  const handleClickLike = async () => {
    try {
      const currentUserId = Storage.getUserId();
      if (!currentUserId) {
        toast.error("Debes iniciar sesión para dar 'Me gusta'.");
        return;
      }

      const updatedPost = await likePost(postId);

      const userHasLiked = updatedPost.likes.some(
        (like) => like.id === currentUserId
      );
      //si aparece el like despues de haber hecho el fetch entonces es porque es nuevo
      if (userHasLiked) {
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
        ❤️ <strong>{post.likes?.length || 0}</strong> me gusta
      </p>
      <p onClick={handleRedirect}>
        💬 <strong>{post.comments?.length || 0}</strong> comentarios
      </p>
    </div>
  );
};

export default Info;
