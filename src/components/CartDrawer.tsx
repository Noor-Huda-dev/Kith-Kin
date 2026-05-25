import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-400 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#1d2b30] border-l border-white/10 z-[70] cart-drawer flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#fed286]" />
            <h2 className="font-display text-xl text-white">Your Cart</h2>
            <span className="text-sm text-white/50">({items.length} items)</span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-white/20 mb-4" />
              <p className="font-display text-lg text-white/60 mb-2">Your cart is empty</p>
              <p className="text-sm text-white/40 mb-6">Add some items to get started</p>
              <button onClick={closeCart} className="btn-primary">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item.id}`}
                    onClick={closeCart}
                    className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/10"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={closeCart}
                      className="block text-sm font-medium text-white truncate hover:text-[#fed286] transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-[#fed286] font-semibold mt-1">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium text-white w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1.5 text-white/40 hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-sm text-white/40 hover:text-red-400 transition-colors text-center"
                >
                  Clear all items
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Shipping</span>
                <span className="text-[#fed286]">Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-white pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-[#fed286]">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="w-full btn-primary py-4">
              Proceed to Checkout
            </button>
            <button
              onClick={closeCart}
              className="w-full btn-outline py-3 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
