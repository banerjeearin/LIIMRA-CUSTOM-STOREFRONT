import { useState, useEffect, useRef, memo } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = memo(({ isOpen, onClose }: SearchOverlayProps) => {
  const { products, setSelectedProductId } = useProducts();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResults = query.trim() === "" 
    ? [] 
    : products.filter(p => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.displayName && p.displayName.toLowerCase().includes(q)) ||
          p.primaryTags?.some(tag => tag.toLowerCase().includes(q)) ||
          p.primaryBenefit?.toLowerCase().includes(q)
        );
      });

  return (
    <div className="absolute top-[100%] right-0 mt-2 w-screen sm:w-[500px] max-w-[calc(100vw-2rem)] mr-4 sm:mr-6 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
      <div className="w-full bg-white shadow-[0_10px_40px_rgb(0,0,0,0.12)] rounded-[20px] flex flex-col overflow-hidden max-h-[70vh] border border-[#e8e3d0]">
        
        {/* Input Area */}
        <div className="relative border-b border-[#f0ebd8] flex-shrink-0 bg-white">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#aeb30a]" strokeWidth={2.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search millets, benefits..."
            className="w-full bg-transparent text-[#2c2c1a] font-display text-lg py-4 pl-[3.5rem] pr-12 focus:outline-none placeholder:text-[#ccc]"
          />
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-[#f4f1e1] transition-colors"
          >
            <X size={18} className="text-[#888]" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#faf9f5]">
          {query.trim() === "" && (
            <div className="py-6 px-4">
              <p className="font-body text-[10px] font-bold text-[#888] uppercase tracking-widest mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Ragi", "High Calcium", "Diabetes Friendly", "Kutki", "Gluten-Free"].map(term => (
                  <button 
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="px-4 py-2 bg-white border border-[#e8e3d0] rounded-full font-body text-sm text-[#555] shadow-sm hover:border-[#aeb30a] hover:text-[#3e4c1d] transition-all hover:-translate-y-0.5"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() !== "" && searchResults.length === 0 && (
            <div className="text-center py-16">
              <p className="font-display text-2xl text-[#3e4c1d] mb-2">No results found for "{query}"</p>
              <p className="font-body text-[#777]">Try searching for generic terms like "flour" or "protein".</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-body text-[10px] font-bold text-[#888] uppercase tracking-widest pl-4 mb-1 pt-2">Products</p>
              {searchResults.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => {
                    setSelectedProductId(product.id);
                    onClose();
                  }}
                  className="group flex items-center gap-4 bg-white p-3 pr-5 rounded-[16px] cursor-pointer hover:shadow-md transition-all duration-300 border border-transparent hover:border-[#c5e88a]"
                >
                  <div 
                    className="w-[4.5rem] h-[4.5rem] rounded-[12px] flex items-center justify-center flex-shrink-0"
                    style={{ background: product.imageBg || "linear-gradient(160deg, hsl(74 30% 26%), hsl(74 35% 18%))" }}
                  >
                    <div className="w-12 h-12 rounded-[8px] opacity-70 bg-[#e8e3d0] relative overflow-hidden">
                      <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-1 mix-blend-multiply" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-[17px] font-bold text-[#27500A] leading-tight mb-1 group-hover:text-[#aeb30a] transition-colors">{product.name}</h3>
                    <p className="font-body text-[11px] text-[#666] font-medium">{product.primaryTags?.join(' · ') || product.primaryBenefit}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-body text-[15px] font-bold text-[#2c2c1a]">₹{product.sizes[0]?.price}</span>
                    <div className="w-8 h-8 rounded-full bg-[#f4f1e1] flex items-center justify-center text-[#3e4c1d] group-hover:bg-[#3e4c1d] group-hover:text-white transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SearchOverlay.displayName = "SearchOverlay";
export default SearchOverlay;
