import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useFilters } from '../context/FilterContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Collections', path: '/collections' },
  { label: 'New Arrivals', path: '/collections?category=new-arrivals' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { searchQuery, setSearchQuery } = useFilters();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate('/collections');
        setSearchOpen(false);
      }
    },
    [searchQuery, navigate]
  );

  const isActive = useCallback(
    (path: string) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname === path || location.pathname.startsWith(path);
    },
    [location]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-header py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#fed286] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl md:text-2xl font-semibold tracking-wide text-white">
              KITH <span className="text-[#fed286]">&</span> KIN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-xs font-medium uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors ${
                  isActive(link.path) ? 'active text-white' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white/80 hover:text-[#fed286] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-white/80 hover:text-[#fed286] transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#fed286] text-[#1d2b30] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 text-white/80 hover:text-[#fed286] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#fed286] text-[#1d2b30] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              className="hidden md:flex p-2 text-white/80 hover:text-[#fed286] transition-colors"
              aria-label="Account"
            >
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={
            'overflow-hidden transition-all duration-400 ease-out ' +
            (searchOpen ? 'max-h-16 opacity-100 mt-4' : 'max-h-0 opacity-0')
          }
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#fed286]/50 focus:bg-white/15 transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-[#fed286] transition-colors"
            >
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={
          'fixed inset-0 bg-[#1d2b30]/98 backdrop-blur-xl z-40 transition-all duration-500 lg:hidden ' +
          (mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
        }
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {NAV_LINKS.map((navLink) => (
            <Link
              key={navLink.path}
              to={navLink.path}
              onClick={() => setMobileMenuOpen(false)}
              className={
                'font-display text-3xl md:text-4xl text-white/80 hover:text-[#fed286] transition-colors ' +
                (isActive(navLink.path) ? 'text-[#fed286]' : '')
              }
            >
              {navLink.label}
            </Link>
          ))}
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="font-display text-3xl md:text-4xl text-white/80 hover:text-[#fed286] transition-colors mt-8"
          >
            Wishlist ({wishlistCount})
          </Link>
        </div>
      </div>
    </header>
  );
}
