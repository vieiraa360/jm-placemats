import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Package, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// Determine API URL based on environment
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const hostname = window.location.hostname;
  const isProduction = hostname === 'jm-placemats.com' || 
                      hostname === 'www.jm-placemats.com' ||
                      hostname.includes('jm-placemats.com');
  if (isProduction) {
    // Cloudflare Tunnel doesn't need port number
    return 'https://api.jm-placemats.com';
  }
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiUrl();

export default function PaymentSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.removeItem("cart");
    
    if (sessionId) {
      // Verify the session with the backend
      fetch(`${API_BASE_URL}/api/stripe/verify-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.order);
          } else {
            setError(data.message || 'Failed to verify payment');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error verifying session:', err);
          setError('Failed to verify payment session');
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('No session ID provided');
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFDF8] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl p-12 shadow-lg border border-stone-100 text-center"
        >
          <Loader2 className="w-12 h-12 text-stone-400 animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Verifying your payment...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FEFDF8] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl p-12 shadow-lg border border-stone-100 text-center"
        >
          <h1 className="text-2xl font-medium text-stone-900 mb-3">Verification Error</h1>
          <p className="text-stone-600 mb-8">{error}</p>
          <Link to={createPageUrl("Home")}>
            <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full py-6">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFDF8] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl p-12 shadow-lg border border-stone-100 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-medium text-stone-900 mb-3">
          Payment Successful!
        </h1>
        
        <p className="text-stone-600 mb-2">
          Thank you for your purchase from JM Placemats.
        </p>
        
        <p className="text-sm text-stone-500 mb-8">
          You'll receive a confirmation email shortly with your order details.
        </p>

        {order && (
          <div className="bg-stone-50 rounded-xl p-4 mb-8 text-left">
            <p className="text-sm text-stone-500 mb-1">Order Number</p>
            <p className="font-mono text-stone-900 text-lg">
              #{order.id.toString().slice(-8).toUpperCase()}
            </p>
            <p className="text-sm text-stone-600 mt-2">
              Total: £{order.total.toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 justify-center mb-8 text-sm text-stone-500">
          <Package className="w-4 h-4" />
          <span>Your order is being processed</span>
        </div>

        <Link to={createPageUrl("Home")}>
          <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full py-6">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}