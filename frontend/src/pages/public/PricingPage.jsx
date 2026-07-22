import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user, activeProperty } = useAuth();
  const { addToast } = useToast();

  const handleUpgrade = async (planTier, amount) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    
    const targetProp = activeProperty || user.property || 'Unassigned';
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    
    try {
      const orderRes = await fetch(`${API_URL}/api/payments/create-order?amount=${amount}&property=${encodeURIComponent(targetProp)}`, { method: 'POST' });
      const order = await orderRes.json();
      
      const options = {
        key: order.key_id || "rzp_test_placeholder",
        amount: order.amount * 100,
        currency: order.currency,
        name: "SentiNaut",
        description: `${planTier.charAt(0).toUpperCase() + planTier.slice(1)} Plan Upgrade`,
        order_id: order.order_id,
        handler: async function (response) {
          const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              property: targetProp,
              plan: planTier,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          if (verifyRes.ok) {
            addToast(`Successfully upgraded to ${planTier} plan!`, "success");
            navigate('/dashboard');
          } else {
            const errData = await verifyRes.json();
            addToast(`Payment verification failed: ${errData.detail || 'Unknown error'}`, "error");
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#0f172a" }
      };
      
      if (window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        addToast("Payment gateway could not be loaded. Check your connection.", "error");
      }
    } catch (err) {
      addToast("Failed to initialize payment.", "error");
    }
  };

  React.useEffect(() => {
    document.title = "SentiNaut";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-slate-200 dark:selection:bg-slate-800 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-32">
        <div className="px-6 sm:px-8 lg:px-16 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-6">Pricing Plans</h2>
            <p className="text-slate-500 font-light text-lg">Simple, transparent, and built for scale.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y md:border-x border-slate-200 dark:border-slate-800 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950">
            <div className="p-12 sm:p-16 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex flex-col h-full">
              <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-2">Boutique</h3>
              <p className="text-sm text-slate-500 mb-8 font-light flex-grow">Perfect for single locations testing SentiNaut.</p>
              <p className="text-5xl font-serif text-slate-900 dark:text-white mb-8">₹24,999<span className="text-lg font-light text-slate-500">/mo</span></p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 mb-8 space-y-3 text-left">
                <li className="flex gap-2">✓ Up to 1,000 AI reviews/mo</li>
                <li className="flex gap-2">✓ Real-time staff notifications</li>
                <li className="flex gap-2">✓ Basic analytics dashboard</li>
                <li className="flex gap-2 text-slate-400 dark:text-slate-500 opacity-50">✗ Competitor benchmarking locked</li>
              </ul>
              <button onClick={() => handleUpgrade('boutique', 24999)} className="w-full px-6 py-3 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors mt-auto">Select</button>
            </div>
            
            <div className="p-12 sm:p-16 text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 relative flex flex-col h-full">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest uppercase opacity-70">Popular</div>
              <h3 className="font-serif text-2xl mb-2 mt-4">Resort</h3>
              <p className="text-sm opacity-70 mb-8 font-light flex-grow">For multi-manager hotels tracking competitors.</p>
              <p className="text-5xl font-serif mb-8">₹49,999<span className="text-lg font-light opacity-70">/mo</span></p>
              <ul className="text-sm opacity-90 mb-8 space-y-3 text-left">
                <li className="flex gap-2">✓ Unlimited AI review processing</li>
                <li className="flex gap-2">✓ Unlimited manager accounts</li>
                <li className="flex gap-2">✓ Full competitor benchmarking</li>
                <li className="flex gap-2">✓ Priority SLA support</li>
              </ul>
              <button onClick={() => handleUpgrade('resort', 49999)} className="w-full px-6 py-3 border border-white dark:border-slate-900 text-white dark:text-slate-900 text-sm uppercase tracking-widest hover:bg-white hover:text-black dark:hover:bg-slate-900 dark:hover:text-white transition-colors mt-auto">Select</button>
            </div>

            <div className="p-12 sm:p-16 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex flex-col h-full">
              <h3 className="font-serif text-2xl text-slate-900 dark:text-white mb-2">Enterprise</h3>
              <p className="text-sm text-slate-500 mb-8 font-light flex-grow">Custom SLAs for large hotel chains.</p>
              <p className="text-5xl font-serif text-slate-900 dark:text-white mb-8">POA</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 mb-8 space-y-3 text-left">
                <li className="flex gap-2">✓ Everything in Resort</li>
                <li className="flex gap-2">✓ Custom PMS integration</li>
                <li className="flex gap-2">✓ On-premise deployment options</li>
                <li className="flex gap-2">✓ Dedicated account manager</li>
              </ul>
              <button onClick={() => navigate('/about#contact')} className="w-full px-6 py-3 border border-slate-900 dark:border-white text-slate-900 dark:text-white text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors mt-auto">Contact</button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
