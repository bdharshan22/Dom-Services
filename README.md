

# 🏠 Domestic Services Web Application

A full-stack web application for booking and managing domestic services such as cleaning, plumbing, electrical work, and more.
This project is built with **React**, **Node.js**, **Express**, and **MongoDB**.

## 🚀 Deployment

This application is deployed with a decoupled architecture:

  * **Frontend (React):** Deployed on **Vercel** for a fast, global CDN and continuous integration.

      * **Live URL:** [**https://domestic-services-vt.vercel.app/**](https://www.google.com/search?q=https://domestic-services-vt.vercel.app/)

  * **Backend (Node.js/Express):** Hosted on **Render** for a reliable and scalable server environment.

      * **API URL:** [**https://dom-services.onrender.com/api**](https://dom-services.onrender.com/api)

  * **Database:** The database is hosted on **MongoDB Atlas**.

## ✨ Features

  * **User registration & login** (Authentication & Authorization)
  * Browse available domestic services
  * Book services online with date & time selection
  * **Worker dashboard** to view and manage bookings
  * **Admin dashboard** for managing users and services
  * **Email notifications** for bookings & updates
  * Secure payment integration (**Razorpay / Stripe**)

## 🛠️ Tech Stack

  * **Frontend:** React, TailwindCSS / CSS, Axios
  * **Backend:** Node.js, Express.js
  * **Database:** MongoDB (using MongoDB Compass / Atlas)
  * **Authentication:** JWT / OAuth
  * **Payment Gateway:** Razorpay (test mode supported)

## 📂 Project Structure

```
Domestic-Services/
│
├── frontend/              # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── api.js
│       └── App.js
│
├── backend/               # Node.js backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # Express routes
│   ├── controllers/
│   └── server.js
│
├── package.json
└── README.md
```

## ⚙️ Installation & Setup (Local Development)

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/bdharshan22/Dom-Services.git
cd Dom-Services
```

#### 2️⃣ Install dependencies

```bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
```

#### 3️⃣ Setup environment variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

#### 4️⃣ Run the application

```bash
# Start backend server
cd backend
npm start

# Start frontend development server in a new terminal
cd frontend
npm start
```

  * Frontend runs on `http://localhost:3000`
  * Backend runs on `http://localhost:5000`

## 📡 API Endpoints

#### 🔑 Authentication

  * `POST /api/auth/register` – Register a new user
  * `POST /api/auth/login` – Login user

#### 👤 Users

  * `GET /api/users/:id` – Get user details
  * `PUT /api/users/:id` – Update user profile

#### 🛠️ Services

  * `GET /api/services` – Get all services
  * `POST /api/services` – Add new service (Admin only)
  * `PUT /api/services/:id` – Update service (Admin only)
  * `DELETE /api/services/:id` – Delete service (Admin only)

#### 📅 Bookings

  * `POST /api/bookings` – Create booking
  * `GET /api/bookings/user/:id` – Get bookings for a user
  * `GET /api/bookings/worker/:id` – Get bookings for a worker
  * `PUT /api/bookings/:id/status` – Update booking status

#### 💳 Payments

  * `POST /api/payments/order` – Create Razorpay order
  * `POST /api/payments/verify` – Verify payment

## 📜 License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).
