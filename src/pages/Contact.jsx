import React, { useState } from "react";
import { ContactInquiry } from "@/api/entities";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingBag, Send, CheckCircle, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => ContactInquiry.create(data),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error) => {
      console.error('Error submitting contact form:', error);
      alert('Failed to send message. Please try again or contact us directly.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

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
                        <Link to={createPageUrl("Contact")} className="text-stone-900 font-medium">
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
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
              Contact Us
            </h1>
            <p className="text-stone-500 max-w-md mx-auto">
              Get in touch for inquiries or business proposals. We'll get back to you!
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-12 shadow-sm border border-stone-100 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#9CAF88]/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-[#9CAF88]" />
                </div>
                <h2 className="text-2xl font-medium text-stone-900 mb-2">Thank You!</h2>
                <p className="text-stone-500 mb-6">
                  Your message has been sent. We'll get back to you soon!
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="rounded-full"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="rounded-xl border-stone-200 focus:border-[#9CAF88] focus:ring-[#9CAF88]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Email *
                    </label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="rounded-xl border-stone-200 focus:border-[#9CAF88] focus:ring-[#9CAF88]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      rows={5}
                      className="rounded-xl border-stone-200 focus:border-[#9CAF88] focus:ring-[#9CAF88]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full py-6 text-base"
                  >
                    {mutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid sm:grid-cols-2 gap-6"
            >
              <div className="bg-stone-50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#9CAF88]/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-5 h-5 text-[#9CAF88]" />
                </div>
                <h3 className="font-medium text-stone-900 mb-1">Email Us</h3>
                <p className="text-stone-500 text-sm">We'll respond within 24 hours</p>
              </div>
              <div className="bg-stone-50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#9CAF88]/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-5 h-5 text-[#9CAF88]" />
                </div>
                <h3 className="font-medium text-stone-900 mb-1">Custom Orders</h3>
                <p className="text-stone-500 text-sm">Inquire about custom designs</p>
              </div>
            </motion.div>
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