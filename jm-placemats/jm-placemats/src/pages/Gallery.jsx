import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const galleryImages = [
  {
    src: "/img/Black-draughts-3.jpeg",
    title: "Black Draughts",
    description: "Elegant black and white pattern on a modern dining table"
  },
  {
    src: "/img/blue-stripes-3.jpeg",
    title: "Blue Stripes",
    description: "Classic blue stripes adding a touch of elegance"
  },
  {
    src: "/img/cropped-cropped-cropped-white-rectangle-table-runner-on-table-1.jpeg",
    title: "White Table Runner",
    description: "Pure white runner for a clean, sophisticated look"
  },
  {
    src: "/img/cropped-white-rectangle-table-runner-on-table-1.jpeg",
    title: "White Runner Setting",
    description: "Complete table setting with white runner"
  },
  {
    src: "/img/france-flag-3.jpeg",
    title: "France Flag",
    description: "Patriotic French tricolor design"
  },
  {
    src: "/img/green-stripes-3.jpeg",
    title: "Green Stripes",
    description: "Fresh green stripes for a natural dining experience"
  },
  {
    src: "/img/peach-white-3.jpeg",
    title: "Peach & White",
    description: "Soft peach border design for elegant dining"
  },
  {
    src: "/img/red-stars-3.jpeg",
    title: "Red Stars",
    description: "Festive red stars pattern for special occasions"
  },

  {
    src: "/img/WhatsApp-Image-2021-06-09-at-12.38.43.jpeg",
    title: "UK Flag",
    description: "Union Jack inspired placemat set"
  },
  {
    src: "/img/white-pink-3.jpeg",
    title: "Pink & White Border",
    description: "Delicate pink border for feminine elegance"
  },
  {
    src: "/img/green-stripes-5.jpeg",
    title: "Green Stripes Coasters",
    description: "Fresh green and white striped coaster set"
  },
  {
    src: "/img/peach-white-2.jpeg",
    title: "Peach & White Coaster",
    description: "Elegant peach beaded coaster with border design"
  },
  {
    src: "/img/white-pink-2.jpeg",
    title: "Pink Border Coaster",
    description: "White and pink beaded coaster"
  },
  {
    src: "/img/white-pink-5.jpeg",
    title: "Pink & White Coasters Set",
    description: "Set of 5 pink and white beaded coasters"
  },
  {
    src: "/img/white-pink-5.jpeg",
    title: "Pink Border Coasters",
    description: "Elegant set of pink and white coasters"
  },
  {
    src: "/img/WhatsApp-Image-2021-10-14-at-01.48.15.jpeg",
    title: "Red Border Placemat",
    description: "Classic white placemat with red beaded border"
  },
  {
    src: "/img/blue-stripes-6.jpeg",
    title: "Blue Stripes Complete Set",
    description: "Blue and white striped placemat and coaster set"
  },
  {
    src: "/img/coasters-and-placemats-ivory-square.jpeg",
    title: "Ivory Square Complete Set",
    description: "Black and ivory beaded placemat with matching coasters"
  },
  {
    src: "/img/peach-white-6.jpeg",
    title: "Peach & White Complete Set",
    description: "Matching peach and white placemat with coaster"
  },
  {
    src: "/img/WhatsApp-Image-2021-10-14-at-01.48.16.jpeg",
    title: "Red Border Complete Set",
    description: "White and red beaded placemat with matching coaster"
  }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

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
                        <Link to={createPageUrl("Gallery")} className="text-stone-900 font-medium">
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
            className="text-center mb-12"
          >
            <p className="text-[#9CAF88] font-medium tracking-widest text-sm uppercase mb-2">
              Inspiration
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-4">
              Our Placemats in Action
            </h1>
            <p className="text-stone-500 max-w-md mx-auto">
              See how our handcrafted placemats transform dining tables into elegant settings
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-medium">{image.title}</h3>
                    <p className="text-white/80 text-sm">{image.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-stone-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-full object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <h3 className="text-white text-xl font-medium">{selectedImage.title}</h3>
                <p className="text-white/70">{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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