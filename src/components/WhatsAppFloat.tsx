import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const phoneNumber = "919321731372"; // Replace with actual Liimra WhatsApp number
  const message = "Hi Liimra Naturals, I have a question about your millets.";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
      {/* Tooltip Nudge */}
      <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-[#e8e3d0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform origin-bottom-right group-hover:scale-100 scale-95 relative">
        <p className="font-body text-sm text-[#2c2c1a] font-medium whitespace-nowrap">
          Ask us anything 👋
        </p>
        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-[#e8e3d0] transform rotate-45"></div>
      </div>

      {/* Button */}
      <a 
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.5)] transition-all duration-300 hover:-translate-y-1"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} strokeWidth={2} />
      </a>
    </div>
  );
};

export default WhatsAppFloat;
