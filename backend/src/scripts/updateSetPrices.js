import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

async function updateSetPrices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jm-placemats');
    console.log('✅ Connected to MongoDB');

    // Update all products with category "set" to price £250
    const result = await Product.updateMany(
      { category: 'set' },
      { $set: { price: 250.00 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} set(s) to £250.00`);

    // Show updated products
    const sets = await Product.find({ category: 'set' });
    console.log('\n📦 Updated Sets:');
    sets.forEach(set => {
      console.log(`   - ${set.name}: £${set.price.toFixed(2)}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating set prices:', error);
    process.exit(1);
  }
}

updateSetPrices();
