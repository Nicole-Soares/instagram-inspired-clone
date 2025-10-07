import "../../../style/userCard.css";

function UserCard({ src }) {
  return (
    <article className="user-card">
      <img src={src} alt="user" className="user-card-img" />
    </article>
  );
}

export default UserCard;