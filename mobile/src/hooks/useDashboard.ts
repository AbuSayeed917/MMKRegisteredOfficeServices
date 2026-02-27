import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardResponse } from "@/types/api";

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/api/dashboard");
      return data;
    },
    staleTime: 60_000, // 1 minute
  });
}
