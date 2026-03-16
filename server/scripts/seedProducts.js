import dotenv from 'dotenv';
import connectDb from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config({ path: '.env' });
await connectDb();

const products = [
  {
    name: 'Blackout Pullover Hoodie',
    description: 'High-density cotton blend with reinforced seams. Engineered for presence.',
    price: 84,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
    badge: 'New Drop',
    featured: true,
    images: [
      '/media/images/hood-1.avif',
      '/media/images/hood-2.avif',
    ],
  },
  {
    name: 'Midnight Oversized Hoodie',
    description: 'Oversized silhouette with heavy-weight fleece. Dominates every room it enters.',
    price: 89,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 22,
    badge: 'Limited',
    featured: true,
    images: [
      '/media/images/hood-3.avif',
      '/media/images/hood-4.avif',
    ],
  },
  {
    name: 'Obsidian Zip-Up Hoodie',
    description: 'Full-zip construction with deep pockets. All-black approach to refined streetwear.',
    price: 82,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 67,
    badge: null,
    featured: true,
    images: [
      '/media/images/hood-5.avif',
    ],
  },
  {
    name: 'Gold-Trim Heavyweight Hoodie',
    description: 'Minimalist silhouette with gold accent threading. Luxury without noise.',
    price: 87,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 38,
    badge: 'New Drop',
    featured: true,
    images: [
      '/media/images/hood-6.avif',
    ],
  },
  {
    name: 'Charcoal Utility Hoodie',
    description: 'Functional design meets high-end construction. Engineered layers.',
    price: 90,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 18,
    badge: 'Limited',
    featured: false,
    images: [
      '/media/images/hood-7.avif',
    ],
  },
  {
    name: 'Black Silk-Touch Hoodie',
    description: 'Subtle luxury with silk-touch finish. Refined streetwear for the discerning.',
    price: 81,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 82,
    badge: null,
    featured: false,
    images: [
      '/media/images/hood-8.avif',
    ],
  },
  {
    name: 'Charcoal Wool-Blend Hoodie',
    description: 'Italian wool blend with structured shoulders. Authority in every thread.',
    price: 88,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 12,
    badge: 'New Drop',
    featured: false,
    images: [
      '/media/images/hood-9.avif',
    ],
  },
  {
    name: 'Minimalist Drop Shoulder Hoodie',
    description: 'Drop shoulder cut with clean lines. Built for forward movement.',
    price: 85,
    category: 'Hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 54,
    badge: null,
    featured: true,
    images: [
      '/media/images/hood-10.avif',
    ],
  },
];

await Product.deleteMany({});
await Product.insertMany(products);

console.log(`Seeded ${products.length} products`);
process.exit(0);
