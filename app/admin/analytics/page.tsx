import ProtectedRoute from "@/components/ProtectedRoute"
import SalesAnalytics from "@/components/SalesAnalytics"

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <SalesAnalytics />
    </ProtectedRoute>
  )
}
