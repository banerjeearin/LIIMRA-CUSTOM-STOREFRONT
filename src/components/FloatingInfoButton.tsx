import { useState } from "react";
import { Info, ShieldCheck, Truck, CreditCard, MessageCircle, RotateCcw, Award } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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

const FloatingInfoButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[hsl(var(--liimra-forest))] text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        aria-label="View certifications and support info"
      >
        <Info size={20} className="group-hover:rotate-12 transition-transform" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="bg-[hsl(45_30%_95%)] border-t-[hsl(var(--liimra-border))] max-h-[80vh] rounded-t-3xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="font-display text-2xl tracking-wide text-[hsl(var(--liimra-ink))]">
              Why Trust Liimra?
            </SheetTitle>
            <SheetDescription className="font-body text-xs tracking-[0.1em] uppercase text-[hsl(var(--liimra-ink-light))]">
              Certifications, guarantees & support — all in one place
            </SheetDescription>
          </SheetHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-6 overflow-y-auto">
            {infoItems.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-4 rounded-2xl border border-[hsl(var(--liimra-border))] bg-white/50 backdrop-blur-sm"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${item.color} / 0.12)` }}
                >
                  <item.icon size={18} style={{ color: `hsl(${item.color})` }} />
                </div>
                <div>
                  <h4 className="font-body text-sm font-semibold tracking-wide text-[hsl(var(--liimra-ink))]">{item.title}</h4>
                  <p className="font-body text-xs text-[hsl(var(--liimra-ink-light))] mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="border-t border-[hsl(var(--liimra-border))] pt-4 pb-2">
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[hsl(142_55%_35%)] text-white font-body text-xs tracking-[0.15em] uppercase hover:scale-[1.02] transition-transform"
            >
              <MessageCircle size={16} /> Ask on WhatsApp
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FloatingInfoButton;
