import { useState, useEffect, useRef, memo } from "react";
import { Sprout, ShieldCheck, Truck, CreditCard, MessageCircle, RotateCcw, Award, X } from "lucide-react";

const infoItems = [
  {
    icon: ShieldCheck,
    title: "FSSAI Certified",
    desc: "Government-approved food safety certification. Every batch tested.",
    color: "145 40% 30%",
  },
  {
    icon: Truck,
    title: "Ships in 48 Hours",
    desc: "Pan-India delivery. Free shipping on orders above ₹299.",
    color: "200 50% 40%",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    desc: "COD available pan-India. Also UPI, credit/debit cards, net banking.",
    color: "260 40% 45%",
  },
  {
    icon: RotateCcw,
    title: "30-Day Guarantee",
    desc: "Full refund, no questions asked. Your satisfaction is our priority.",
    color: "38 55% 45%",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    desc: "Real humans, every day, all day. Instant help when you need it.",
    color: "142 55% 35%",
  },
  {
    icon: Award,
    title: "Zero Additives",
    desc: "No preservatives, no artificial ingredients. 100% stone-ground millet.",
    color: "20 60% 45%",
  },
];

const FloatingInfoButton = memo(() => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40" style={{ width: "48px", height: "80px" }}>
        {/* Oxygen bubbles container — positioned to rise from sprout */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "80px" }}>
          <div className="bubble bubble-1" />
          <div className="bubble bubble-2" />
          <div className="bubble bubble-3" />
          <div className="bubble bubble-4" />
          <div className="bubble bubble-5" />
        </div>
        
        <button
          onClick={() => setOpen(!open)}
          className="absolute bottom-0 left-0 w-12 h-12 rounded-full bg-[hsl(var(--liimra-forest))] text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group ring-2 ring-white ring-inset"
          aria-label="View certifications and support info"
        >
          <Sprout size={20} className="sprout-icon group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Chatbot-style floating popup */}
      {open && (
        <div 
          ref={popupRef}
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-[hsl(var(--liimra-border))] overflow-hidden">
            {/* Header */}
            <div className="bg-[hsl(var(--liimra-forest))] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sprout size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-wide">
                    Why Trust Liimra?
                  </h3>
                  <p className="font-body text-xs text-white/80">
                    Your questions answered
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 bg-[hsl(45_30%_98%)]">
              {infoItems.map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-3 p-3 rounded-xl border border-[hsl(var(--liimra-border))] bg-white shadow-sm hover:shadow-md transition-shadow animate-in slide-in-from-right duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `hsl(${item.color} / 0.12)` }}
                  >
                    <item.icon size={16} style={{ color: `hsl(${item.color})` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-semibold tracking-wide text-[hsl(var(--liimra-ink))]">
                      {item.title}
                    </h4>
                    <p className="font-body text-xs text-[hsl(var(--liimra-ink-light))] mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with CTA */}
            <div className="p-4 bg-white border-t border-[hsl(var(--liimra-border))]">
              <a
                href="https://wa.me/91XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[hsl(142_55%_35%)] text-white font-body text-xs tracking-[0.15em] uppercase hover:scale-[1.02] hover:shadow-lg transition-all"
              >
                <MessageCircle size={16} /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

FloatingInfoButton.displayName = "FloatingInfoButton";

export default FloatingInfoButton;
