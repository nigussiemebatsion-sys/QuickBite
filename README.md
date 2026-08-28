# QuickBite

QuickBite is a food ordering web application built as a full-stack learning project.

Users can browse foods, add items to a cart, and place orders. The backend provides REST APIs and stores orders in PostgreSQL.

## Technologies

* HTML, CSS, JavaScript
* Node.js
* Express.js
* PostgreSQL
* Git & GitHub
* Postman

## Features

* Browse available foods
* View food details
* Add and remove items from the cart
* Increase and decrease quantities
* Checkout and place orders
* Store orders in PostgreSQL
* Retrieve orders through the API

## Backend

The backend uses a simple structure:

```text
Routes → Controllers → Services → PostgreSQL
```

Main API endpoints:

```text
GET  /api/foods
POST /api/orders
GET  /api/orders/:id
```

## Database

QuickBite uses PostgreSQL with three main tables:

* `foods` — stores food information
* `orders` — stores placed orders
* `order_items` — stores the foods and quantities belonging to each order

## Running the Project

### Backend

```bash
cd backend
npm install
node src/app.js
```

The server runs on:

```text
http://localhost:3000
```

Make sure PostgreSQL is running and the database connection is configured in `.env`.

### Frontend

Open the frontend files in a browser or run them using a local development server.

## Project Status

Currently implemented:

* Frontend and backend integration
* PostgreSQL integration
* Food API
* Cart functionality
* Order creation and retrieval
* Order persistence

Planned:

* Authentication
* Authorization
* Order cancellation
* Order status management
* Ethiopian traditional food dataset
