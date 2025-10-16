import "../../../style/postCard.css";

function PostCard({ src }) {
  return (
    <article className="post-card">
      <img src={src} alt="post" className="post-card-img" />
    </article>
  );
}

export default PostCard;