import { useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navItems = ["Shop", "Bundles", "Our Millets", "Recipes", "About"];

interface HeaderProps {
  cartCount: number;
}

const Header = ({ cartCount }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[hsl(45_30%_95%/0.85)] border-b border-[hsl(var(--liimra-border))]">
      {/* Announcement bar */}
      <div className="bg-[hsl(var(--liimra-forest))] text-[hsl(45_30%_95%)] text-center py-1.5 font-body text-xs tracking-widest uppercase">
        Free shipping above ₹299 · COD Available · Ships in 48hrs
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
        {/* Logo */}
        <a href="#" className="font-display text-xl sm:text-2xl font-bold tracking-[0.15em] text-[hsl(var(--liimra-ink))]">
          LIIMRA
          <span className="block text-[8px] sm:text-[9px] tracking-[0.35em] font-body font-light -mt-1 text-[hsl(var(--liimra-ink-light))]">
            NATURALS
          </span>
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
          <button className="relative p-2 rounded-full hover:bg-[hsl(var(--liimra-sage-light)/0.5)] transition-colors">
            <ShoppingBag size={20} className="text-[hsl(var(--liimra-ink))]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[hsl(var(--liimra-terra))] text-white text-[10px] font-body font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 rounded-full hover:bg-[hsl(var(--liimra-sage-light)/0.5)] transition-colors">
                <Menu size={20} className="text-[hsl(var(--liimra-ink))]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[hsl(45_30%_95%)] border-l-[hsl(var(--liimra-border))] w-72">
              <SheetTitle className="font-display text-lg tracking-[0.15em] text-[hsl(var(--liimra-ink))]">LIIMRA NATURALS</SheetTitle>
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
};

export default Header;
