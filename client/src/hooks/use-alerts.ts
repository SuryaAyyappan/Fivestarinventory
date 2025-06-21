import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Alert, InsertAlert } from "@shared/schema";

export function useAlerts(isRead?: boolean, isResolved?: boolean) {
  return useQuery({
    queryKey: ["/api/alerts", isRead, isResolved],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (isRead !== undefined) params.append("isRead", isRead.toString());
      if (isResolved !== undefined) params.append("isResolved", isResolved.toString());
      
      const response = await fetch(`/api/alerts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json() as Promise<Alert[]>;
    },
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertAlert) => {
      const response = await apiRequest("POST", "/api/alerts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });
}

export function useMarkAlertAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("PATCH", `/api/alerts/${id}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, userId }: { id: number; userId?: number }) => {
      const response = await apiRequest("PATCH", `/api/alerts/${id}/resolve`, { userId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });
}
