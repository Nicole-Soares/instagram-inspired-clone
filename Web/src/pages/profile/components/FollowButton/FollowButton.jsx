import "./FollowButton.css";

function FollowButton({ isFollowing, onToggle }) {
  return (
    <button
      type="button"
      className={`follow-button ${isFollowing ? "following" : ""}`}
      onClick={onToggle}
    >
      {isFollowing ? "Dejar de seguir" : "Seguir"}
    </button>
  );
}

export default FollowButton;