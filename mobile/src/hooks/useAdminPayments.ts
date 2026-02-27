import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminPaymentsResponse } from "@/types/api";

interface UseAdminPaymentsParams {
  page?: number;
  search?: string;
  status?: string;
}

export function useAdminPayments({ page = 1, search, status }: UseAdminPaymentsParams = {}) {
  return useQuery<AdminPaymentsResponse>({
    queryKey: ["admin-payments", page, search, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const { data } = await api.get(`/api/admin/payments?${params}`);
      return data;
    },
    staleTime: 30_000,
  });
}
