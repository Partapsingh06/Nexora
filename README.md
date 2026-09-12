# Nexora - Full-Stack Flipkart-Inspired E-Commerce Platform

Nexora is a scalable, modern full-stack e-commerce web application inspired by Flipkart's shopping experience and architecture.

## 📁 Project Structure

```
nexora/
├── backend/
│   ├── src/
│   │   ├── config/             # DB connection, Razorpay, Cloudinary config
│   │   ├── controllers/        # Express API request controllers
│   │   ├── middlewares/        # JWT auth verification, error handler
│   │   ├── models/             # Mongoose schemas (User, Product, Order, etc.)
│   │   ├── routes/             # REST API endpoint routes
│   │   ├── utils/              # Helper functions & token utilities
│   │   └── server.js           # Server entry point
│   ├── .env.example            # Backend environment variables template
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/                 # Static public assets
│   ├── src/
│   │   ├── assets/             # Brand logos & visuals
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Global React Contexts (Auth, Cart, Wishlist)
│   │   ├── hooks/              # Custom reusable hooks
│   │   ├── pages/              # Flipkart-styled application views
│   │   ├── services/           # Axios API configuration & endpoints
│   │   ├── utils/              # Formatting & helper utilities
│   │   ├── App.jsx             # Main Application layout
│   │   ├── index.css           # Tailwind directives & Flipkart theme colors
│   │   └── main.jsx            # React root mount
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env.example            # Frontend environment variables template
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env    # Configure your MongoDB URI & JWT Secret
npm run dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env    # Configure frontend environment variables
npm run dev
```
