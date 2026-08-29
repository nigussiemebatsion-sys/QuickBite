# QuickBite

QuickBite is a full-stack food ordering web application focused on Ethiopian cuisine. It allows customers to browse available food items, view food details, manage their cart, and place orders with delivery information.

## Features

* Browse available Ethiopian food
* View food details and prices
* Add and remove items from the cart
* Update item quantities
* Automatic order total calculation
* Customer checkout and delivery information
* Order creation and validation
* Persistent order storage
* Retrieve order details through the API

## Tech Stack

**Frontend**

* HTML5
* CSS3
* JavaScript

**Backend**

* Node.js
* Express.js
* REST API
* PostgreSQL client (`pg`)

**Database**

* PostgreSQL
* Neon

**Deployment**

* Vercel
* Render

## Architecture

```text
Frontend
   │
   │ REST API
   ▼
Express.js Backend
   │
   │ PostgreSQL
   ▼
Neon PostgreSQL
```

## Project Structure

```text
QuickBite/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       └── server.js
│
├── database/
│   ├── 01_schema.sql
│   └── 02_seed.sql
│
└── frontend/
    ├── css/
    ├── js/
    ├── img/
    ├── index.html
    ├── home.html
    ├── menu.html
    ├── food-details.html
    ├── cart.html
    ├── checkout.html
    └── order-confirmation.html
```

## API

### Foods

```http
GET /api/foods
```

Returns the available food items.

### Create Order

```http
POST /api/orders
```

Creates a new order and stores the associated order items.

### Get Order

```http
GET /api/orders/:id
```

Returns an order and its associated items.

## Database

The application uses PostgreSQL to manage:

* Food items
* Orders
* Order items

Orders and their items are stored using a database transaction to maintain data consistency.

## Live Application

Frontend: https://quickbite-ethiopia.vercel.app/

Backend: https://quickbite-backend-74xf.onrender.com/

## Purpose

QuickBite was developed as a practical full-stack project to apply concepts in backend development, REST API design, relational databases, and frontend-backend integration.

## Author

Mebatsion Nigussie
