import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

// Placeholder pages for now
const Products = () => <div className="p-8">Products Page</div>
const ProductDetail = () => <div className="p-8">Product Detail Page</div>
const Cart = () => <div className="p-8">Cart Page</div>
const Checkout = () => <div className="p-8">Checkout Page</div>
const Login = () => <div className="p-8">Login Page</div>
const Register = () => <div className="p-8">Register Page</div>

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App
