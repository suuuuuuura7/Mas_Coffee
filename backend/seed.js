import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from './models/Product.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const mockProducts = [
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

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        await Product.deleteMany({});
        console.log('Cleared existing products');
        await Product.insertMany(mockProducts);
        console.log('Seeded products successfully!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
