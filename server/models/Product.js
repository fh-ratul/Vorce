import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    sizes: [{ type: String }],
    images: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    badge: { type: String, enum: ['New Drop', 'Limited', null], default: null },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
