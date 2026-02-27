import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminClientItem } from "@/types/api";

interface UseAdminClientsParams {
  page?: number;
  search?: string;
  status?: string;
}

interface AdminClientsResponse {
  clients: AdminClientItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useAdminClients({ page = 1, search, status }: UseAdminClientsParams = {}) {
  return useQuery<AdminClientsResponse>({
    queryKey: ["admin-clients", page, search, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const { data } = await api.get(`/api/admin/clients?${params}`);
      return data;
    },
    staleTime: 30_000,
  });
}
