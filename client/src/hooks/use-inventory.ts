import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Inventory, InsertInventory } from "@shared/schema";

export function useInventory(productId?: number, location?: string) {
  return useQuery({
    queryKey: ["/api/inventory", productId, location],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (productId) params.append("productId", productId.toString());
      if (location) params.append("location", location);
      
      const response = await fetch(`/api/inventory?${params}`);
      if (!response.ok) throw new Error("Failed to fetch inventory");
      return response.json() as Promise<Inventory[]>;
    },
  });
}

export function useProductInventory(productId: number) {
  return useQuery({
    queryKey: ["/api/inventory/product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/inventory/product/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product inventory");
      return response.json() as Promise<Inventory[]>;
    },
    enabled: !!productId,
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertInventory> }) => {
      const response = await apiRequest("PUT", `/api/inventory/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}

export function useTransferStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      productId: number;
      fromLocation: string;
      toLocation: string;
      quantity: number;
      userId?: number;
    }) => {
      const response = await apiRequest("POST", "/api/inventory/transfer", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stock-movements"] });
    },
  });
}

export function useStockMovements(productId?: number, limit?: number) {
  return useQuery({
    queryKey: ["/api/stock-movements", productId, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (productId) params.append("productId", productId.toString());
      if (limit) params.append("limit", limit.toString());
      
      const response = await fetch(`/api/stock-movements?${params}`);
      if (!response.ok) throw new Error("Failed to fetch stock movements");
      return response.json();
    },
  });
}
