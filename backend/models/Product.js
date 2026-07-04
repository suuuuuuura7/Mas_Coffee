import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Coffee Drinks', 'Cakes & Sweets', 'Specials'],
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
