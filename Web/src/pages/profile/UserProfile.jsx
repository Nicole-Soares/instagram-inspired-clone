import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import PostGrid from "./components/PostGrid/PostGrid";
import PostCard from "./components/PostCard/PostCard";
import "./UserProfile.css";

const API_BASE = "http://localhost:7070";

function UserProfile() {
  const { userId } = useParams();

  const [data, setData] = useState(null);   
  const [isFollowing, setIsFollowing] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_BASE}/user/${userId}`, {
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          let detail = "";
          try {
            const j = await res.json();
            detail = j.error || j.message || JSON.stringify(j);
          } catch {
            detail = res.statusText;
          }
          throw new Error(`Error ${res.status}: ${detail}`);
        }
        const payload = await res.json();
        setData(payload);
        setIsFollowing(false);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [userId]);

  const handleIsFollowing = () => setIsFollowing(prev => !prev);

  if (loading) return <div className="user-profile"><p>Cargando perfil…</p></div>;
  if (err) return <div className="user-profile"><p style={{color:"red"}}>{err}</p></div>;
  if (!data) return null;

  const posts = data.posts ?? [];
  const followers = data.followers ?? [];

  return (
    <div className="user-profile">
      <ProfileHeader
        avatar={data.image || "https://via.placeholder.com/150"}
        name={data.name || `user_${data.id}`}
        postsCount={posts.length}
        followedCount={followers.length}
        isFollowing={isFollowing}
        onToggleFollow={handleIsFollowing}
      />

      <PostGrid>
        {posts.map(p => (
          <PostCard key={p.id} src={p.image} />
        ))}
      </PostGrid>
    </div>
  );
}

export default UserProfile;
