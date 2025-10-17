import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../../service/profile/UserService";
import Storage from "../../service/storage";

import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import PostGrid from "../../GeneralComponents/PostGrid/PostGrid";
import PostCard from "../../GeneralComponents/PostGrid/PostCard";
import SideBar from "../../GeneralComponents/SideBar";

import UnauthorizedModal from "../../generalComponents/UnauthorizedModal";
import NotFoundModal from "../../generalComponents/NotFoundModal";

import { computeProfileFlags, getMeId } from "../../utils/profileHelpers"

import "./UserProfile.css";

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
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!Storage.getToken() || Storage.isTokenExpired() ) {
      setIsUnauthorized(true);
      return;
    }
  }, []);

  useEffect(() => {

    if (isUnauthorized) return;

    const loadProfile = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await UserService.getUserProfile(userId);
        setData(res);
        const meId = getMeId();
        const flags = computeProfileFlags(res, meId);
        setIsMe(flags.isMe);
        setIsFollowing(flags.isFollowing);
        setFollowersCount(flags.followersCount);

      } catch (error) {
        const status = error.status || 0;
        const message = error.message || "Error desconocido";

        if (status === 401) {
          setIsUnauthorized(true);
        } else if (status == 404) {
          setIsNotFound(true);
        } else {
          setErrorMessage(message);
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

  }, [userId, isUnauthorized]);

  const handleToggleFollow = async () => {
    if (!data || followPending || isMe) return;
    setFollowPending(true);

    try {
      const res = await UserService.followUser(userId);
      setData(res);
      const meId = getMeId();
      const flags = computeProfileFlags(res, meId);
      setIsFollowing(flags.isFollowing);
      setFollowersCount(flags.followersCount);

    } catch (e) {
      if (e.status === 401) {
        setIsUnauthorized(true);
      } else {
        setErrorMessage(e.message);
      }
    } finally {
      setFollowPending(false);
    }
  };

  if (isUnauthorized) return <UnauthorizedModal />;
  if (isNotFound) return <NotFoundModal />;
  if (loading) return <div className="user-profile"><p>Cargando perfil…</p></div>;
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
