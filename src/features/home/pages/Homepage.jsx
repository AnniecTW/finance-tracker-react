import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.css";
import Button from "../../ui/Button";

function Homepage() {
  const navigate = useNavigate();
  return (
    <div className={styles.homepage}>
      <h1 className={styles.appTitle}>My finance tracker</h1>
      <div className={styles.features}>
        <p>💰 Track your spending smartly.</p>
        <p>📊 Visualize expenses.</p>
        <p>🤖 AI helps you save more.</p>
        <div className={styles.authBtns}>
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/signup")}>Sign up</Button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
