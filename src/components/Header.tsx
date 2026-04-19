import { useState, memo } from "react";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import SearchOverlay from "@/components/SearchOverlay";

const navItems = ["Shop", "Bundles", "Recipes", "Why Liimra"];

const Header = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[hsl(45_30%_95%/0.85)] border-b border-[hsl(var(--liimra-border))]">
      {/* Announcement bar */}
      <div className="bg-[hsl(var(--liimra-forest))] text-[hsl(45_30%_95%)] text-center py-1.5 font-body text-xs tracking-widest uppercase">
        Free shipping · COD Available · Because healthy shouldn't cost more
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img 
            src="/liimra-logo.png" 
            alt="Liimra Naturals" 
            loading="eager"
            decoding="async"
            className="h-10 sm:h-12 w-auto"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item === "Shop";
            return (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className={`font-body text-[14px] px-4 py-2 transition-all duration-300 relative ${
                  isActive 
                    ? "text-[#27500A] font-bold after:absolute after:bottom-1.5 after:left-4 after:right-4 after:h-[1.5px] after:bg-[#27500A]" 
                    : "text-[#555] font-semibold hover:text-[#27500A]"
                }`}
              >
                {item}
              </a>
            );
          })}
        </nav>

        {/* Right: Search + CTA + Cart + Mobile Menu */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search" 
            className="hidden sm:flex p-[7px] rounded-full bg-[#eeeadd] hover:bg-[#e4dfcd] transition-colors text-[#2c2c1a]"
          >
            <Search size={16} strokeWidth={2.5} />
          </button>

          <button
            onClick={openCart}
            aria-label="Open Cart"
            className="relative p-[9px] rounded-md transition-transform hover:scale-105 flex items-center justify-center bg-[#325220] shadow-sm ml-1"
          >
            <ShoppingCart size={18} className="text-white" strokeWidth={2.5} />
            {cartCount > 0 && (
              <span
                className="absolute -top-[7px] -right-[7px] w-[18px] h-[18px] text-white text-[10px] font-body font-bold rounded-full flex items-center justify-center bg-[#ef4444] shadow-sm border-2 border-[hsl(45_30%_95%)]"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button aria-label="Toggle Menu" className="md:hidden p-3 rounded-full hover:bg-[hsl(var(--liimra-sage-light)/0.5)] transition-colors">
                <Menu size={20} className="text-[hsl(var(--liimra-ink))]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[hsl(45_30%_95%)] border-l-[hsl(var(--liimra-border))] w-72">
              <SheetTitle className="flex items-center">
                <img 
                  src="/liimra-logo.png" 
                  alt="Liimra Naturals" 
                  loading="eager"
                  decoding="async"
                  className="h-8 w-auto"
                />
              </SheetTitle>
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={() => setMobileOpen(false)}
                    className="font-body text-sm tracking-[0.1em] uppercase px-4 py-3 rounded-lg text-[hsl(var(--liimra-ink))] hover:bg-[hsl(var(--liimra-sage-light)/0.5)] transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
});

Header.displayName = "Header";

export default Header;
