import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: "Red Border Placemat",
    price: 24.99,
    image_url: "/img/WhatsApp-Image-2021-10-14-at-01.48.15.jpeg",
    category: "placemat",
    featured: true,
    description: "Classic white placemat with red beaded border",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Pink & White Coasters Set",
    price: 12.99,
    image_url: "/img/white-pink-5.jpeg",
    category: "coaster",
    featured: true,
    description: "Set of 5 pink and white beaded coasters",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Complete Dining Set",
    price: 250.00,
    image_url: "/img/WhatsApp-Image-2021-06-09-at-12.38.43.jpeg",
    category: "set",
    featured: true,
    description: "Full set of placemats and coasters",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "White & Pink Border Placemat",
    price: 19.99,
    image_url: "/img/white-pink-3.jpeg",
    category: "placemat",
    featured: false,
    description: "Delicate pink border for feminine elegance",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Green Stripes Placemat",
    price: 22.99,
    image_url: "/img/green-stripes-3.jpeg",
    category: "placemat",
    featured: false,
    description: "Fresh green stripes for a natural dining experience",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Blue Stripes Placemat",
    price: 22.99,
    image_url: "/img/blue-stripes-3.jpeg",
    category: "placemat",
    featured: false,
    description: "Classic blue stripes adding a touch of elegance",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Peach & White Placemat",
    price: 21.99,
    image_url: "/img/peach-white-3.jpeg",
    category: "placemat",
    featured: false,
    description: "Soft peach border design for elegant dining",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Black Draughts Placemat",
    price: 23.99,
    image_url: "/img/Black-draughts-3.jpeg",
    category: "placemat",
    featured: false,
    description: "Elegant black and white pattern on a modern dining table",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Green Stripes Coasters",
    price: 14.99,
    image_url: "/img/green-stripes-5.jpeg",
    category: "coaster",
    featured: false,
    description: "Fresh green and white striped coaster set",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Peach & White Coaster",
    price: 11.99,
    image_url: "/img/peach-white-2.jpeg",
    category: "coaster",
    featured: false,
    description: "Elegant peach beaded coaster with border design",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Pink Border Coaster",
    price: 10.99,
    image_url: "/img/white-pink-2.jpeg",
    category: "coaster",
    featured: false,
    description: "White and pink beaded coaster",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Blue Stripes Complete Set",
    price: 79.99,
    image_url: "/img/blue-stripes-6.jpeg",
    category: "set",
    featured: false,
    description: "Blue and white striped placemat and coaster set",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Ivory Square Complete Set",
    price: 250.00,
    image_url: "/img/coasters-and-placemats-ivory-square.jpeg",
    category: "set",
    featured: false,
    description: "Black and ivory beaded placemat with matching coasters",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Peach & White Complete Set",
    price: 250.00,
    image_url: "/img/peach-white-6.jpeg",
    category: "set",
    featured: false,
    description: "Matching peach and white placemat with coaster",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Red Border Complete Set",
    price: 250.00,
    image_url: "/img/WhatsApp-Image-2021-10-14-at-01.48.16.jpeg",
    category: "set",
    featured: false,
    description: "White and red beaded placemat with matching coaster",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "France Flag Placemat",
    price: 25.99,
    image_url: "/img/france-flag-3.jpeg",
    category: "placemat",
    featured: false,
    description: "Patriotic French tricolor design",
    material: "Handcrafted Beads",
    in_stock: true
  },
  {
    name: "Red Stars Placemat",
    price: 24.99,
    image_url: "/img/red-stars-3.jpeg",
    category: "placemat",
    featured: false,
    description: "Festive red stars pattern for special occasions",
    material: "Handcrafted Beads",
    in_stock: true
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jm-placemats');
    console.log('✅ Connected to MongoDB');

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({});
    // console.log('🗑️  Cleared existing products');

    // Insert products
    const inserted = await Product.insertMany(products, { ordered: false });
    console.log(`✅ Successfully seeded ${inserted.length} products`);

    // Count total products
    const total = await Product.countDocuments();
    console.log(`📦 Total products in database: ${total}`);

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️  Some products already exist, skipping duplicates');
      const total = await Product.countDocuments();
      console.log(`📦 Total products in database: ${total}`);
      process.exit(0);
    } else {
      console.error('❌ Error seeding products:', error);
      process.exit(1);
    }
  }
}

seedProducts();
