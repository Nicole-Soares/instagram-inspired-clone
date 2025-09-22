import "./PostCard.css";

export default function PostCard({ src }) {
  return (
    <article className="post-card">
      <img src={src} alt="post" className="post-card-img" />
    </article>
  );
}
