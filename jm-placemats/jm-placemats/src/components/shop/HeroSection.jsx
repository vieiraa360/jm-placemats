import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-[#FEFDF8] overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full"
        >
          <img
            src="/img/Black-draughts-3.jpeg"
            alt="Elegant table setting"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#9CAF88] font-medium tracking-widest text-sm uppercase mb-6"
          >
            Handcrafted Table Essentials
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-stone-900 leading-[1.1] mb-6"
          >
            Elevate Every
            <span className="block font-medium">Dining Moment</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-stone-600 text-lg mb-8 max-w-md"
          >
            Discover our curated collection of premium placemats and coasters, 
            crafted to bring warmth and elegance to your table.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link to={createPageUrl("Shop")}>
              <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8 py-6 text-base">
                Shop Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("Shop") + "?category=set"}>
              <Button variant="outline" className="rounded-full px-8 py-6 text-base border-stone-300">
                View Sets
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 lg:left-12 flex gap-12 text-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-3xl font-light text-stone-900">100%</p>
          <p className="text-stone-500">Natural Materials</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-3xl font-light text-stone-900">Free</p>
          <p className="text-stone-500">Shipping over $75</p>
        </motion.div>
      </div>
    </section>
  );
}