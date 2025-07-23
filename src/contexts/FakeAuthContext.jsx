import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = { user: null, isAuthenticated: false };

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action");
  }
}

// TODO: Replace with real login API
const FAKE_USER = {
  name: "Ann",
  email: "ann@example.com",
  password: "asdfg",
  avatar: "https://i.pravatar.cc/100?img=31",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // mock API call
  function getFakeUser(email, password) {
    return email === FAKE_USER.email && password === FAKE_USER.password
      ? FAKE_USER
      : null;
  }

  function login(email, password) {
    // mock API call
    const user = getFakeUser(email, password);
    if (user) {
      dispatch({ type: "login", payload: user });
    }
  }
  function logout() {
    dispatch({ type: "logout" });
  }
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
