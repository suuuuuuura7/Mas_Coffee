// Run this ONCE locally to create your admin account:
//   node createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const USERNAME = 'admin';
const PASSWORD = 'ChangeMe123'; // CHANGE THIS before running, then change again after first login

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);

    const existing = await Admin.findOne({ username: USERNAME });
    if (existing) {
        console.log('An admin with that username already exists. No changes made.');
        process.exit(0);
    }

    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    await Admin.create({ username: USERNAME, passwordHash });
    console.log(`Admin account created. Username: ${USERNAME} — log in, then change the password immediately.`);
    process.exit(0);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});