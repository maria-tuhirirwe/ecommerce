// Firebase Firestore Collection Schemas for TechHub E-commerce

export interface Category {
  id: string
  name: string
  description?: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  imageUrls?: string[] // Multiple product images
  categoryId: string
  brand?: string
  model?: string
  specifications?: {
    [key: string]: string | number | boolean
  }
  stockQuantity: number
  minOrderQuantity: number
  isActive: boolean
  isFeatured: boolean
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface BargainOffer {
  id: string
  productId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  offeredPrice: number
  quantity: number
  totalOffer: number
  message?: string
  status: "pending" | "accepted" | "rejected" | "countered"
  createdAt: Date
  respondedAt?: Date
  adminResponse?: string
  counterOffer?: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress?: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "whatsapp" | "cash_on_delivery" | "mobile_money"
  deliveryMethod: "pickup" | "delivery"
  createdAt: Date
  updatedAt: Date
  notes?: string
  whatsappMessageId?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  price: number
  quantity: number
  total: number
  productSnapshot: {
    name: string
    imageUrl?: string
    specifications?: object
  }
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  orderHistory: string[] // Array of order IDs
  totalOrders: number
  totalSpent: number
  firstOrderAt?: Date
  lastOrderAt?: Date
  createdAt: Date
  isVip: boolean
}

export interface InventoryLog {
  id: string
  productId: string
  action: "stock_in" | "stock_out" | "adjustment" | "sale"
  quantityChange: number
  newQuantity: number
  reason: string
  adminId?: string
  createdAt: Date
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "super_admin" | "admin" | "staff"
  permissions: string[]
  createdAt: Date
  lastLoginAt?: Date
  isActive: boolean
}

export interface SiteSettings {
  id: string
  whatsappNumber: string
  businessName: string
  businessAddress: string
  businessEmail: string
  deliverySettings: {
    freeDeliveryThreshold: number
    deliveryFee: number
    deliveryAreas: string[]
  }
  paymentSettings: {
    acceptedMethods: string[]
    mobileMoney: {
      mtn: boolean
      airtel: boolean
    }
  }
  featuredProducts: string[] // Array of product IDs
  updatedAt: Date
}

// Firestore Security Rules Structure
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for categories and products
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Bargain offers - customers can create, admins can manage
    match /bargain_offers/{offerId} {
      allow read: if isAdmin() || resource.data.customerPhone == request.auth.token.phone_number;
      allow create: if true; // Anyone can create offers
      allow update: if isAdmin();
    }
    
    // Orders - customers can read their own, admins can manage all
    match /orders/{orderId} {
      allow read: if isAdmin() || resource.data.customerPhone == request.auth.token.phone_number;
      allow create: if true; // Anyone can create orders
      allow update: if isAdmin();
    }
    
    match /order_items/{itemId} {
      allow read, write: if isAdmin();
    }
    
    // Customers - users can read/update their own data
    match /customers/{customerId} {
      allow read, write: if isAdmin() || resource.data.phone == request.auth.token.phone_number;
    }
    
    // Admin only collections
    match /inventory_logs/{logId} {
      allow read, write: if isAdmin();
    }
    
    match /admin_users/{adminId} {
      allow read, write: if isAdmin();
    }
    
    match /site_settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Helper function to check admin status
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/admin_users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.isActive == true;
    }
  }
}
`
