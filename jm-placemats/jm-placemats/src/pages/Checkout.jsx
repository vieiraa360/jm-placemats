import React, { useState, useEffect } from "react";
import { Order } from "@/api/entities";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Checkout() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    shipping_address: "",
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 8.95;
  const total = subtotal + shipping;

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => Order.create(orderData),
    onSuccess: (order) => {
      localStorage.removeItem("cart");
      setCart([]);
      setOrderPlaced(true);
      setOrderId(order.id);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      items: cart.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      shipping,
      total,
      status: "pending",
    };
    createOrderMutation.mutate(orderData);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#FEFDF8] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-[#9CAF88] flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-light text-stone-900 mb-4">Thank You!</h1>
          <p className="text-stone-600 mb-8">
            Your order has been placed successfully. We'll send you a confirmation email shortly.
          </p>
          <div className="bg-stone-100 rounded-2xl p-6 mb-8">
            <p className="text-sm text-stone-500 mb-1">Order Number</p>
            <p className="font-mono text-stone-900">#{orderId?.slice(0, 8).toUpperCase()}</p>
          </div>
          <Link to={createPageUrl("Home")}>
            <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8 py-6">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FEFDF8] flex items-center justify-center p-6">
        <div className="text-center">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-stone-900 mb-4">Your cart is empty</h1>
          <Link to={createPageUrl("Shop")}>
            <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8 py-6">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFDF8]">
      {/* Header */}
      <div className="border-b border-stone-200">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <Link to={createPageUrl("Shop")} className="inline-flex items-center text-stone-600 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-light text-stone-900 mb-8">Checkout</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-stone-700">Full Name</Label>
                <Input
                  id="name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                  className="rounded-xl py-6 border-stone-200 focus:border-[#9CAF88] focus:ring-[#9CAF88]"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  required
                  className="rounded-xl py-6 border-stone-200 focus:border-[#9CAF88] focus:ring-[#9CAF88]"
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-stone-700">Shipping Address</Label>
                <Textarea
                  id="address"
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  required
                  className="rounded-xl border-stone-200 focus:border-[#9CAF88] focus:ring-[#9CAF88] min-h-[120px]"
                  placeholder="123 Main Street, Apt 4&#10;New York, NY 10001"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={createOrderMutation.isPending}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full py-6 text-base"
                >
                  {createOrderMutation.isPending ? "Placing Order..." : `Place Order • £${total.toFixed(2)}`}
                </Button>
                <p className="text-xs text-stone-400 text-center mt-4">
                  This is a demo store. No payment will be processed.
                </p>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-stone-50 rounded-3xl p-8 sticky top-8">
              <h2 className="text-xl font-medium text-stone-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white">
                      <img
                        src={item.image_url || "/img/WhatsApp-Image-2021-10-14-at-01.48.15.jpeg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-stone-900 text-sm">{item.name}</h3>
                      <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-stone-900">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-medium">£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-stone-200">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}