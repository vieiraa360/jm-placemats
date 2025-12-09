import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Globe, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function About() {
  const features = [
    { icon: Heart, title: "Handcrafted", desc: "Every piece made with love and care" },
    { icon: Globe, title: "Global Reach", desc: "Crossed borders and gone beyond boundaries" },
    { icon: Award, title: "Premium Quality", desc: "Authentic premium quality handmade beads" },
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
                        <Link to={createPageUrl("About")} className="text-stone-900 font-medium">
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
          <Link to={createPageUrl("Shop")} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5 text-stone-700" />
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-[#9CAF88] font-medium tracking-widest text-sm uppercase mb-2">
              Our Story
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
              About Us
            </h1>
            <p className="text-stone-500 max-w-md mx-auto">
              Crafting elegance for your dining table since 2020
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-medium text-stone-900 mb-4">Why Choose Us?</h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  Founded in 2020, JM Placemats has rapidly become a trusted global source for premium, handmade beadwork. We specialize in authentic placemats, coasters, and centerpieces, meticulously crafted to elevate any dining experience.
                </p>
                <p>
                  Every piece in our collection is carefully selected for its quality and artistry. From our diverse standard offerings to our beautiful custom-made designs, we ensure our products bring a unique, smiling elegance to your home décor.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src="/img/white-pink-3.jpeg"
                  alt="JM Placemats in action"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#9CAF88] text-white p-6 rounded-2xl shadow-lg">
                <p className="text-3xl font-bold">2020</p>
                <p className="text-sm opacity-90">Founded</p>
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#9CAF88]/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-[#9CAF88]" />
                </div>
                <h3 className="font-medium text-stone-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-stone-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-2xl font-light tracking-tight text-stone-900 mb-4">
            <span className="font-medium">JM</span> Placemats
          </p>
          <p className="text-sm text-stone-500">
            © 2024 JM Placemats. Crafted with care.
          </p>
        </div>
      </footer>
    </div>
  );
}