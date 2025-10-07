import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import PostGrid from "./components/PostGrid/PostGrid";
import PostCard from "./components/PostCard/PostCard";
import "./UserProfile.css";

const API_BASE = "http://localhost:7070";

const getToken = () => {
  const t = localStorage.getItem("token");
  return t ? `Bearer ${t}` : "";
};

async function apiFetch(path, { method = "GET", body, signal } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  let detail = res.statusText;
  try {
    const data = await res.json();
    if (!res.ok) {
      detail = data.error || data.message || JSON.stringify(data);
      throw new Error(detail);
    }
    return data;
  } catch (e) {
    if (!res.ok) throw new Error(detail);
    return null;
  }
}

function UserProfile() {
  const { userId } = useParams();
  const [data, setData] = useState(null);   
  const [isFollowing, setIsFollowing] = useState(false); 
  const [followPending, setFollowPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      
      try {
        const profile = await fetchProfile(userId, controller.signal);
        setData(profile || null);
        setIsFollowing(Boolean(profile?.isFollowing));
      } catch (err) {
        toast.error(`No se pudo cargar el perfil ${err.message}`);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [userId]);  

  const handleToggleFollow = async () => {
    if(!data || followPending) return;
    setFollowPending(true);

    const prevIsFollowing = isFollowing;
    setIsFollowing((p) => !p);

    try {
      const updated = await apiFetch(`/users/${userId}/follow`, { method: "PUT" });
      setData(updated);
      setIsFollowing(Boolean(updated?.isFollowing));
      toast.success(prev ? "Dejaste de seguir." : "Ahora seguis a este usuario.");
    } catch (err) {
      setIsFollowing(prev);
      toast.error(`No se pudo actualizar: ${err.message}`);
    } finally {
      setFollowPending(false);
    }
  };

  if (loading) return <div className="user-profile"><p>Cargando perfil…</p></div>;
  if (!data) return <div className="user-profile"><p>{err}</p></div>;

  const posts = data.posts ?? [];
  const followers = data.followers ?? [];
  const isOwnProfile = Boolean(me?.id && data?.id && me.id === data.id);

  return (
    <div className="user-profile">
      <ProfileHeader
        avatar={data.image}
        name={data.name}
        postsCount={posts.length}
        followedCount={followers.length}
        showFollowButton={!isOwnProfile}
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
        disabledFollow={followPending}
      />
      <PostGrid>
        {posts.map(p => (
          <PostCard key={p.id} src={p.image}/>
        ))}
      </PostGrid>
    </div>
  );
}

export default UserProfile;
