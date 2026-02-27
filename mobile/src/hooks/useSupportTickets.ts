import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSupportTickets() {
  return useQuery({
    queryKey: ["support-tickets"],
    queryFn: async () => {
      const { data } = await api.get("/api/support-tickets");
      return data;
    },
    staleTime: 30_000,
  });
}

export function useSupportTicketDetail(id: string) {
  return useQuery({
    queryKey: ["support-ticket", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/support-tickets/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { subject: string; category: string; message: string }) => {
      const { data } = await api.post("/api/support-tickets", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
  });
}

export function useReplyTicket(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { message: string }) => {
      const { data } = await api.post(`/api/support-tickets/${id}/reply`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-ticket", id] });
    },
  });
}
