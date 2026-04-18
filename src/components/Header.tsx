import { useState, memo } from "react";
import { ShoppingBag, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";

const navItems = ["Shop", "Bundles", "Recipes", "Why Liimra"];

const Header = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[hsl(45_30%_95%/0.85)] border-b border-[hsl(var(--liimra-border))]">
      {/* Announcement bar */}
      <div className="bg-[hsl(var(--liimra-forest))] text-[hsl(45_30%_95%)] text-center py-1.5 font-body text-xs tracking-widest uppercase">
        Free shipping above ₹299 · COD Available · Because healthy shouldn't cost more
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
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="font-body text-xs tracking-[0.12em] uppercase px-4 py-2 rounded-full text-[hsl(var(--liimra-ink-light))] hover:bg-[hsl(var(--liimra-sage-light)/0.5)] hover:text-[hsl(var(--liimra-forest))] transition-all duration-300"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right: Cart + Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label="Open Cart"
            className="relative p-3 rounded-full hover:bg-[hsl(var(--liimra-sage-light)/0.5)] transition-colors"
          >
            <ShoppingBag size={20} className="text-[hsl(var(--liimra-ink))]" />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-white text-[10px] font-body font-bold rounded-full flex items-center justify-center"
                style={{ background: "#aeb30a", color: "#3e4c1d" }}
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
    </header>
  );
});

Header.displayName = "Header";

export default Header;
