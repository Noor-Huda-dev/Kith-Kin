import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, Shield, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (items.length === 0 && step !== 'success') {
      // Allow viewing empty checkout but show message
    }
  }, [items, step]);

  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      clearCart();
      window.scrollTo(0, 0);
    }, 2000);
  };

  const isShippingValid =
    formData.email && formData.firstName && formData.lastName && formData.address && formData.city;

  const isPaymentValid = formData.cardNumber && formData.cardName && formData.expiry && formData.cvv;

  if (items.length === 0 && step !== 'success') {
    return (
      <main className="w-full min-h-screen pt-24 pb-12 section-cream">
        <div className="w-full px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#1d2b30]/5 flex items-center justify-center mx-auto mb-6">
              <Truck size={32} className="text-[#1d2b30]/20" />
            </div>
            <h2 className="font-display text-2xl text-[#1d2b30] mb-3">Your cart is empty</h2>
            <p className="text-[#1d2b30]/50 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link to="/collections" className="btn-primary bg-[#1d2b30] text-white hover:bg-[#2a3f45]">
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (step === 'success') {
    return (
      <main className="w-full min-h-screen pt-24 pb-12 section-cream">
        <div className="w-full px-6 lg:px-10">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <Check size={36} className="text-green-500" />
            </div>
            <h1 className="font-display text-4xl text-[#1d2b30] mb-4">Order Confirmed</h1>
            <p className="text-[#1d2b30]/60 mb-2">
              Thank you for your purchase! Your order has been successfully placed.
            </p>
            <p className="text-sm text-[#1d2b30]/40 mb-10">
              Order #KK-{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <div className="bg-white rounded-2xl p-8 border border-[#1d2b30]/5 mb-8 text-left">
              <h3 className="font-medium text-[#1d2b30] mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#1d2b30]/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1d2b30]/60">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[#1d2b30]/60">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1d2b30] font-semibold pt-3 border-t border-[#1d2b30]/10">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/collections" className="btn-primary bg-[#1d2b30] text-white hover:bg-[#2a3f45]">
                Continue Shopping
              </Link>
              <Link to="/" className="btn-outline border-[#1d2b30]/20 text-[#1d2b30] hover:bg-[#1d2b30] hover:text-white">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen pt-20 pb-12 section-cream">
      <div className="w-full px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-[#1d2b30]/60 hover:text-[#1d2b30] transition-colors mb-8"
          >
            <ChevronLeft size={16} />
            Back to Cart
          </button>

          <h1 className="font-display text-3xl md:text-4xl text-[#1d2b30] mb-2">Checkout</h1>
          <p className="text-[#1d2b30]/50 mb-10">Complete your purchase securely</p>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-12">
            <div
              className={`flex items-center gap-2 ${
                step === 'shipping' ? 'text-[#1d2b30]' : 'text-[#1d2b30]/40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'shipping'
                    ? 'bg-[#1d2b30] text-white'
                    : 'bg-[#1d2b30]/10 text-[#1d2b30]'
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium hidden sm:inline">Shipping</span>
            </div>
            <div className="flex-1 h-px bg-[#1d2b30]/10" />
            <div
              className={`flex items-center gap-2 ${
                step === 'payment' ? 'text-[#1d2b30]' : 'text-[#1d2b30]/40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'payment'
                    ? 'bg-[#1d2b30] text-white'
                    : 'bg-[#1d2b30]/10 text-[#1d2b30]'
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Main Form */}
            <div className="lg:col-span-3">
              {step === 'shipping' ? (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#1d2b30]/5">
                    <h2 className="font-display text-xl text-[#1d2b30] mb-6 flex items-center gap-2">
                      <Truck size={20} />
                      Shipping Information
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                            placeholder="Doe"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                            placeholder="New York"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                            placeholder="10001"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                            Country
                          </label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                            <option>Germany</option>
                            <option>France</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isShippingValid}
                    className="w-full py-4 bg-[#1d2b30] text-white rounded-[15px] font-medium text-sm uppercase tracking-wider hover:bg-[#2a3f45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#1d2b30]/5">
                    <h2 className="font-display text-xl text-[#1d2b30] mb-6 flex items-center gap-2">
                      <CreditCard size={20} />
                      Payment Details
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          maxLength={19}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                          placeholder="John Doe"
                          className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            required
                            maxLength={5}
                            placeholder="MM/YY"
                            className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium uppercase tracking-wider text-[#1d2b30]/40 mb-2 block">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            maxLength={4}
                            placeholder="123"
                            className="w-full bg-[#1d2b30]/5 border border-[#1d2b30]/10 rounded-xl px-4 py-3 text-sm text-[#1d2b30] placeholder-[#1d2b30]/30 focus:outline-none focus:border-[#1d2b30]/30 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="px-6 py-4 border border-[#1d2b30]/10 text-[#1d2b30] rounded-[15px] text-sm font-medium hover:bg-[#1d2b30]/5 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!isPaymentValid || isProcessing}
                      className="flex-1 py-4 bg-[#1d2b30] text-white rounded-[15px] font-medium text-sm uppercase tracking-wider hover:bg-[#2a3f45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield size={16} />
                          Pay ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 border border-[#1d2b30]/5 sticky top-24">
                <h3 className="font-display text-lg text-[#1d2b30] mb-6">Order Summary</h3>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto scrollbar-hide">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1d2b30]/5 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1d2b30] truncate">{item.title}</p>
                        <p className="text-xs text-[#1d2b30]/40">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-[#1d2b30]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-6 border-t border-[#1d2b30]/10">
                  <div className="flex justify-between text-sm text-[#1d2b30]/60">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#1d2b30]/60">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#1d2b30]/60">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-[#1d2b30] pt-3 border-t border-[#1d2b30]/10">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security */}
                <div className="mt-6 flex items-center gap-2 text-xs text-[#1d2b30]/40">
                  <Shield size={14} />
                  <span>Secure checkout powered by SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
