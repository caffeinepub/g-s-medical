import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Refund {
    status: string;
    refundId: bigint;
    orderId: bigint;
    timestamp: bigint;
    amount: bigint;
    reason: string;
}
export interface CustomerInquiry {
    name: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
    price: bigint;
}
export interface Customer {
    id: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    phone: string;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    customerPhone: string;
    createdAt: bigint;
    customerAddress: string;
    totalAmount: bigint;
    customerId?: bigint;
    items: Array<OrderItem>;
    upiTransactionRef: string;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface SellerPublic {
    id: string;
    medicalLicenseNumber: string;
    ownerName: string;
    createdAt: bigint;
    isActive: boolean;
    email: string;
    storeName: string;
    panNumber: string;
    aadhaarNumber: string;
    phone: string;
    verificationStatus: string;
}
export interface Product {
    id: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    stock: bigint;
    category: string;
    requiresPrescription: boolean;
    sellerId?: string;
    image: ExternalBlob;
    price: bigint;
    medicineType: string;
}
export interface UserProfile {
    name: string;
    address: string;
    phone: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: bigint, category: string, image: ExternalBlob, stock: bigint, isAvailable: boolean, medicineType: string, requiresPrescription: boolean): Promise<bigint>;
    addSellerProduct(sellerId: string, passwordHash: string, name: string, description: string, price: bigint, category: string, image: ExternalBlob, stock: bigint, isAvailable: boolean, medicineType: string, requiresPrescription: boolean): Promise<bigint>;
    adminLogin(email: string, password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    customerLogin(email: string, password: string): Promise<bigint>;
    customerRegister(name: string, phone: string, email: string, password: string): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    deleteSellerProduct(sellerId: string, passwordHash: string, productId: bigint): Promise<void>;
    generateOtp(phone: string): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<string>>;
    getCustomerById(customerId: bigint): Promise<Customer>;
    getInquiries(): Promise<Array<CustomerInquiry>>;
    getOrderById(id: bigint): Promise<Order>;
    getOrders(): Promise<Array<Order>>;
    getProductById(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getRefunds(): Promise<Array<Refund>>;
    getSellerById(id: string): Promise<SellerPublic | null>;
    getSellerDashboard(sellerId: string, passwordHash: string): Promise<string>;
    getSellerOrders(sellerId: string, passwordHash: string): Promise<Array<Order>>;
    getSellerProducts(sellerId: string): Promise<Array<Product>>;
    getSellers(): Promise<Array<SellerPublic>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdminLoggedIn(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isCustomerLoggedIn(customerId: bigint): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    placeOrder(customerName: string, customerPhone: string, customerAddress: string, items: Array<OrderItem>, totalAmount: bigint, upiTransactionRef: string): Promise<bigint>;
    placeOrderWithCustomer(customerId: bigint, items: Array<OrderItem>, totalAmount: bigint, upiTransactionRef: string): Promise<bigint>;
    requestApproval(): Promise<void>;
    requestRefund(orderId: bigint, reason: string, amount: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sellerLogin(email: string, passwordHash: string): Promise<boolean>;
    sellerRegister(storeName: string, ownerName: string, email: string, phone: string, passwordHash: string, aadhaarNumber: string, panNumber: string, medicalLicenseNumber: string): Promise<string>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitInquiry(name: string, phone: string, message: string): Promise<void>;
    updateOrderStatus(id: bigint, status: string): Promise<void>;
    updateProductWithImage(id: bigint, name: string, description: string, price: bigint, category: string, image: ExternalBlob, stock: bigint, isAvailable: boolean, medicineType: string, requiresPrescription: boolean): Promise<void>;
    updateRefundStatus(refundId: bigint, status: string): Promise<void>;
    updateSellerProductWithImage(sellerId: string, passwordHash: string, id: bigint, name: string, description: string, price: bigint, category: string, image: ExternalBlob, stock: bigint, isAvailable: boolean, medicineType: string, requiresPrescription: boolean): Promise<void>;
    updateSellerVerificationStatus(sellerId: string, status: string): Promise<void>;
    verifyOtp(phone: string, otp: string): Promise<boolean>;
}
