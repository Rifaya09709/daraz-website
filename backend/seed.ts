import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';

dotenv.config();

const sampleProducts = [
  {
    name: 'Men\'s Denim Shirt',
    description: 'Comfortable cotton denim shirt for casual wear',
    longDescription: 'This premium denim shirt is crafted from 100% cotton for all-day comfort. Perfect for casual outings or semi-formal occasions.',
    price: 2500,
    discountPrice: 1999,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300',
    stock: 45,
    rating: 4.3,
    sku: 'FASH-001',
    tags: ['shirt', 'denim', 'men'],
  },
  {
    name: 'Wireless Bluetooth Earbuds',
    description: 'High quality sound with noise cancellation',
    longDescription: 'Experience crystal clear audio with these wireless earbuds featuring active noise cancellation and 24-hour battery life with charging case.',
    price: 4500,
    discountPrice: 3299,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
    stock: 60,
    rating: 4.6,
    sku: 'ELEC-001',
    tags: ['earbuds', 'wireless', 'audio'],
  },
  {
    name: 'Non-Stick Cooking Pan Set',
    description: '3-piece non-stick cookware set',
    longDescription: 'Durable non-stick coating pan set, perfect for everyday cooking. Includes 3 different sizes for versatile kitchen use.',
    price: 3200,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=500',
    thumbnail: 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=300',
    stock: 30,
    rating: 4.1,
    sku: 'HOME-001',
    tags: ['cookware', 'kitchen', 'pan'],
  },
  {
    name: 'Kids Building Blocks Set',
    description: '100-piece educational building blocks',
    longDescription: 'Colorful building blocks set for kids aged 3+. Encourages creativity and motor skills development.',
    price: 1800,
    discountPrice: 1450,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
    thumbnail: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300',
    stock: 25,
    rating: 4.7,
    sku: 'TOYS-001',
    tags: ['blocks', 'kids', 'educational'],
  },
  {
    name: 'Facial Moisturizer Cream',
    description: 'Hydrating daily moisturizer for all skin types',
    longDescription: 'Lightweight, non-greasy moisturizer with SPF 15 protection. Suitable for daily use on all skin types.',
    price: 950,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300',
    stock: 80,
    rating: 4.4,
    sku: 'BEAUTY-001',
    tags: ['skincare', 'moisturizer', 'face'],
  },
  {
    name: 'Football Size 5',
    description: 'Professional match quality football',
    longDescription: 'FIFA quality certified football, ideal for training and matches. Durable synthetic leather construction.',
    price: 2200,
    discountPrice: 1799,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500',
    thumbnail: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=300',
    stock: 40,
    rating: 4.5,
    sku: 'SPORT-001',
    tags: ['football', 'sports', 'outdoor'],
  },
];

const seedProducts = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/daraz-clone';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} products added successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();