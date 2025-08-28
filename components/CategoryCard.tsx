import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/types"

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/shop?category=${category.id}`}
      className="group relative rounded-2xl overflow-hidden h-32 flex items-center justify-center transform transition-all duration-300 hover:scale-98 hover:text-white shadow-lg hover:shadow-xl"
    >
  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/0 via-blue-600/40 to-transparent group-hover:from-blue-800/90 transition-all duration-300"></div>
      <div className="relative z-10 text-center">
        <h3 className="text-blue-700 text-xl font-bold mb-2 drop-shadow-lg ">{category.name}</h3>
        <div className="w-12 h-1 bg-gradient-to-r from-blue-300 to-indigo-300 mx-auto rounded-full"></div>
      </div>
    </Link>
  )
}
