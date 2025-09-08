import { useState, useEffect } from "react";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";

function Login() {
  // Pre-fill for dev purpose
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("asdfg");

  const { isAuthenticated, login } = useAuth();

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password); // 是否要加收 login 的回傳值
    }
  }

  useEffect(
    function () {
      if (isAuthenticated) {
        navigate("/dashboard", { replace: true });
      }
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className="login">
      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
        </div>
        <div className="row">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
        </div>
        <div>
          <Button>Login</Button>
        </div>
      </form>
    </main>
  );
}

export default Login;
