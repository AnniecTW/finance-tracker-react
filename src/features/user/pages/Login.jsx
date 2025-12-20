import { useState } from "react";
import { useLogin } from "../useLogin";
import { Link } from "react-router-dom";

import Button from "../../ui/Button";

function Login() {
  // Pre-fill for dev purpose
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("asdfg");

  const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      login({ email, password });
    }
  }

  return (
    <div className="login-page">
      <h3>Log in to your account</h3>
      <main className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-row">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            ></input>
          </div>
          <div className="login-row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            ></input>
          </div>
          <div className="btn-group">
            <Link to="/" className="button">
              Cancel
            </Link>
            <Button type="submit" disabled={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
