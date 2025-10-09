import React from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";

export default function PostCard({ id, src }) {
  return (
    <Link to={`/post/${id}`} className="post-card-link">
      <article className="post-card">
        <img src={src} alt={`Post ${id}`} className="post-card-img" />
      </article>
    </Link>
  );
}
