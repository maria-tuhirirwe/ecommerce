// Firebase Collection References and Helper Functions

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { BargainOffer, Order, Customer, SiteSettings } from "./firebase-schema"

// Collection References
export const categoriesRef = collection(db, "categories")
export const productsRef = collection(db, "products")
export const bargainOffersRef = collection(db, "bargain_offers")
export const ordersRef = collection(db, "orders")
export const orderItemsRef = collection(db, "order_items")
export const customersRef = collection(db, "customers")
export const inventoryLogsRef = collection(db, "inventory_logs")
export const adminUsersRef = collection(db, "admin_users")
export const siteSettingsRef = collection(db, "site_settings")

// Helper Functions for Bargain Offers
export async function createBargainOffer(offer: Omit<BargainOffer, "id" | "createdAt">) {
  try {
    const docRef = await addDoc(bargainOffersRef, {
      ...offer,
      createdAt: Timestamp.now(),
      status: "pending",
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating bargain offer:", error)
    throw error
  }
}

export async function getBargainOffers(status?: string) {
  try {
    let q = query(bargainOffersRef, orderBy("createdAt", "desc"))

    if (status) {
      q = query(bargainOffersRef, where("status", "==", status), orderBy("createdAt", "desc"))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BargainOffer[]
  } catch (error) {
    console.error("Error fetching bargain offers:", error)
    throw error
  }
}

export async function updateBargainOfferStatus(
  offerId: string,
  status: BargainOffer["status"],
  adminResponse?: string,
  counterOffer?: number,
) {
  try {
    const offerRef = doc(db, "bargain_offers", offerId)
    await updateDoc(offerRef, {
      status,
      respondedAt: Timestamp.now(),
      ...(adminResponse && { adminResponse }),
      ...(counterOffer && { counterOffer }),
    })
  } catch (error) {
    console.error("Error updating bargain offer:", error)
    throw error
  }
}

// Helper Functions for Orders
export async function createOrder(order: Omit<Order, "id" | "createdAt" | "updatedAt" | "orderNumber">) {
  try {
    const orderNumber = `TH${Date.now()}`
    const docRef = await addDoc(ordersRef, {
      ...order,
      orderNumber,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: "pending",
    })
    return { id: docRef.id, orderNumber }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Helper Functions for Customers
export async function createOrUpdateCustomer(customerData: Omit<Customer, "id" | "createdAt">) {
  try {
    // Check if customer exists by phone
    const q = query(customersRef, where("phone", "==", customerData.phone))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      // Create new customer
      const docRef = await addDoc(customersRef, {
        ...customerData,
        createdAt: Timestamp.now(),
        totalOrders: 0,
        totalSpent: 0,
        orderHistory: [],
        isVip: false,
      })
      return docRef.id
    } else {
      // Update existing customer
      const existingCustomer = querySnapshot.docs[0]
      await updateDoc(existingCustomer.ref, {
        ...customerData,
        lastOrderAt: Timestamp.now(),
      })
      return existingCustomer.id
    }
  } catch (error) {
    console.error("Error creating/updating customer:", error)
    throw error
  }
}

// Helper Functions for Inventory
export async function updateProductStock(productId: string, quantityChange: number, reason: string) {
  try {
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)

    if (productSnap.exists()) {
      const currentStock = productSnap.data().stockQuantity || 0
      const newQuantity = currentStock + quantityChange

      // Update product stock
      await updateDoc(productRef, {
        stockQuantity: newQuantity,
        updatedAt: Timestamp.now(),
      })

      // Log inventory change
      await addDoc(inventoryLogsRef, {
        productId,
        action: quantityChange > 0 ? "stock_in" : "stock_out",
        quantityChange,
        newQuantity,
        reason,
        createdAt: Timestamp.now(),
      })

      return newQuantity
    }
  } catch (error) {
    console.error("Error updating product stock:", error)
    throw error
  }
}

// Helper Functions for Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const q = query(siteSettingsRef, limit(1))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as SiteSettings
    }
    return null
  } catch (error) {
    console.error("Error fetching site settings:", error)
    throw error
  }
}
