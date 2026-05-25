import { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../services/api';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = memo(function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
    },
    [addItem, product]
  );

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
    },
    [toggleItem, product]
  );

  const inWishlist = isInWishlist(product.id);
  const discount = Math.floor(Math.random() * 30) + 5;

  return (
    <div
      className="group product-card-hover"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-[15px] overflow-hidden bg-white/5 mb-4">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-pulse bg-white/10" />
          )}

          {/* Product Image */}
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Overlay Actions */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Discount Badge */}
          <div className="absolute top-3 left-3 bg-[#fed286] text-[#1d2b30] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            -{discount}%
          </div>

          {/* Quick Actions */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
          >
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                inWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-[#1d2b30] hover:bg-white'
              }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-white/90 text-[#1d2b30] hover:bg-[#fed286] flex items-center justify-center transition-all duration-300"
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} />
            </button>
            <Link
              to={`/product/${product.id}`}
              className="w-9 h-9 rounded-full bg-white/90 text-[#1d2b30] hover:bg-white flex items-center justify-center transition-all duration-300"
              aria-label="Quick view"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Bottom Add to Cart Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 bg-[#fed286] text-[#1d2b30] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1.5 px-1">
          {/* Category */}
          <p className="text-[11px] text-white/40 uppercase tracking-[0.15em]">
            {product.category}
          </p>

          {/* Title */}
          <h3 className="text-sm font-medium text-white truncate group-hover:text-[#fed286] transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(product.rating.rate)
                      ? 'text-[#fed286] fill-[#fed286]'
                      : 'text-white/20'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-white/40">({product.rating.count})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-base font-semibold text-white">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-white/40 line-through">
              ${(product.price * (1 + discount / 100)).toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;
