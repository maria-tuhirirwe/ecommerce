import ProtectedRoute from "@/components/ProtectedRoute"
import CategoryManagement from "@/components/CategoryManagement"

export default function AdminCategoriesPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <CategoryManagement />
    </ProtectedRoute>
  )
}
