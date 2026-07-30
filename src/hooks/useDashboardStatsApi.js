import { useQuery } from "@tanstack/react-query";

export function useDashboardStatsApi() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async function getStats() {
      const res = await fetch("/api/stats");
      if (!res.ok) throw new Error("Dashboard Stats could not be loaded");
      return res.json();
    },
  });
}
