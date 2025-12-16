import "../../style/postCard.css";
import { Link } from "react-router-dom";

function PostCard({ id, src }) {
  return (
    <Link to={`/post/${id}`} className="post-card-link">
      <article className="post-card">
        <img src={src} alt={`Post ${id}`} className="post-card-img" />
      </article>
    </Link>
  );
}

export default PostCard;