import { useUser } from "../useUser";
import SpinnerFullPage from "../../ui/SpinnerFullPage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [isAuthenticated, isLoading, navigate]
  );

  if (isLoading) return <SpinnerFullPage />;
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
