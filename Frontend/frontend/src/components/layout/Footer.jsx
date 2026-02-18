import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-secondary text-white pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* About */}
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-sm">M</div>
                        MedStore
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Your trusted online pharmacy for genuine medicines, delivered fast to your doorstep across Pakistan.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
                        <li><Link to="/products" className="hover:text-primary transition">All Products</Link></li>
                        <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Categories</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li><Link to="/products?category=pain" className="hover:text-primary transition">Pain Relief</Link></li>
                        <li><Link to="/products?category=vitamins" className="hover:text-primary transition">Vitamins</Link></li>
                        <li><Link to="/products?category=skin" className="hover:text-primary transition">Skin Care</Link></li>
                        <li><Link to="/products?category=baby" className="hover:text-primary transition">Baby Care</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            <span>0300-1234567</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <span>support@medstore.pk</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>Lahore, Pakistan</span>
                        </li>
                    </ul>
                    <div className="flex gap-4 mt-4">
                        <a href="#" className="hover:text-primary transition"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-primary transition"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-primary transition"><Twitter className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} MedStore. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
