import React from "react";
import { motion } from "framer-motion";
import { XCircle, ShoppingBag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-[#FEFDF8] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl p-12 shadow-lg border border-stone-100 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-amber-600" />
        </div>
        
        <h1 className="text-3xl font-medium text-stone-900 mb-3">
          Payment Cancelled
        </h1>
        
        <p className="text-stone-600 mb-8">
          Your payment was cancelled. Your cart items are still saved if you'd like to complete your purchase.
        </p>

        <div className="flex flex-col gap-3">
          <Link to={createPageUrl("Checkout")}>
            <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full py-6">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Return to Checkout
            </Button>
          </Link>
          
          <Link to={createPageUrl("Home")}>
            <Button variant="outline" className="w-full rounded-full py-6">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}