import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products - list all products (customer menu + admin dashboard)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - create a new product (admin only in production)
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/products/:id - update price and/or stock status
router.patch('/:id', async (req, res) => {
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

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Temporary seed route (added to bypass DB connection hangs on the client)
router.get('/seed', async (req, res) => {
  try {
    const defaultItems = [
      { name: 'Macchiato', category: 'Coffee Drinks', price: 65, description: 'Espresso with a dash of steamed milk foam.', imageUrl: 'https://loremflickr.com/400/300/espresso,coffee', inStock: true },
      { name: 'Cappuccino', category: 'Coffee Drinks', price: 75, description: 'Equal parts espresso, steamed milk, and foam.', imageUrl: 'https://loremflickr.com/400/300/cappuccino', inStock: true },
      { name: 'Latte', category: 'Coffee Drinks', price: 80, description: 'Smooth espresso with steamed milk and light foam.', imageUrl: 'https://loremflickr.com/400/300/latte,coffee', inStock: true },
      { name: 'Americano', category: 'Coffee Drinks', price: 55, description: 'Espresso diluted with hot water for a lighter body.', imageUrl: 'https://loremflickr.com/400/300/americano,coffee', inStock: true },
      { name: 'Green Tea', category: 'Tea', price: 45, description: 'Light, grassy brew served hot with a hint of honey.', imageUrl: 'https://loremflickr.com/400/300/greentea', inStock: true },
      { name: 'Masala Chai', category: 'Tea', price: 50, description: 'Spiced black tea simmered with milk and warm spices.', imageUrl: 'https://loremflickr.com/400/300/chai,tea', inStock: true },
      { name: 'Mojito Mocktail', category: 'Mocktails', price: 90, description: 'Fresh mint, lime, and soda over crushed ice.', imageUrl: 'https://loremflickr.com/400/300/mojito,mocktail', inStock: true },
      { name: 'Passion Fruit Cooler', category: 'Mocktails', price: 95, description: 'Tropical passion fruit blended with soda and lime.', imageUrl: 'https://loremflickr.com/400/300/passionfruit,drink', inStock: true },
      { name: 'Chocolate Cake', category: 'Cakes & Sweets', price: 120, description: 'Rich layered chocolate sponge with ganache.', imageUrl: 'https://loremflickr.com/400/300/chocolatecake', inStock: false },
      { name: 'Cheesecake', category: 'Cakes & Sweets', price: 130, description: 'Classic creamy cheesecake on a biscuit base.', imageUrl: 'https://loremflickr.com/400/300/cheesecake', inStock: true },
      { name: 'Baklava', category: 'Cakes & Sweets', price: 85, description: 'Layered filo pastry with nuts and honey syrup.', imageUrl: 'https://loremflickr.com/400/300/baklava', inStock: true },
      { name: 'Iced Caramel Special', category: 'Specials', price: 95, description: 'House cold brew with caramel drizzle.', imageUrl: 'https://loremflickr.com/400/300/icedcoffee,caramel', inStock: true },
      { name: "Chef's Seasonal Special", category: 'Specials', price: 110, description: "This month's limited-time signature drink.", imageUrl: 'https://loremflickr.com/400/300/specialdrink', inStock: true },
    ];
    await Product.deleteMany({});
    const seeded = await Product.insertMany(defaultItems);
    res.json({ message: 'Seeded DB successfully!', count: seeded.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
