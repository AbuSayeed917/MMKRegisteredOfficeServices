import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminOverviewResponse } from "@/types/api";

export function useAdminOverview() {
  return useQuery<AdminOverviewResponse>({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const { data } = await api.get("/api/admin/overview");
      return data;
    },
    staleTime: 30_000,
  });
}
