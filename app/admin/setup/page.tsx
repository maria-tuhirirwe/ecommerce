"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("")

  const setupFirebase = async () => {
    if (!isFirebaseConfigured()) {
      setStatus("❌ Firebase is not properly configured. Please check your environment variables.")
      return
    }

    if (!db) {
      setStatus("❌ Firebase database is not initialized.")
      return
    }

    setIsLoading(true)
    setStatus("Setting up Firebase collections...")

    try {
      // Add Categories
      setStatus("Adding categories...")
      const categoriesData = [
        {
          name: "Phones",
          description: "Latest smartphones and mobile devices",
          imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center",
          isActive: true,
          sortOrder: 1,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          name: "Tablets",
          description: "iPads and Android tablets",
          imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop&crop=center",
          isActive: true,
          sortOrder: 2,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          name: "Accessories",
          description: "Phone cases, headphones, and more",
          imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&crop=center",
          isActive: true,
          sortOrder: 3,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          name: "Laptops",
          description: "MacBooks and Windows laptops",
          imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&crop=center",
          isActive: true,
          sortOrder: 4,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
      ]

      const categoryIds: { [key: string]: string } = {}
      for (const category of categoriesData) {
        const docRef = await addDoc(collection(db, "categories"), category)
        categoryIds[category.name.toLowerCase()] = docRef.id
      }

      // Add Products
      setStatus("Adding products...")
      const productsData = [
        {
          name: "iPhone 15 Pro",
          description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system.",
          price: 4500000,
          imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop&crop=center",
          categoryId: categoryIds.phones,
          brand: "Apple",
          model: "iPhone 15 Pro",
          stockQuantity: 10,
          minOrderQuantity: 1,
          isActive: true,
          isFeatured: true,
          tags: ["smartphone", "apple", "premium"],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          name: "Samsung Galaxy S24 Ultra",
          description: "Premium Android smartphone with S Pen, 200MP camera, and AI-powered features.",
          price: 4200000,
          imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center",
          categoryId: categoryIds.phones,
          brand: "Samsung",
          model: "Galaxy S24 Ultra",
          stockQuantity: 8,
          minOrderQuantity: 1,
          isActive: true,
          isFeatured: true,
          tags: ["smartphone", "samsung", "android"],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          name: "AirPods Pro (3rd Gen)",
          description: "Active noise cancellation, spatial audio, and all-day battery life.",
          price: 850000,
          imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop&crop=center",
          categoryId: categoryIds.accessories,
          brand: "Apple",
          model: "AirPods Pro 3rd Gen",
          stockQuantity: 15,
          minOrderQuantity: 1,
          isActive: true,
          isFeatured: false,
          tags: ["headphones", "apple", "wireless"],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          name: 'iPad Pro 12.9"',
          description: "Powerful tablet with M2 chip, Liquid Retina XDR display, and Apple Pencil support.",
          price: 3800000,
          imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center",
          categoryId: categoryIds.tablets,
          brand: "Apple",
          model: "iPad Pro 12.9",
          stockQuantity: 5,
          minOrderQuantity: 1,
          isActive: true,
          isFeatured: true,
          tags: ["tablet", "apple", "professional"],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
        {
          name: 'MacBook Pro 14"',
          description: "Professional laptop with M3 Pro chip, stunning Retina display, and all-day battery life.",
          price: 7500000,
          imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&crop=center",
          categoryId: categoryIds.laptops,
          brand: "Apple",
          model: "MacBook Pro 14",
          stockQuantity: 3,
          minOrderQuantity: 1,
          isActive: true,
          isFeatured: true,
          tags: ["laptop", "apple", "professional"],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        },
      ]

      for (const product of productsData) {
        await addDoc(collection(db, "products"), product)
      }

      // Add Site Settings
      setStatus("Adding site settings...")
      await addDoc(collection(db, "site_settings"), {
        whatsappNumber: "+256789230136",
        businessName: "TechHub Uganda",
        businessAddress: "Kampala, Uganda",
        businessEmail: "techhub@gmail.com",
        deliverySettings: {
          freeDeliveryThreshold: 500000,
          deliveryFee: 25000,
          deliveryAreas: ["Kampala", "Entebbe", "Wakiso"],
        },
        paymentSettings: {
          acceptedMethods: ["whatsapp", "cash_on_delivery", "mobile_money"],
          mobileMoney: {
            mtn: true,
            airtel: true,
          },
        },
        featuredProducts: [],
        updatedAt: Timestamp.now(),
      })

      setStatus("✅ Firebase setup completed successfully!")
    } catch (error) {
      console.error("Setup error:", error)
      setStatus(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Firebase Setup</h1>

        {!isFirebaseConfigured() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Firebase Not Configured</h3>
            <p className="text-yellow-700 text-sm">
              Firebase environment variables are missing. The app is currently running in demo mode with mock data.
            </p>
          </div>
        )}

        <p className="text-gray-600 mb-8">
          {isFirebaseConfigured()
            ? "Click the button below to initialize your Firebase database with sample categories, products, and settings."
            : "Configure Firebase environment variables first, then return to this page to set up your database."}
        </p>

        <Button
          onClick={setupFirebase}
          disabled={isLoading || !isFirebaseConfigured()}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 text-lg"
        >
          {isLoading ? "Setting up..." : "Initialize Firebase Database"}
        </Button>

        {status && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm">{status}</p>
          </div>
        )}

        <div className="mt-8 text-left bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4">
            {isFirebaseConfigured() ? "What this will create:" : "Required Environment Variables:"}
          </h3>
          {isFirebaseConfigured() ? (
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Categories: Phones, Tablets, Accessories, Laptops</li>
              <li>• Sample products with real images and pricing in UGX</li>
              <li>• Site settings with your business information</li>
              <li>• Proper Firebase collections structure</li>
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• NEXT_PUBLIC_FIREBASE_API_KEY</li>
              <li>• NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
              <li>• NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
              <li>• NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
              <li>• NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>• NEXT_PUBLIC_FIREBASE_APP_ID</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
