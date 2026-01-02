import { useUser } from "../useUser";
import { HiArrowRightOnRectangle, HiOutlineUser } from "react-icons/hi2";
import { useLogout } from "../useLogout";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import UserAvatar from "./UserAvatar";
import styles from "./User.module.css";

function User() {
  const { user } = useUser();
  const { logout, isLoading } = useLogout();
  const navigate = useNavigate();

  return (
    <div className={styles.userContainer}>
      <span>Welcom, {user.name}</span>
      <UserAvatar />
      <Button onClick={() => navigate("/account")}>
        <HiOutlineUser />
      </Button>
      <Button onClick={logout} disabled={isLoading}>
        <HiArrowRightOnRectangle />
      </Button>
    </div>
  );
}

export default User;
