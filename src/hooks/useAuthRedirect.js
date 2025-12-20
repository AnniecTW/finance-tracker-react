import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

export function useAuthRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session?.data?.session) {
      navigate("/dashboard");
      return;
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          navigate("/dashboard");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);
}
