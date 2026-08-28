# QuickBite

A restaurant food-ordering web application.

## Technologies

* Node.js
* Express.js
* PostgreSQL
* React
* JavaScript

## Features

* Browse food
* Add items to cart
* Adjust quantities
* Place orders
* View orders

## API Endpoints

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/foods`      | Get all foods      |
| GET    | `/api/foods/:id`  | Get a food by ID   |
| POST   | `/api/orders`     | Create an order    |
| GET    | `/api/orders/:id` | Get an order by ID |

## Database

PostgreSQL database with:

* `foods`
* `orders`
* `order_items`

## Setup

### Install dependencies

```bash
cd backend
npm install
```

### Environment variables

Create a `.env` file in the `backend` directory:


### Start the backend

```bash
npm start
```

The server runs on:

```text
http://localhost:3000
```

## Project Structure

```text
QuickBite/
├── backend/
├── frontend/
└── docs/
```
