import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { FilterProvider } from './context/FilterContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <FilterProvider>
          <div className="min-h-screen">
            <Navbar />
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </FilterProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
