import React, { useState, useEffect } from "react";
import { Product } from "@/api/entities";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Leaf, Truck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import HeroSection from "@/components/shop/HeroSection";
import ProductCard from "@/components/shop/ProductCard";
import CartDrawer from "@/components/shop/CartDrawer";

export default function Home() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => Product.list(),
  });

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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

  const features = [
    { icon: Leaf, title: "Natural Materials", desc: "Sustainably sourced, eco-friendly" },
    { icon: Truck, title: "Free Shipping", desc: "On orders over $75" },
    { icon: Heart, title: "Handcrafted", desc: "Made with love and care" },
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
                            <Link to={createPageUrl("Shop")} className="text-stone-600 hover:text-stone-900 transition-colors">
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

      <div className="pt-16">
        <HeroSection />

        {/* Features */}
        <section className="py-16 bg-stone-50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-6"
                >
                  <div className="w-12 h-12 rounded-full bg-[#9CAF88]/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-[#9CAF88]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900">{feature.title}</h3>
                    <p className="text-sm text-stone-500">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[#9CAF88] font-medium tracking-widest text-sm uppercase mb-2">
                  Curated Selection
                </p>
                <h2 className="text-3xl md:text-4xl font-light text-stone-900">
                  Featured Pieces
                </h2>
              </div>
              <Link to={createPageUrl("Shop")}>
                <Button variant="ghost" className="text-stone-600 hover:text-stone-900">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-stone-900 text-white">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-[#9CAF88] font-medium tracking-widest text-sm uppercase mb-2">
                Browse by Category
              </p>
              <h2 className="text-3xl md:text-4xl font-light">Shop Our Collections</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Placemats", category: "placemat", image: "/img/WhatsApp-Image-2021-10-14-at-01.48.15.jpeg" },
                { name: "Coasters", category: "coaster", image: "/img/white-pink-5.jpeg" },
                { name: "Complete Sets", category: "set", image: "/img/WhatsApp-Image-2021-06-09-at-12.38.43.jpeg" },
              ].map((cat, index) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={createPageUrl("Shop") + `?category=${cat.category}`}>
                    <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-2xl font-medium mb-2">{cat.name}</h3>
                        <span className="text-sm text-white/80 flex items-center">
                          Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 border-t border-stone-200">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-2xl font-light tracking-tight text-stone-900">
                  <span className="font-medium">JM</span> Placemats
                </p>
              <p className="text-sm text-stone-500">
                © 2020 JM Placemats. Crafted with care.
              </p>
            </div>
          </div>
        </footer>
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