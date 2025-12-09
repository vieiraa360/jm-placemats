import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100 mb-4">
        <img
          src={product.image_url || "/img/WhatsApp-Image-2021-10-14-at-01.48.15.jpeg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/10 flex items-end justify-center pb-6"
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-white text-stone-900 hover:bg-stone-100 rounded-full px-6 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </motion.div>
        {product.featured && (
          <span className="absolute top-4 left-4 bg-[#9CAF88] text-white text-xs font-medium px-3 py-1 rounded-full">
            Featured
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute top-4 right-4 bg-stone-800 text-white text-xs font-medium px-3 py-1 rounded-full">
            Sold Out
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs text-stone-500 uppercase tracking-wider">
          {product.material || product.category}
        </p>
        <h3 className="font-medium text-stone-900 text-lg">{product.name}</h3>
        <p className="text-stone-700 font-semibold">£{product.price?.toFixed(2)}</p>
      </div>
    </motion.div>
  );
}