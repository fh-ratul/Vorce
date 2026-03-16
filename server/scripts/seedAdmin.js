import dotenv from 'dotenv';
import connectDb from '../config/db.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';

dotenv.config({ path: '.env' });
await connectDb();

const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

if (existingAdmin) {
  console.log('Admin user already exists');
  process.exit(0);
}

const adminUser = await User.create({
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: 'admin',
});

await Cart.create({ user: adminUser._id, items: [] });

console.log(`Admin created: ${adminUser.email}`);
process.exit(0);
