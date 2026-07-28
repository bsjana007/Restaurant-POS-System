# Aetheria: Web-Based Restaurant POS & QR Ordering System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A premium, full-stack, real-time POS (Point of Sale) and QR-code-based menu ordering system designed for modern restaurants. Customers can scan table-specific secure QR codes to view the menu, place orders, and track order status in real time. Kitchen staff manage incoming orders via a Kitchen Display System (KDS), and cashiers process billing and invoice generation dynamically.

---

## Key Features

- **Secure QR Ordering**: Cryptographically signed QR codes prevent table ID tampering.
- **Real-Time Synchronisation**: Uses Socket.io to sync order status, KDS tickets, and billing requests instantly across all devices.
- **Kitchen Display System (KDS)**: Interface for chefs to view, accept, prepare, and serve orders.
- **Cashier Dashboard**: Table layout interface showing table statuses (`VACANT`, `OCCUPIED`, `BILLING`, `DIRTY`) with instant checkout, payment method selection, and invoice printing.
- **Admin Controls**: Manage menu items (with image uploads), generate secure QR codes for new tables, and register/manage staff accounts.
- **Auth Guards & Route Protection**: Role-based access validation for staff (`ADMIN`, `KITCHEN`, `CASHIER`) and secure access blocks for customers (`CUSTOMER`).

---

## 📂 Project Directory Structure

```text
Resturent-POS/
├── backend/
│   ├── models/
│   │   ├── db.js             # Table, Order, Menu, and Bill schemas
│   │   └── User.js           # Staff credentials schema
│   ├── routes/
│   │   ├── auth.js           # Login, staff registration, customer sessions
│   │   ├── bill.js           # Invoice generation and payment completion
│   │   ├── menu.js           # Menu CRUD and image upload via Cloudinary
│   │   └── table.js          # Table creation and status updating
│   ├── utils/
│   │   └── qr.js             # Crypto signing helper for secure table QR URLs
│   ├── middleware/
│   │   ├── verifyCustomer.js # Validates active customer session tokens
│   │   └── verifyStaff.js    # Role-based middleware for staff verification
│   ├── .env                  # Backend environment secrets configuration
│   ├── server.js             # Socket.io setup, DB connections, app bootloader
│   ├── seed.js               # Database seeding script for admin credentials
│   └── package.json
│
├── restaurant-pos-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx    # Primary dashboard layout preview
│   │   │   ├── AdminMenuManager.jsx  # Menu management page
│   │   │   ├── AdminQRPanel.jsx      # Table list and QR code generator
│   │   │   ├── CahierDashboard.jsx   # Billing, status updates & checkout
│   │   │   ├── KDSDashboard.jsx      # Kitchen display order board
│   │   │   ├── MenuPage.jsx          # Stunning public dishes menu viewer
│   │   │   ├── QRMenuPage.jsx        # Customer menu, cart, status & bill requests
│   │   │   ├── ProtectedRoute.jsx    # Route guards for staff roles & customer blocks
│   │   │   ├── StaffLogin.jsx        # Login panel
│   │   │   ├── StaffRegister.jsx     # Staff registry with split list view
│   │   │   ├── Navbar.jsx            # Dynamic role-based header
│   │   │   └── Footer.jsx            # Page footer
│   │   ├── Context/
│   │   │   ├── POSContext.js         # Global React context
│   │   │   └── POSState.jsx          # Context provider handling API calls & sockets
│   │   ├── App.jsx                   # Frontend routes registration
│   │   ├── App.css                   # Global and custom Tailwind layout styles
│   │   └── main.jsx                  # React bootloader
│   ├── .env                          # Frontend VITE_BACKEND_URL configuration
│   └── package.json
│
└── README.md                         # Project documentation
```

---

## Installation & Setup

### 1. Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v16.x or higher)
- **MongoDB** (Running locally or hosted via MongoDB Atlas)

---

### 2. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret_key
   QR_SECRET_KEY=your_cryptographic_qr_signing_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Seed the database with the default Administrator account:
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd restaurant-pos-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `restaurant-pos-frontend/` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Technologies Used

- **Frontend**: React (Vite), React Router DOM (v6), Socket.io-client, TailwindCSS.
- **Backend**: Node.js, Express, Mongoose, Socket.io, JWT (JSON Web Tokens),Crypto, Multer & Cloudinary (for image uploads).
- **Database**: MongoDB.
