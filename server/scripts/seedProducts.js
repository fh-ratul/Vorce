import dotenv from 'dotenv';
import connectDb from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config({ path: '.env' });
await connectDb();

const products = [
  {
    name: 'Blackout Combat Shirt',
    description: 'High-density cotton blend with reinforced seams. Engineered for presence.',
    price: 84,
    category: 'Shirts',
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
    name: 'Midnight Tailored Jacket',
    description: 'Sharp tailoring with aggressive cut. Statement piece for boardroom dominance.',
    price: 89,
    category: 'Jackets',
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
    name: 'Obsidian Chinos',
    description: 'Premium blend with perfect drape. All-black approach to refined menswear.',
    price: 82,
    category: 'Pants',
    sizes: ['28', '30', '32', '34', '36', '38'],
    stock: 67,
    badge: null,
    featured: true,
    images: [
      '/media/images/hood-5.avif',
    ],
  },
  {
    name: 'Gold-Trimmed Crew Neck',
    description: 'Minimalist silhouette with gold accent threading. Luxury without noise.',
    price: 87,
    category: 'Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 38,
    badge: 'New Drop',
    featured: true,
    images: [
      '/media/images/hood-6.avif',
    ],
  },
  {
    name: 'Charcoal Utility Vest',
    description: 'Functional design meets high-end construction. Engineered layers.',
    price: 90,
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 18,
    badge: 'Limited',
    featured: false,
    images: [
      '/media/images/hood-7.avif',
    ],
  },
  {
    name: 'Black Silk Pocket Tee',
    description: 'Subtle luxury with silk finish. Refined basics for the discerning.',
    price: 81,
    category: 'Shirts',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 82,
    badge: null,
    featured: false,
    images: [
      '/media/images/hood-8.avif',
    ],
  },
  {
    name: 'Charcoal Wool Coat',
    description: 'Italian wool with structured shoulders. Authority in every thread.',
    price: 88,
    category: 'Outerwear',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 12,
    badge: 'New Drop',
    featured: false,
    images: [
      '/media/images/hood-9.avif',
    ],
  },
  {
    name: 'Minimalist Black Jeans',
    description: 'Raw denim with clean lines. Cut for forward movement.',
    price: 85,
    category: 'Pants',
    sizes: ['28', '30', '32', '34', '36', '38'],
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
