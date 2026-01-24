import { useState } from "react";
import {
  HiArrowRightOnRectangle,
  HiOutlineUser,
  HiChevronDown,
} from "react-icons/hi2";
import { useLogout } from "../useLogout";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import UserAvatar from "./UserAvatar";
import styles from "./User.module.css";

function User() {
  const { logout, isLoading } = useLogout();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.userSection}>
      <p className={styles.greeting}>Welcome,</p>
      <div className={styles.userSummary} onClick={() => setIsOpen(!isOpen)}>
        <UserAvatar />
        <HiChevronDown
          className={`${styles.chevron} ${isOpen ? styles.open : ""}`}
        />
      </div>
      <div className={`${styles.dropdownMenu} ${isOpen ? styles.active : ""}`}>
        <Button
          className={styles.menuItem}
          onClick={() => {
            navigate("/account");
            setIsOpen(false);
          }}
        >
          <HiOutlineUser /> <span className={styles.menuText}>Account</span>
        </Button>

        <Button
          className={styles.menuItem}
          onClick={logout}
          disabled={isLoading}
        >
          <HiArrowRightOnRectangle />
          <span className={styles.menuText}>Log out</span>
        </Button>
      </div>
    </div>
  );
}

export default User;
