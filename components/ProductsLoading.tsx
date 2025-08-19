export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-lg mb-3"></div>
          <div className="bg-gray-200 h-5 w-2/3 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 w-1/3 rounded mb-2"></div>
          <div className="bg-gray-200 h-5 w-1/4 rounded"></div>
        </div>
      ))}
    </div>
  )
}
