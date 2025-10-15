import "./FollowButton.css";

function FollowButton({ isFollowing, onToggle, disabled }) {
  return (
    <button
      type="button"
      className={`follow-button ${isFollowing ? "following" : ""}`}
      onClick={onToggle}
      disabled={disabled}
    >
      {isFollowing ? "Dejar de seguir" : "Seguir"}
    </button>
  );
}

export default FollowButton;