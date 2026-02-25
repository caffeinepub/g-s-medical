import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Order, UserProfile, Refund, SellerPublic } from '../backend';
import { ExternalBlob } from '../backend';

// ─── Products ────────────────────────────────────────────────────────────────

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

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: {
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageFile: File | null;
      imageUrl: string;
      stock: bigint;
      isAvailable: boolean;
      medicineType: string;
      requiresPrescription: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      let image: ExternalBlob;
      if (product.imageFile) {
        const bytes = new Uint8Array(await product.imageFile.arrayBuffer());
        image = ExternalBlob.fromBytes(bytes);
      } else {
        image = ExternalBlob.fromURL(
          product.imageUrl || '/assets/generated/product-placeholder.dim_400x400.png',
        );
      }
      return actor.addProduct(
        product.name,
        product.description,
        product.price,
        product.category,
        image,
        product.stock,
        product.isAvailable,
        product.medicineType,
        product.requiresPrescription,
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
    mutationFn: async (product: {
      id: bigint;
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageFile: File | null;
      imageUrl: string;
      stock: bigint;
      isAvailable: boolean;
      medicineType: string;
      requiresPrescription: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      let image: ExternalBlob;
      if (product.imageFile) {
        const bytes = new Uint8Array(await product.imageFile.arrayBuffer());
        image = ExternalBlob.fromBytes(bytes);
      } else {
        image = ExternalBlob.fromURL(
          product.imageUrl || '/assets/generated/product-placeholder.dim_400x400.png',
        );
      }
      return actor.updateProductWithImage(
        product.id,
        product.name,
        product.description,
        product.price,
        product.category,
        image,
        product.stock,
        product.isAvailable,
        product.medicineType,
        product.requiresPrescription,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

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

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: {
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      items: Array<{ productId: bigint; quantity: bigint; price: bigint }>;
      totalAmount: bigint;
      upiTransactionRef: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(
        order.customerName,
        order.customerPhone,
        order.customerAddress,
        order.items,
        order.totalAmount,
        order.upiTransactionRef,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// ─── Refunds ─────────────────────────────────────────────────────────────────

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

export function useUpdateRefundStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ refundId, status }: { refundId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRefundStatus(refundId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
    },
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ name, phone, message }: { name: string; phone: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInquiry(name, phone, message);
    },
  });
}

export function useGetInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Seller Registration ──────────────────────────────────────────────────────

export function useSellerRegister() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      storeName: string;
      ownerName: string;
      email: string;
      phone: string;
      passwordHash: string;
      aadhaarNumber: string;
      panNumber: string;
      medicalLicenseNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sellerRegister(
        data.storeName,
        data.ownerName,
        data.email,
        data.phone,
        data.passwordHash,
        data.aadhaarNumber,
        data.panNumber,
        data.medicalLicenseNumber,
      );
    },
  });
}

// ─── Seller Products ──────────────────────────────────────────────────────────

export function useGetSellerProducts(sellerId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['sellerProducts', sellerId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSellerProducts(sellerId);
    },
    enabled: !!actor && !isFetching && !!sellerId,
  });
}

export function useAddSellerProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sellerId: string;
      passwordHash: string;
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageFile: File | null;
      imageUrl: string;
      stock: bigint;
      isAvailable: boolean;
      medicineType: string;
      requiresPrescription: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      let image: ExternalBlob;
      if (data.imageFile) {
        const bytes = new Uint8Array(await data.imageFile.arrayBuffer());
        image = ExternalBlob.fromBytes(bytes);
      } else {
        image = ExternalBlob.fromURL(
          data.imageUrl || '/assets/generated/product-placeholder.dim_400x400.png',
        );
      }
      return actor.addSellerProduct(
        data.sellerId,
        data.passwordHash,
        data.name,
        data.description,
        data.price,
        data.category,
        image,
        data.stock,
        data.isAvailable,
        data.medicineType,
        data.requiresPrescription,
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts', vars.sellerId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateSellerProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      sellerId: string;
      passwordHash: string;
      id: bigint;
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageFile: File | null;
      imageUrl: string;
      stock: bigint;
      isAvailable: boolean;
      medicineType: string;
      requiresPrescription: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      let image: ExternalBlob;
      if (data.imageFile) {
        const bytes = new Uint8Array(await data.imageFile.arrayBuffer());
        image = ExternalBlob.fromBytes(bytes);
      } else {
        image = ExternalBlob.fromURL(
          data.imageUrl || '/assets/generated/product-placeholder.dim_400x400.png',
        );
      }
      return actor.updateSellerProductWithImage(
        data.sellerId,
        data.passwordHash,
        data.id,
        data.name,
        data.description,
        data.price,
        data.category,
        image,
        data.stock,
        data.isAvailable,
        data.medicineType,
        data.requiresPrescription,
      );
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts', vars.sellerId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteSellerProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { sellerId: string; passwordHash: string; productId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSellerProduct(data.sellerId, data.passwordHash, data.productId);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['sellerProducts', vars.sellerId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// ─── Seller Orders ────────────────────────────────────────────────────────────

export function useGetSellerOrders(sellerId: string, passwordHash: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['sellerOrders', sellerId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSellerOrders(sellerId, passwordHash);
    },
    enabled: !!actor && !isFetching && !!sellerId && !!passwordHash,
  });
}

// ─── Admin Sellers ────────────────────────────────────────────────────────────

export function useGetSellers() {
  const { actor, isFetching } = useActor();
  return useQuery<SellerPublic[]>({
    queryKey: ['sellers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSellers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSellerVerificationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sellerId, status }: { sellerId: string; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSellerVerificationStatus(sellerId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
    },
  });
}
