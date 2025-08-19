import ProtectedRoute from "@/components/ProtectedRoute"
import ProductManagement from "@/components/ProductManagement"

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <ProductManagement />
    </ProtectedRoute>
  )
}
