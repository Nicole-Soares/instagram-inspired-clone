import "../../../style/postCard.css";

function PostCard({ src }) {
  return (
    <article className="search-post-card">
      <img src={src} alt="post" className="search-post-card-img" />
    </article>
  );
}

export default PostCard;