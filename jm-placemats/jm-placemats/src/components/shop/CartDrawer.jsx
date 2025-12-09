import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeFromCart }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 8.95;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FEFDF8] z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <h2 className="text-xl font-semibold text-stone-900">Your Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
                  <p className="text-stone-600 mb-2">Your cart is empty</p>
                  <p className="text-sm text-stone-400">Add some beautiful pieces to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                        <img
                          src={item.image_url || "/img/WhatsApp-Image-2021-10-14-at-01.48.15.jpeg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-stone-900">{item.name}</h3>
                        <p className="text-sm text-stone-500">£{item.price?.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-stone-100 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-stone-100 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-xs text-stone-400 hover:text-stone-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-stone-200 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Subtotal</span>
                    <span className="font-medium">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 75 && (
                    <p className="text-xs text-[#9CAF88]">
                      Add £{(75 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
                <Link to={createPageUrl("Checkout")} onClick={onClose}>
                  <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full py-6 text-base">
                    Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}