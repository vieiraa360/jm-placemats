import React from "react";
import { Testimonial } from "@/api/entities";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Reviews() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => Testimonial.filter({ published: true }),
  });

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : 5;

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
                        <Link to={createPageUrl("Reviews")} className="text-stone-900 font-medium">
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
              Customer Love
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
              What Our Customers Say
            </h1>
            <p className="text-stone-500 max-w-md mx-auto mb-8">
              Real reviews from real customers who love our handcrafted placemats
            </p>
            
            {/* Rating Summary */}
            <div className="inline-flex items-center gap-3 bg-stone-50 px-6 py-3 rounded-full">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-xl font-semibold text-stone-900">{averageRating}</span>
              <span className="text-stone-500">({testimonials.length} reviews)</span>
            </div>
          </motion.div>

          {/* Reviews Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-stone-100 rounded-2xl h-48" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-500">No reviews yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
                >
                  {testimonial.image_url && (
                    <div className="aspect-video bg-stone-100">
                      <img 
                        src={testimonial.image_url} 
                        alt={`${testimonial.client_name}'s purchase`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                  <Quote className="w-8 h-8 text-[#9CAF88]/30 mb-4" />
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= testimonial.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-stone-200 text-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-stone-700 mb-4 leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#9CAF88]/10 flex items-center justify-center">
                      <span className="text-[#9CAF88] font-medium">
                        {testimonial.client_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-stone-900">
                      {testimonial.client_name}
                    </span>
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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