import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Truck, Shield, RefreshCw, ChevronLeft, Minus, Plus } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductSkeletonDetail, ErrorState } from '../components/LoadingStates';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0');
  const { product, loading, error, refetch } = useProduct(productId);
  const { products } = useProducts();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [productId]);

  const relatedProducts = useMemo(() => {
    if (!product || !products.length) return [];
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [product, products]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen pt-24 pb-12 section-cream">
        <div className="w-full px-6 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <ProductSkeletonDetail />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="w-full min-h-screen pt-24 pb-12 section-cream">
        <div className="w-full px-6 lg:px-10">
          <div className="max-w-6xl mx-auto [&_h3]:text-[#1d2b30] [&_p]:text-[#1d2b30]/50">
            <ErrorState
              message={error || 'Product not found'}
              onRetry={() => {
                refetch();
                navigate('/collections');
              }}
            />
          </div>
        </div>
      </main>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discount = Math.floor(Math.random() * 20) + 10;

  // Generate additional images from the same seed
  const images = [
    product.image,
    `https://picsum.photos/seed/${product.id + 200}/600/800`,
    `https://picsum.photos/seed/${product.id + 300}/600/800`,
    `https://picsum.photos/seed/${product.id + 400}/600/800`,
  ];

  return (
    <main className="w-full min-h-screen pt-20 pb-12 section-cream" ref={sectionRef}>
      <div className="w-full px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div
            className={`flex items-center gap-2 mb-8 text-sm transition-all duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Link to="/" className="text-[#1d2b30]/40 hover:text-[#1d2b30] transition-colors">
              Home
            </Link>
            <span className="text-[#1d2b30]/20">/</span>
            <Link to="/collections" className="text-[#1d2b30]/40 hover:text-[#1d2b30] transition-colors">
              Collections
            </Link>
            <span className="text-[#1d2b30]/20">/</span>
            <span className="text-[#1d2b30] truncate max-w-[200px]">{product.title}</span>
          </div>

          {/* Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image Gallery */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Main Image */}
              <div className="aspect-[3/4] rounded-[20px] overflow-hidden bg-[#1d2b30]/5 mb-4 relative">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#fed286] text-[#1d2b30] text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  -{discount}% Off
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? 'border-[#1d2b30]'
                        : 'border-transparent hover:border-[#1d2b30]/30'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div
              className={`transition-all duration-700 delay-150 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Category */}
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#1d2b30]/40 mb-3">
                {product.category}
              </p>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl text-[#1d2b30] mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.floor(product.rating.rate)
                          ? 'text-[#c9a55c] fill-[#c9a55c]'
                          : 'text-[#1d2b30]/20'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-[#1d2b30]/60">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl font-semibold text-[#1d2b30]">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-[#1d2b30]/40 line-through">
                  ${(product.price * (1 + discount / 100)).toFixed(2)}
                </span>
                <span className="bg-[#1d2b30]/5 text-[#1d2b30] text-xs font-medium px-2.5 py-1 rounded-full">
                  Save ${(product.price * (discount / 100)).toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <p className="text-[#1d2b30]/60 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-xs font-medium uppercase tracking-[0.15em] text-[#1d2b30]/40 mb-3 block">
                  Quantity
                </label>
                <div className="inline-flex items-center gap-4 bg-[#1d2b30]/5 rounded-xl px-4 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1d2b30]/10 transition-colors"
                  >
                    <Minus size={16} className="text-[#1d2b30]" />
                  </button>
                  <span className="text-lg font-medium text-[#1d2b30] w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1d2b30]/10 transition-colors"
                  >
                    <Plus size={16} className="text-[#1d2b30]" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-10">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-[15px] font-medium text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-[#1d2b30] text-white hover:bg-[#2a3f45]'
                  }`}
                >
                  <ShoppingBag size={18} />
                  {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 rounded-[15px] flex items-center justify-center transition-all duration-300 border-2 ${
                    inWishlist
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-transparent border-[#1d2b30]/10 text-[#1d2b30] hover:border-[#1d2b30]/30'
                  }`}
                >
                  <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: 'Free Shipping' },
                  { icon: Shield, label: 'Secure Payment' },
                  { icon: RefreshCw, label: 'Easy Returns' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center p-4 rounded-xl bg-[#1d2b30]/5"
                  >
                    <feature.icon size={20} className="text-[#1d2b30]/40 mb-2" />
                    <span className="text-xs text-[#1d2b30]/60">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-16 border-t border-[#1d2b30]/10">
              <h2 className="font-display text-2xl md:text-3xl text-[#1d2b30] mb-8">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rp, i) => (
                  <div
                    key={rp.id}
                    className="[&_.text-white]:text-[#1d2b30] [&_.text-white\/80]:text-[#1d2b30]/80 [&_.text-white\/60]:text-[#1d2b30]/60 [&_.text-white\/40]:text-[#1d2b30]/40 [&_.bg-white\/5]:bg-[#1d2b30]/5 [&_.bg-white\/10]:bg-[#1d2b30]/10 [&_.border-white\/10]:border-[#1d2b30]/10 [&_.hover\:bg-white\/20]:hover:bg-[#1d2b30]/20 [&_.text-white\/20]:text-[#1d2b30]/20 [&_.hover\:text-white]:hover:text-[#1d2b30] [&_.from-black\/40]:from-[#1d2b30]/20"
                  >
                    <ProductCard product={rp} index={i} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-12 pt-8 border-t border-[#1d2b30]/10">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-[#1d2b30]/60 hover:text-[#1d2b30] transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Collections
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
