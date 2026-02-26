import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Order, Refund, CustomerInquiry } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRefunds() {
  const { actor, isFetching } = useActor();
  return useQuery<Refund[]>({
    queryKey: ['refunds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRefunds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<CustomerInquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      items: Array<{ productId: bigint; quantity: bigint; price: bigint }>;
      totalAmount: bigint;
      upiTransactionRef: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(
        data.customerName,
        data.customerPhone,
        data.customerAddress,
        data.items,
        data.totalAmount,
        data.upiTransactionRef
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      price: number;
      category: string;
      image: ExternalBlob;
      stock: number;
      isAvailable: boolean;
      medicineType: string;
      requiresPrescription: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(
        data.name,
        data.description,
        BigInt(data.price),
        data.category,
        data.image,
        BigInt(data.stock),
        data.isAvailable,
        data.medicineType,
        data.requiresPrescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: number;
      name: string;
      description: string;
      price: number;
      category: string;
      image: ExternalBlob;
      stock: number;
      isAvailable: boolean;
      medicineType: string;
      requiresPrescription: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProductWithImage(
        BigInt(data.id),
        data.name,
        data.description,
        BigInt(data.price),
        data.category,
        data.image,
        BigInt(data.stock),
        data.isAvailable,
        data.medicineType,
        data.requiresPrescription
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(BigInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(BigInt(id), status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateRefundStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ refundId, status }: { refundId: number; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRefundStatus(BigInt(refundId), status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
}

export function useRequestRefund() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, reason, amount }: { orderId: number; reason: string; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestRefund(BigInt(orderId), reason, BigInt(amount));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, phone, message }: { name: string; phone: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInquiry(name, phone, message);
    },
  });
}
