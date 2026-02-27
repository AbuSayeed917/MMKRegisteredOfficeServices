import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminClientDetail, AdminActionType } from "@/types/api";

export function useAdminClientDetail(id: string) {
  return useQuery<AdminClientDetail>({
    queryKey: ["admin-client", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/clients/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useAdminAction(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      reason,
      notes,
    }: {
      action: AdminActionType;
      reason?: string;
      notes?: string;
    }) => {
      const { data } = await api.post(`/api/admin/clients/${clientId}/action`, {
        action,
        reason,
        notes,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-client", clientId] });
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
}
