import React, { useEffect, useState } from "react";
import apiFetch from "../../service/apiFetch";
import { useParams } from "react-router-dom";
import Storage from "../../service/storage";

import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import PostGrid from "./components/PostGrid/PostGrid";
import PostCard from "./components/PostCard/PostCard";
import SideBar from "../../GeneralComponents/SideBar";

import UnauthorizedModal from "../../generalComponents/UnauthorizedModal";

import { computeProfileFlags, getMeId } from "../../utils/profileHelpers"

import "./UserProfile.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserProfile = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [isMe, setIsMe] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followPending, setFollowPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!Storage.getToken() || Storage.isTokenExpired() ) {
      setIsUnauthorized(true);
      return;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const res = await apiFetch(`${API_BASE_URL}/user/${userId}`, {
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
      const res = await apiFetch(`${API_BASE_URL}/users/${userId}/follow`, {
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
  if (isUnauthorized) return <UnauthorizedModal />;
  if (!data) return <div className="user-profile"><p>{errorMessage || "No se encontró el usuario."}</p></div>;
  
  const posts = data.posts || [];
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return (
    <div className="page-container">
      <SideBar />

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
          {sortedPosts.map((p) => (
            <PostCard 
              key={p.id}
              id={p.id}
              src={p.image} 
            />
          ))}
        </PostGrid>
      </div>
    </div>  
  );
}

export default UserProfile;
