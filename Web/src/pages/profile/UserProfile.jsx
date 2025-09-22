import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import PostGrid from "./components/PostGrid/PostGrid";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import PostCard from "./components/PostCard/PostCard";
import "./UserProfile.css";

function UserProfile() {
  const { username } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);

  const posts = [
    { id: 1, src: "https://picsum.photos/601?1" },
    { id: 2, src: "https://picsum.photos/600?2" },
    { id: 3, src: "https://picsum.photos/600?3" },
    { id: 4, src: "https://picsum.photos/600?4" },
    { id: 5, src: "https://picsum.photos/600?5" },
    { id: 6, src: "https://picsum.photos/600?6" },
    { id: 7, src: "https://picsum.photos/600?7" },
    { id: 8, src: "https://picsum.photos/600?8" },
    { id: 9, src: "https://picsum.photos/600?9" },
  ];

  return (
    <div className="user-profile">
      <ProfileHeader
        avatar="https://via.placeholder.com/150"
        name="Juan"
        postsCount={posts.length}
        followedCount={123}
        isFollowing={isFollowing}
        onToggleFollow={() => setIsFollowing(prev => !prev)}
      />
      <PostGrid>
        {posts.map(p => (
          <PostCard key={p.id} src={p.src} />
        ))}
      </PostGrid>
    </div>
  );
}

export default UserProfile;