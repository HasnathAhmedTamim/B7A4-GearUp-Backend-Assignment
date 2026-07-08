# GearUp 🏋️

**Rent Sports & Outdoor Gear Instantly**

A role-based backend API for a sports and outdoor equipment rental platform where customers can rent equipment, providers can manage inventory and orders, and admins can oversee the entire system.

---

# 🔗 Live Links

* **Backend Repository:** https://github.com/HasnathAhmedTamim/B7A4-GearUp-Backend-Assignment
* **Live API:** https://b7a4-gearup-backend-assignment.onrender.com/
* **API Documentation:** https://documenter.getpostman.com/view/31892953/2sBY4Jxid1
* **Postman Collection:** https://github.com/HasnathAhmedTamim/B7A4-GearUp-Backend-Assignment/blob/main/GearUp%20Backend%20API.postman_collection.json
* **Demo Video:** https://drive.google.com/file/d/1vfuwfiiA09KPH7vdmfaCRl76ADtXytw6/view?usp=sharing

---

# 👤 Demo Credentials

## Admin

Email: [example@gmail.com](mailto:example@gmail.com)

Password: ***

---

# 📖 Project Overview

GearUp is a Sports and Outdoor Equipment Rental Platform where:

* Customers can browse and rent sports gear.
* Providers can manage their gear inventory and rental orders.
* Admins can manage users, categories, rentals, and monitor the entire system.

---

# ✨ Features

## 🌐 Public Features

* Browse all available sports and outdoor gear
* Search and filter gear
* Pagination support
* View gear details

## 👤 Customer Features

* Register and login
* Place rental orders
* Make payments using Stripe
* View payment history
* Track rental order status
* Leave reviews after returning gear

## 🏪 Provider Features

* Register and login
* Add, update, and delete gear
* Manage inventory
* View rental orders
* Update rental status

## 👑 Admin Features

* View all users
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
* Stripe Webhooks

## Deployment

* Render

---

# 📂 Project Structure

```text
src
├── app.ts
├── server.ts
├── config
├── lib
├── middlewares
├── modules
│   ├── admin
│   ├── auth
│   ├── category
│   ├── gear
│   ├── payment
│   ├── rental
│   ├── review
│   └── users
├── utils
└── error
```

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

## Start Development Server

```bash
npm run dev
```

---

# 🚀 Production Build

```bash
npm run build
npm start
```

---

# 🔐 Authentication

The application uses:

* JWT Access Token
* JWT Refresh Token
* HTTP-only Cookies
* Role-based Authorization

Roles:

* CUSTOMER
* PROVIDER
* ADMIN

---

# 📚 API Documentation

### Postman Documentation

https://documenter.getpostman.com/view/31892953/2sBY4Jxid1

### Backup Postman Collection

https://github.com/HasnathAhmedTamim/B7A4-GearUp-Backend-Assignment/blob/main/GearUp%20Backend%20API.postman_collection.json

All endpoints, request bodies, success responses, and error responses are available in the Postman documentation.

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

# 📝 API Response Format

## Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {}
}
```

## Error Response

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

# 📝 Example: Register Customer

### Request

```http
POST /api/users/register
```

```json
{
  "name": "Customer Test",
  "email": "customertest@gmail.com",
  "password": "123456",
  "role": "CUSTOMER",
  "photo": "https://i.ibb.co/customer.jpg",
  "phone": "01711111111",
  "address": "Dhaka",
  "bio": "I love adventure."
}
```

### Response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "id": "30867f5e-b661-4a8f-8f6c-65e32c731c88",
    "name": "Customer Test",
    "email": "customertest@gmail.com",
    "role": "CUSTOMER",
    "status": "ACTIVE"
  }
}
```

---

# 📝 Example: Login

### Request

```http
POST /api/auth/login
```

```json
{
  "email": "customertest@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "id": "abb9ee10-a498-48f7-be3a-accebb83ef14",
    "name": "Customer Test",
    "email": "customertest@gmail.com",
    "role": "CUSTOMER",
    "status": "ACTIVE"
  }
}
```

---

# 💳 Stripe Webhook (Local Development)

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

# 📊 Database Models

* User
* Profile
* Category
* Gear
* Rental
* Payment
* Review

---

# 👨‍💻 Author

**Hasnath Ahmed Tamim**

* Email: [hasnath.tamim333@gmail.com](mailto:hasnath.tamim333@gmail.com)

