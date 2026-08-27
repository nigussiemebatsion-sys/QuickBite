# QuickBite

QuickBite is a restaurant ordering application that allows customers to browse food and place orders through a REST API.

## Project Status

Currently in development.

### Completed

* Restaurant frontend
* Express.js backend
* Food service
* Order service
* Create Order API
* Get Order by ID API
* Order validation
* Price calculation
* Git and GitHub setup

### Next

* PostgreSQL integration
* Replace in-memory data with database storage
* Connect frontend with backend
* Testing
* Deployment

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Testing:** Postman
* **Version Control:** Git, GitHub

## Project Structure

```text
QuickBite/
├── backend/
├── frontend/
├── docs/
├── img/
├── index.html
├── project.css
├── README.md
└── .gitignore
```

## API

### Create Order

```http
POST /api/orders
```

Example request:

```json
{
  "items": [
    {
      "foodId": 1,
      "quantity": 2
    },
    {
      "foodId": 2,
      "quantity": 1
    }
  ]
}
```

### Get Order

```http
GET /api/orders/:id
```

Example:

```http
GET /api/orders/1
```

## Backend Architecture

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Database
```

The current development version uses in-memory data. PostgreSQL will be integrated in the next stage.

## Development

Start the backend:

```bash
cd backend
npm install
npm start
```

The server runs on:

```text
http://localhost:3000
```

## Roadmap

1. Complete backend APIs
2. Integrate PostgreSQL
3. Connect frontend and backend
4. Test the complete ordering flow
5. Deploy the application
