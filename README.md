# GearUp 🏋️

**Rent Sports & Outdoor Gear Instantly**

A role-based backend API for a sports and outdoor equipment rental platform where customers can rent equipment, providers can manage inventory and orders, and admins can oversee the entire system.

---

# 🔗 Live Links

* **Backend API:** https://b7a4-gearup-backend-assignment.onrender.com
* **API Documentation:** https://documenter.getpostman.com/view/your-id/your-doc-id
* **GitHub Repository:** https://github.com/HasnathAhmedTamim/B7A4-GearUp-Backend-Assignment

---

# 👤 Demo Credentials

## Admin

Email: [admin@gmail.com](mailto:admin@gmail.com)

Password: ********

## Provider

Email: [provider@gmail.com](mailto:provider@gmail.com)

Password: ********

## Customer

Email: [customer@gmail.com](mailto:customer@gmail.com)

Password: ********

---

# 📖 Project Overview

GearUp is a Sports and Outdoor Equipment Rental Platform where:

* Customers can browse and rent sports gear.
* Providers can manage their gear inventory and rental orders.
* Admins can monitor users, rentals, and categories.

---

# ✨ Features

## Public Features

* Browse all available gear
* Search and filter gear
* Pagination support
* View gear details

## Customer Features

* Register and login
* Place rental orders
* Pay using Stripe
* View payment history
* Track rental status
* Leave reviews

## Provider Features

* Add, update, and delete gear
* Manage inventory
* View rental orders
* Update rental status

## Admin Features

* Manage users
* Suspend or activate users
* Manage categories
* Monitor all rentals and gear
* View dashboard statistics

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## Authentication

* JWT
* HTTP-only Cookies

## Validation

* Zod

## Payment

* Stripe Checkout
* Stripe Webhook

## Deployment

* Render

---

# 📂 Project Structure

src/
├── app.ts
├── server.ts
├── config/
├── middlewares/
├── modules/
│ ├── auth/
│ ├── users/
│ ├── category/
│ ├── gear/
│ ├── rental/
│ ├── payment/
│ ├── review/
│ └── admin/
├── utils/
└── lib/

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/HasnathAhmedTamim/B7A4-GearUp-Backend-Assignment.git
cd B7A4-GearUp-Backend-Assignment
```

## Install Dependencies

```bash
npm install
```

## Create Environment Variables

Create a `.env` file and add:

```env
PORT=5000
APP_URL=http://localhost:5173

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRATION_IN=1d
JWT_REFRESH_EXPIRATION_IN=7d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Run Migration

```bash
npx prisma migrate dev
```

## Run Development Server

```bash
npm run dev
```

---

# 🚀 Build for Production

```bash
npm run build
npm start
```

---

# 🔐 Authentication

Authentication uses:

* JWT Access Token
* JWT Refresh Token
* HTTP-only Cookies
* Role-based Authorization

Roles:

* CUSTOMER
* PROVIDER
* ADMIN

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /api/users/register     |
| POST   | /api/auth/login         |
| GET    | /api/auth/me            |
| POST   | /api/auth/refresh-token |
| POST   | /api/auth/logout        |

---

## Categories

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | /api/categories     |
| GET    | /api/categories     |
| GET    | /api/categories/:id |
| PATCH  | /api/categories/:id |
| DELETE | /api/categories/:id |

---

## Gear

| Method | Endpoint                   |
| ------ | -------------------------- |
| POST   | /api/gear                  |
| GET    | /api/gear                  |
| GET    | /api/gear/provider/my-gear |
| GET    | /api/gear/:id              |
| PATCH  | /api/gear/:id              |
| DELETE | /api/gear/:id              |

---

## Rentals

| Method | Endpoint                         |
| ------ | -------------------------------- |
| POST   | /api/rentals                     |
| GET    | /api/rentals                     |
| GET    | /api/rentals/:id                 |
| GET    | /api/rentals/provider/orders     |
| PATCH  | /api/rentals/provider/orders/:id |

---

## Payments

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/payments/create  |
| POST   | /api/payments/webhook |
| GET    | /api/payments         |
| GET    | /api/payments/:id     |

---

## Reviews

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /api/reviews         |
| GET    | /api/reviews/:gearId |

---

## Admin

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/admin/users     |
| PATCH  | /api/admin/users/:id |
| GET    | /api/admin/rentals   |
| GET    | /api/admin/gear      |
| GET    | /api/admin/stats     |

---

# 💳 Stripe Webhook (Local Development)

Run:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

# 📊 Database Models

* User
* Category
* Gear
* Rental
* Payment
* Review

---

# ❗ Error Response Format

```json
{
  "success": false,
  "message": "Something went wrong",
  "errorDetails": {
    "statusCode": 400
  }
}
```

---

# 📹 Submission

* Backend Repository
* Live API URL
* Postman Documentation
* Demo Video
* Admin Credentials

---

# 👨‍💻 Author

Hasnath Ahmed Tamim

Email: [hasnath.tamim333@gmail.com](mailto:hasnath.tamim333@gmail.com)

LinkedIn: https://www.linkedin.com/in/hasnath-ahmed-tamim/
