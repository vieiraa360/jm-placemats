import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createPageUrl } from "@/utils";

export default function Navigation({ currentPage, cartCount, onCartClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: createPageUrl("About"), label: "About Us", page: "About" },
    { to: createPageUrl("Shop"), label: "Shop All", page: "Shop" },
    { to: createPageUrl("Gallery"), label: "Gallery", page: "Gallery" },
    { to: createPageUrl("Reviews"), label: "Reviews", page: "Reviews" },
    { to: createPageUrl("Contact"), label: "Contact", page: "Contact" },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#FEFDF8]/90 backdrop-blur-md border-b border-stone-200/50">
      <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link to={createPageUrl("Home")} className="flex items-center gap-2 text-2xl font-light tracking-tight text-stone-900">
          <img src="/img/logo.jpeg" alt="JM Placemats" className="h-10 w-auto" />
          <span><span className="font-medium">JM</span> Placemats</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.page}
              to={link.to}
              className={currentPage === link.page 
                ? "text-stone-900 font-medium" 
                : "text-stone-600 hover:text-stone-900 transition-colors"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: Mobile menu button + Cart */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-stone-700" />
          </button>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            className="relative p-2 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-5 h-5 text-stone-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9CAF88] text-white text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] bg-[#FEFDF8] p-0">
          <SheetHeader className="p-6 border-b border-stone-200">
            <SheetTitle className="flex items-center gap-2 text-2xl font-light tracking-tight text-stone-900">
              <img src="/img/logo.jpeg" alt="JM Placemats" className="h-10 w-auto" />
              <span><span className="font-medium">JM</span> Placemats</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col p-6">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={link.to}
                onClick={handleLinkClick}
                className={`py-3 text-base ${
                  currentPage === link.page
                    ? "text-stone-900 font-medium border-b border-stone-900"
                    : "text-stone-600 hover:text-stone-900 transition-colors"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

