import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
  const queryClient = useQueryClient();
  const cachedUser = queryClient.getQueryData(["user"]);

  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    refetchOnMount: cachedUser ? false : true,
    refetchOnWindowFocus: false,
  });
  return { isLoading, user, isAuthenticated: Boolean(user) };
}
