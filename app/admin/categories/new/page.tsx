import ProtectedRoute from "@/components/ProtectedRoute"
import CategoryForm from "@/components/CategoryForm"

export default function NewCategoryPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <CategoryForm />
    </ProtectedRoute>
  )
}
