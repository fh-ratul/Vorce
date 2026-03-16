# VORCE

VORCE is a full-stack luxury menswear e-commerce platform built for a dark, aggressive premium brand experience.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- Payments: SSLCommerz + Cash on Delivery (COD)

## Project Structure

```text
/client       React frontend
/server       Express backend
/server/models
/server/routes
/server/controllers
/server/middleware
/server/uploads
```

## Features

- JWT-based registration and login
- Protected user dashboard and admin panel
- Product catalog with search and filters
- Product badges for New Drop and Limited products
- Persistent cart stored in MongoDB
- SSLCommerz online checkout flow
- COD direct order placement flow
- Order confirmation and order history
- Admin dashboard with product CRUD, image upload, and order status updates
- Luxury dark-mode responsive UI

## Environment Variables

### Server: /server/.env

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/vorce
JWT_SECRET=replace-with-a-secure-secret
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_IS_LIVE=false
CLIENT_URL=http://localhost:5173
ADMIN_NAME=VORCE Admin
ADMIN_EMAIL=admin@vorce.com
ADMIN_PASSWORD=ChangeThisNow123!
```

### Client: /client/.env

```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

## Setup

1. Install MongoDB locally or provide a hosted MongoDB URI.
2. Update the values in /server/.env and /client/.env.
3. From the workspace root, install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

4. Seed the admin account:

```bash
npm run seed:admin
```

5. Start the full stack app:

```bash
npm run dev
```

6. Open http://localhost:5173.

## Scripts

### Root

- `npm run dev` starts client and server together
- `npm run build` builds the frontend
- `npm run seed:admin` creates the initial admin user

### Server

- `npm run dev --prefix server`
- `npm run start --prefix server`

### Client

- `npm run dev --prefix client`
- `npm run build --prefix client`

## SSLCommerz Setup

- Set your SSLCommerz credentials in /server/.env.
- Keep `SSLCOMMERZ_IS_LIVE=false` for sandbox testing.
- Checkout redirects users to SSLCommerz for online payment, then returns to VORCE order confirmation.

## Notes

- Uploaded images are stored under /server/uploads.
- The cart is available for authenticated users and is persisted in MongoDB.
- SSLCommerz callbacks update order payment status on success/fail/cancel.
- COD orders are created immediately with pending payment and processing status.
