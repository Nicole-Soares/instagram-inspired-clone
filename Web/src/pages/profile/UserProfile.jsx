import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import{getUserProfile, followUser} from "../../service/profile/UserService";
import Storage from "../../service/storage";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import PostGrid from "../../generalComponents/PostGrid/PostGrid";
import PostCard from "../../generalComponents/PostGrid/PostCard";
import SideBar from "../../generalComponents/SideBar";
import UnauthorizedModal from "../../generalComponents/modals/UnauthorizedModal";
import NotFoundModal from "../../generalComponents/modals/NotFoundModal";
import { computeProfileFlags } from "../../utils/profileHelpers"
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

    const loadProfile = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await getUserProfile(userId);
        setData(res);
        const meId = Storage.getUserId();
        const flags = await computeProfileFlags(res, meId);
        console.log(flags)
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
      // ✅ Actualización visual instantánea (optimistic update)
      setIsFollowing((prev) => !prev);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  
      // ✅ Llamamos al backend (mismo endpoint follow/unfollow)
      await followUser(userId);
  
    } catch (e) {
      console.error("Error en follow/unfollow:", e);
  
      // ⚠️ Revertimos los cambios si falla
      setIsFollowing((prev) => !prev);
      setFollowersCount((prev) => (isFollowing ? prev + 1 : prev - 1));
      setErrorMessage(e.message || "Error al seguir usuario");
    } finally {
      // 🔓 Rehabilitamos el botón siempre
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
