import FollowButton from "../FollowButton/FollowButton";
import "./ProfileHeader.css";

export default function ProfileHeader({
  avatar,
  name,
  postsCount,
  followedCount,
  isFollowing,
  onToggleFollow,
}) {
  return (
    <header className="profile-header">
      <img src={avatar} alt="avatar" className="profile-avatar" />
      <div className="profile-info">
        <div className="profile-info-top">
          <h2>{name}</h2>
          <FollowButton
            isFollowing={isFollowing}
            onToggle={onToggleFollow}
          />
        </div>
        <div className="profile-stats">
          <p>{postsCount} publicaciones</p>
          <p>{followedCount} seguidos</p>
        </div> 
      </div>
    </header>
  );
}
