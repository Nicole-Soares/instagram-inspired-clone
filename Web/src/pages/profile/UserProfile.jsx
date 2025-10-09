import React, { useEffect, useState } from "react";
import apiFetch from "../../service/apiFetch";
import { useParams } from "react-router-dom";
import Storage from "../../service/storage";

import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import PostGrid from "./components/PostGrid/PostGrid";
import PostCard from "./components/PostCard/PostCard";
import "./UserProfile.css";
import { use } from "react";

const API_URL = "http://localhost:7070";

//normaliza los ids a string
const idToString = (v) => {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
  return String(v.id ?? v._id ?? v.userId ?? "").trim();
};

//comprueba si el usuario logueado esta en la lista de seguidores
const isFollowedBy = (followers, meId) => {
  if (!meId || !Array.isArray(followers)) return false;
  const me = idToString(meId);
  return followers.some((f) => idToString(f) === me);
};

//calcula los flags isMe, isFollowing y followersCount
const computeProfileFlags = (profile, meId) => {
  const me = idToString(meId);
  const profileId = idToString(profile);
  const followers = Array.isArray(profile.followers) ? profile.followers : [];
  const isMe = !!me && (me === profileId);
  const isFollowing = !isMe && isFollowedBy(followers, me);
  const followersCount = Number.isFinite(profile.followersCount)
    ? profile.followersCount
    : followers.length;
  return { isMe, isFollowing, followersCount };
};

//obtiene el Id del usuario logueado y lo normaliza
const getMeId = () => {
  const stored = Storage.getUserId?.();
  if (stored) return idToString(stored);
  try {
    const raw = (Storage.getToken() || "").replace(/^Bearer\s+/i, "");
    const payload = JSON.parse(atob(raw.split(".")[1] || ""));
    return idToString(payload.userId);
  } catch {
    return "";
  }
};

function UserProfile() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followPending, setFollowPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const res = await apiFetch(`${API_URL}/user/${userId}`, {
          method: "GET",
          signal: controller.signal,
        }, "No fue posible obtener el perfil. ");

        setData(res);
        const meId = getMeId();
        const flags = computeProfileFlags(res, meId);
        setIsMe(flags.isMe);
        setIsFollowing(flags.isFollowing);
        setFollowersCount(flags.followersCount);

      } catch (e) {
        if (e.name !== "AbortError") {
          setErrorMessage(e.message || "No fue posible cargar el perfil");
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [userId]);

  const handleToggleFollow = async () => {
    if (!data || followPending || isMe) return;
    setFollowPending(true);

    try {
      const res = await apiFetch(`${API_URL}/users/${userId}/follow`, {
        method: "PUT",
      }, "Fallo al realizar la accion de seguir/dejar de seguir.");

      setData(res);
      const meId = getMeId();
      const flags = computeProfileFlags(res, meId);
      setIsFollowing(flags.isFollowing);
      setFollowersCount(flags.followersCount);

    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setFollowPending(false);
    }
  };

  if (loading) return <div className="user-profile"><p>Cargando perfil…</p></div>;
  if (!data) return <div className="user-profile"><p>{errorMessage || "No se encontró el usuario."}</p></div>;

  const posts = data.posts || [];
  
  return (
    <div className="user-profile">
      <ProfileHeader
        avatar={data.image}
        name={data.name}
        postsCount={posts.length}
        followedCount={followersCount}
        showFollowButton={!isMe}           
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
        disabledFollow={followPending}
      />
      <PostGrid>
        {posts.map((p) => (
          <PostCard 
            key={p.id}
            id={p.id}
            src={p.image} 
          />
        ))}
      </PostGrid>
    </div>
  );
}

export default UserProfile;
