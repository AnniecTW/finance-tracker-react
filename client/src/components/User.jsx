import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import Button from "./Button";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleClick() {
    logout();
    navigate("/");
  }

  return (
    <div className="user">
      <img src={user.avatar} alt={user.name}></img>
      <span>Welcom, {user.name}</span>
      <Button onClick={handleClick}>Logout</Button>
    </div>
  );
}

export default User;
