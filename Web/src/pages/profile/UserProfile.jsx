import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import PostGrid from "./components/PostGrid/PostGrid";
import PostCard from "./components/PostCard/PostCard";
import "./UserProfile.css";

const API_URL = "http://localhost:7070";
const AUTH_TOKEN = localStorage.getItem("token");

function UserProfile() {
  const { userId } = useParams();
  const [data, setData] = useState(null);   
  const [isFollowing, setIsFollowing] = useState(false); 
  const [followPending, setFollowPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProfile() {
      setLoading(true);
      setErrorMessage("");
      
      try {
        const res = await fetch(`${API_URL}/user/${userId}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(AUTH_TOKEN ? { Authorization: AUTH_TOKEN } : {}), 
          },
        });

        if (!res.ok) {
          let msg = res.statusText;
          try {
            const err = await res.json();
            msg = err?.error || err?.message || msg;
          } catch {}
          throw new Error(msg);
        }

        const profile = await res.json();
        setData(profile);
        setIsFollowing(Boolean(profile?.isFollowing));
      } catch (e) {
        if (e.name !== "AbortError") {
          setErrorMessage("No fue posible cargar el perfil");
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
    return () => controller.abort();
  }, [userId]);
  
  
  const handleToggleFollow = async () => {
    if(!data || followPending) return;

    setFollowPending(true);

    const prevIsFollowing = isFollowing;
    setIsFollowing(p => !p);

    try {
      const res = await fetch(`${API_URL}/users/${userId}/follow`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH_TOKEN,
        },
      });

      if(!res.ok) {
        let msg = res.statusText;
        try {
          const err = await res.json();
          msg = err?.error || err?.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const updated = await res.json();
      setData(updated);
      setIsFollowing(Boolean(updated?.isFollowing));
    } catch (e) {
      setIsFollowing(prevIsFollowing);
      setErrorMessage(e.message);
    } finally {
      setFollowPending(false);
    }
  };
    
  if (loading) return <div className="user-profile"><p>Cargando perfil…</p></div>;
  if (!data) return <div className="user-profile"><p>{errorMessage || "No se encontro el usuario."}</p></div>;

  const posts = data.posts ?? [];
  const followersCount = data.followersCount ?? data.followers?.length ?? 0;
  const isOwnProfile = Boolean(data.isMe);

  return (
    <div className="user-profile">
      <ProfileHeader
        avatar={data.image}
        name={data.name}
        postsCount={posts.length}
        followedCount={followersCount}
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
