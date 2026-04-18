import { useState, useEffect, memo } from "react";
import { X, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productAPI } from "@/services/api/productService";
import type { PolicyType } from "@/services/api/types";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: PolicyType;
}

const getPolicyTitle = (type: PolicyType) => {
  switch (type) {
    case "refundPolicy": return "Refund & Exchange Policy";
    case "privacyPolicy": return "Privacy Policy";
    case "termsOfService": return "Terms of Service";
    case "shippingPolicy": return "Shipping Policy";
    default: return "Store Policy";
  }
};

const PolicyModal = memo(({ isOpen, onClose, policyType }: PolicyModalProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setAnimate(false), 300);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const { data: policy, isLoading, error } = useQuery({
    queryKey: ["policy", policyType],
    queryFn: () => productAPI.getPolicy(policyType),
    enabled: isOpen,
    staleTime: 60 * 60 * 1000, // Cache policies for 1 hour
  });

  if (!isOpen && !animate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Modal Window */}
      <div 
        className="relative bg-[#faf9f6] w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300 transform border border-white/20"
        style={{ 
          opacity: isOpen ? 1 : 0, 
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)'
        }}
      >
        {/* Header */}
        <div className="bg-[#2d3815] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-[#aeb30a]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl tracking-wide">{getPolicyTitle(policyType)}</h2>
              <p className="font-body text-xs text-white/70">Liimra Naturals</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 font-body text-[hsl(0_0%_15%)] custom-scrollbar">
          {isLoading ? (
            <div className="h-40 flex flex-col items-center justify-center text-black/40 gap-4">
              <div className="w-8 h-8 rounded-full border-4 border-[#aeb30a] border-t-transparent animate-spin" />
              <p className="text-sm tracking-wide">Retrieving official policy...</p>
            </div>
          ) : error || !policy ? (
            <div className="h-40 flex flex-col items-center justify-center text-red-500/80 gap-2">
              <p>Failed to load the policy document.</p>
              <button onClick={() => window.location.reload()} className="text-sm underline">Please try refreshing</button>
            </div>
          ) : (
            <div 
              className="prose prose-sm sm:prose-base prose-headings:font-display prose-headings:font-bold prose-headings:text-[#2d3815] prose-p:leading-relaxed prose-a:text-[#2d3815] prose-a:font-semibold max-w-none"
              // Inject raw HTML provided by Shopify Backend effortlessly
              dangerouslySetInnerHTML={{ __html: policy.body }}
            />
          )}
        </div>
      </div>
    </div>
  );
});

PolicyModal.displayName = "PolicyModal";
export default PolicyModal;
