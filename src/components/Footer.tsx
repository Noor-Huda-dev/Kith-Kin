import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Twitter, Facebook, Youtube, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-[#fbf8ec] text-[#1d2b30]">
      {/* Newsletter Section */}
      <div className="w-full px-6 lg:px-10 py-16 border-b border-[#1d2b30]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-display text-3xl md:text-4xl mb-4">Join the Inner Circle</h3>
          <p className="text-[#1d2b30]/60 mb-8 max-w-md mx-auto">
            Be the first to discover new collections, exclusive offers, and stories from the world of Kith & Kin.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d2b30]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white border border-[#1d2b30]/10 rounded-[15px] pl-11 pr-4 py-3.5 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#1d2b30] text-white rounded-[15px] text-sm font-medium hover:bg-[#2a3f45] transition-colors flex items-center justify-center gap-2"
            >
              {subscribed ? 'Subscribed!' : 'Subscribe'}
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-semibold">
                KITH <span className="text-[#c9a55c]">&</span> KIN
              </span>
            </Link>
            <p className="text-sm text-[#1d2b30]/50 leading-relaxed mb-6">
              Curated essentials for those who appreciate the art of refined living.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#1d2b30]/5 flex items-center justify-center text-[#1d2b30]/50 hover:bg-[#1d2b30] hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-5">Shop</h4>
            <ul className="space-y-3">
              {['New Arrivals', 'Apparel', 'Accessories', 'Homeware', 'Sale'].map((item) => (
                <li key={item}>
                  <Link
                    to="/collections"
                    className="text-sm text-[#1d2b30]/60 hover:text-[#1d2b30] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-5">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Careers', 'Press', 'Sustainability', 'Affiliates'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[#1d2b30]/60 hover:text-[#1d2b30] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] mb-5">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Shipping & Returns', 'Size Guide', 'Contact Us', 'Privacy Policy'].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#1d2b30]/60 hover:text-[#1d2b30] transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full px-6 lg:px-10 py-6 border-t border-[#1d2b30]/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#1d2b30]/40">
            &copy; 2026 Kith & Kin. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Terms', 'Privacy', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-[#1d2b30]/40 hover:text-[#1d2b30] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
