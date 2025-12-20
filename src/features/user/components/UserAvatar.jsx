import { useUser } from "../useUser";

function UserAvatar() {
  const { user } = useUser();
  const { fullName, avatar } = user.user_metadata;
  return (
    <div className="avatar">
      <img src={avatar || "default-user.jpg"} alt={`Avatar of ${fullName}`} />
      <span>{fullName}</span>
    </div>
  );
}

export default UserAvatar;
