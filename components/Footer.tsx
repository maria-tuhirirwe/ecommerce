import Link from "next/link"
import { Smartphone, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone size={32} className="text-blue-400" />
              <span className="text-2xl font-bold">TechHub</span>
            </div>
            <p className="text-gray-300 mb-4">
              Uganda's premier electronics store. Quality phones, tablets, laptops & accessories with WhatsApp checkout
              convenience.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop?category=phones"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Phones
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=tablets"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Tablets
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=laptops"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=accessories"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-blue-400" />
                <span className="text-gray-300">techhub@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-blue-400" />
                <span className="text-gray-300">+256 783 111 389</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-blue-400" />
                <span className="text-gray-300">Kampala, Uganda</span>
              </div>
            </div>
          </div>
        </div>

           </div>
    </footer>
  )
}
