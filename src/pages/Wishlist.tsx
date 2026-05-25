import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    removeItem(item.id);
  };

  return (
    <main className="w-full min-h-screen pt-24 pb-12 section-cream">
      <div className="w-full px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#1d2b30]/40 mb-3">
                Saved For Later
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-[#1d2b30]">
                Your Wishlist
              </h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm text-[#1d2b30]/50 hover:text-red-500 transition-colors"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          {/* Content */}
          {items.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center py-20 text-center transition-all duration-700 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-[#1d2b30]/5 flex items-center justify-center mb-6">
                <Heart size={32} className="text-[#1d2b30]/20" />
              </div>
              <h2 className="font-display text-2xl text-[#1d2b30] mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-[#1d2b30]/50 max-w-md mb-8">
                Save your favorite items here to keep track of what you love. Start exploring our collections.
              </p>
              <Link to="/collections" className="btn-primary bg-[#1d2b30] text-white hover:bg-[#2a3f45]">
                Explore Collections
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-[15px] overflow-hidden border border-[#1d2b30]/5 hover:border-[#1d2b30]/10 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="block aspect-[3/4] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-sm font-medium text-[#1d2b30] truncate group-hover:text-[#c9a55c] transition-colors mb-2">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-lg font-semibold text-[#1d2b30] mb-4">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 py-2.5 bg-[#1d2b30] text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-[#2a3f45] transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={14} />
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#1d2b30]/10 text-[#1d2b30]/40 hover:text-red-500 hover:border-red-200 transition-all"
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
