import { useState, memo } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const OLIVE = "#3e4c1d";
const NEON = "#aeb30a";

const faqs = [
  {
    q: "Will my family actually eat this?",
    a: "Millet rotis are soft, nutty, and delicious when made right. We include recipe guides + WhatsApp support.",
  },
  {
    q: "Where should I start?",
    a: "Ragi for kids. Jowar for diabetes. Sugar Control Trio to try a few. All are nutritious and freshly ground.",
  },
  {
    q: "Why more expensive than regular atta?",
    a: "Ground fresh when you order. Direct from farmers. No preservatives. ₹10 per roti — less than chai, better for your body.",
  },
  {
    q: "Is it really freshly ground?",
    a: "Within 48 hours of your order. Not months in a warehouse. Open the bag — you'll smell the difference.",
  },
  {
    q: "Safe for diabetics?",
    a: "Low glycaemic index. Recommended by dietitians. Customers report 15-20% HbA1c improvement in 3 months. Consult your doctor.",
  },
  {
    q: "What if we don't like it?",
    a: "We strive for 100% satisfaction. Please check our Refund & Exchange Policy at the bottom of the page. WhatsApp us anytime.",
  },
  {
    q: "Can children eat these?",
    a: "Yes! Ragi is especially recommended for kids. High calcium for bones. Traditional weaning food for generations.",
  },
  {
    q: "COD available?",
    a: "Yes, pan-India. Pay when delivered. We also accept UPI, cards, and net banking.",
  },
];

const FAQSection = memo(() => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className="scroll-reveal"
      style={{ background: "hsl(72 18% 91%)", padding: "96px 0" }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10">
          <SectionHeader
            eyebrow="FAQ"
            title={<>Quick <em className="not-italic" style={{ color: OLIVE }}>answers</em></>}
            centered
            typewriter
          />
        </div>

        <div className="flex flex-col" style={{ borderTop: "1px solid hsl(var(--liimra-border))" }}>
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={faq.q} style={{ borderBottom: "1px solid hsl(var(--liimra-border))" }}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  style={{ willChange: isOpen ? "auto" : "auto" }}
                >
                  <span
                    className="font-body text-sm font-semibold leading-snug transition-colors"
                    style={{ color: isOpen ? OLIVE : "hsl(var(--liimra-ink))" }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
                    style={
                      isOpen
                        ? { background: NEON, border: `1px solid ${NEON}` }
                        : { border: "1px solid hsl(var(--liimra-border))" }
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 fill-none stroke-2 transition-transform duration-200"
                      style={{
                        stroke: isOpen ? OLIVE : "hsl(var(--liimra-ink-light))",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-5 pr-12 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--liimra-ink-light))" }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FAQSection.displayName = "FAQSection";

export default FAQSection;
