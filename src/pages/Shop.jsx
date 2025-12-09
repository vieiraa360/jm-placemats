import React, { useState, useEffect } from "react";
import { Product } from "@/api/entities";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ProductCard from "@/components/shop/ProductCard";
import CartDrawer from "@/components/shop/CartDrawer";

export default function Shop() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category") || "all";

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => Product.list(),
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { value: "all", label: "All Products" },
    { value: "placemat", label: "Placemats" },
    { value: "coaster", label: "Coasters" },
    { value: "set", label: "Sets" },
  ];

  return (
    <div className="min-h-screen bg-[#FEFDF8]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#FEFDF8]/90 backdrop-blur-md border-b border-stone-200/50">
        <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2 text-2xl font-light tracking-tight text-stone-900">
                            <img src="/img/cropped-cropped-logo-240.png" alt="JM Placemats" className="h-10 w-auto" />
                            <span><span className="font-medium">JM</span> Placemats</span>
                          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
                            <Link to={createPageUrl("About")} className="text-stone-600 hover:text-stone-900 transition-colors">
                              About Us
                            </Link>
                            <Link to={createPageUrl("Shop")} className="text-stone-900 font-medium">
                              Shop All
                            </Link>
                            <Link to={createPageUrl("Gallery")} className="text-stone-600 hover:text-stone-900 transition-colors">
                              Gallery
                            </Link>
                            <Link to={createPageUrl("Reviews")} className="text-stone-600 hover:text-stone-900 transition-colors">
                              Reviews
                            </Link>
                            <Link to={createPageUrl("Contact")} className="text-stone-600 hover:text-stone-900 transition-colors">
                              Contact
                            </Link>
                          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-stone-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9CAF88] text-white text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-light text-stone-900 mb-4"
            >
              {selectedCategory === "all"
                ? "All Products"
                : categories.find((c) => c.value === selectedCategory)?.label}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-stone-500 max-w-md mx-auto"
            >
              Thoughtfully designed pieces to transform your dining experience
            </motion.p>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 md:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-full"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${
                    selectedCategory === cat.value
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-stone-500">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden mb-6 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pb-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setShowFilters(false);
                      }}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        selectedCategory === cat.value
                          ? "bg-stone-900 text-white"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-stone-200 rounded-2xl mb-4" />
                  <div className="h-3 bg-stone-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-stone-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-stone-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-500">No products found in this category.</p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}