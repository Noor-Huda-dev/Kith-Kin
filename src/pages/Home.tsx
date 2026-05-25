import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Truck, RefreshCw } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { ProductSkeletonGrid, ErrorState } from '../components/LoadingStates';

function FeaturedSection() {
  const { products, loading, error, refetch } = useProducts();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const featuredProducts = useMemo(() => {
    if (!products.length) return [];
    return [...products]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, [products]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="w-full section-cream py-20 md:py-28"
    >
      <div className="w-full px-6 lg:px-10">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#1d2b30]/40 mb-3">
              Curated For You
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1d2b30] leading-tight">
              The Art
              <br />
              <span className="text-[#c9a55c]">Of Living</span>
            </h2>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1d2b30] hover:text-[#c9a55c] transition-colors group"
          >
            View All Collections
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="[&_.animate-pulse_div]:bg-[#1d2b30]/10">
            <ProductSkeletonGrid count={8} />
          </div>
        ) : error ? (
          <div className="[&_h3]:text-[#1d2b30] [&_p]:text-[#1d2b30]/50">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {featuredProducts.map((product, i) => (
              <div key={product.id} className="[&_.text-white]:text-[#1d2b30] [&_.text-white\/80]:text-[#1d2b30]/80 [&_.text-white\/60]:text-[#1d2b30]/60 [&_.text-white\/40]:text-[#1d2b30]/40 [&_.bg-white\/5]:bg-[#1d2b30]/5 [&_.bg-white\/10]:bg-[#1d2b30]/10 [&_.border-white\/10]:border-[#1d2b30]/10 [&_.hover\:bg-white\/20]:hover:bg-[#1d2b30]/20 [&_.text-white\/20]:text-[#1d2b30]/20 [&_.hover\:text-white]:hover:text-[#1d2b30] [&_.from-black\/40]:from-[#1d2b30]/20">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary delivery on all orders over $150',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '256-bit SSL encryption for your protection',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy',
    },
    {
      icon: TrendingUp,
      title: 'Quality Guarantee',
      description: 'Every item meets our premium standards',
    },
  ];

  return (
    <section ref={sectionRef} className="w-full bg-[#1d2b30] py-20 md:py-28">
      <div className="w-full px-6 lg:px-10">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              className="text-center group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#fed286]/10 group-hover:border-[#fed286]/30 transition-all">
                <feature.icon size={24} className="text-[#fed286]" />
              </div>
              <h3 className="font-display text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full section-cream py-20 md:py-28">
      <div className="w-full px-6 lg:px-10">
        <div
          className={`relative overflow-hidden rounded-[30px] bg-[#1d2b30] p-12 md:p-20 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#fed286]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#fed286]/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#fed286] mb-4">
              Limited Time
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              The Spring Edit
            </h2>
            <p className="text-white/60 mb-10 leading-relaxed">
              Discover our carefully curated selection of seasonal essentials, designed to elevate your everyday experience with timeless elegance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/collections" className="btn-primary px-8 py-4">
                Shop the Collection
              </Link>
              <Link to="/collections?sale=true" className="btn-outline border-white/20 text-white hover:bg-[#fed286] hover:text-[#1d2b30] hover:border-[#fed286]">
                View Sale Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <FeaturedSection />
      <FeaturesSection />
      <CtaSection />
    </main>
  );
}
