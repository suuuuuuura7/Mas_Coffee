import express from 'express';
import Product from '../models/Product.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/products - list all products (customer menu + admin dashboard) - public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - create a new product - ADMIN ONLY
router.post('/', requireAuth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/products/:id - update price and/or stock status - ADMIN ONLY
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id - ADMIN ONLY
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;