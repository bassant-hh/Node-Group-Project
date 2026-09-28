# Node Group Project

A RESTful backend API for a library management system built with **Node.js, Express, and MongoDB**.

The project provides user authentication, book management, reading progress tracking, and order/rental management through a structured REST API.

## Features

### Authentication & Users
* User registration and login
* JWT-based authentication
* Refresh token flow
* Logout
* User profile updates
* Role-based authorization (`ADMIN` / `USER`)
* Reading progress tracking
* Completed books tracking
* Wallet balance handling based on completed books

### Book Management
* Create, retrieve, update, and delete books
* Retrieve a book by ID
* Search books by name
* Filter books by category
* Filter books by series
* Pagination
* Sorting by supported fields
* Automatic series slug generation when creating books
* Admin-only book management operations
* Access-controlled book details

### Orders & Rentals
* Create orders
* Retrieve orders
* Retrieve an individual order
* Update order status
* Cancel eligible orders
* Return rental books
* Rental period handling
* Purchase and rental order types
* Coupon handling for supported orders
* Shipping and payment status tracking

## Tech Stack
* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt**
* **dotenv**
* **express-rate-limit** dependency included in the project

## Project Structure

```text

Node-Group-Project/

├── config/

│   └── db.js

├── controllers/

│   ├── bookController.js

│   ├── orderController.js

│   └── userController.js

├── middleware/

│   ├── authMiddleware.js

│   ├── collectionMiddleware.js

│   └── errorMiddleware.js

├── models/

│   ├── Book.js

│   ├── Order.js

│   └── User.js

├── routes/

│   ├── bookRoutes.js

│   ├── orderRoutes.js

│   └── userRoutes.js

├── services/

│   └── book.service.js

├── app.js

├── server.js

├── seed-books.js

├── test-token.js

├── utils.js

├── package.json

└── .env.example

```

## API Overview

The API is organized into three main resources:

### Users

Base route:

```text

/api/users

```

| Method | Endpoint           | Authentication   |

| ------ | ------------------ | ---------------- |

| POST   | `/register`        | Public           |

| POST   | `/login`           | Public           |

| POST   | `/refresh-token`   | Public           |

| POST   | `/logout`          | Required         |

| PUT    | `/update-info`     | Required + owner |

| PUT    | `/update-progress` | Required         |

### Books

Base route:

```text

/api/books

```

| Method | Endpoint | Authentication    |

| ------ | -------- | ----------------- |

| GET    | `/`      | Public            |

| GET    | `/:id`   | Required + access |

| POST   | `/`      | Required + admin  |

| PUT    | `/:id`   | Required + admin  |

| DELETE | `/:id`   | Required + admin  |

The collection endpoint supports:
* Search
* Pagination
* Sorting
* Category filtering
* Series filtering

### Orders

Base route:

```text

/api/orders

```

All order routes require authentication.

| Method | Endpoint      | Authorization     |

| ------ | ------------- | ----------------- |

| GET    | `/`           | Admin             |

| GET    | `/:id`        | Authenticated     |

| POST   | `/`           | Authenticated     |

| PUT    | `/:id/status` | Admin             |

| DELETE | `/:id`        | Access-controlled |

| PUT    | `/:id/return` | Authenticated     |

## Authentication

Protected endpoints use a JWT access token in the `Authorization` header:

```text

Authorization: Bearer <access-token>

```

JWT signing uses the `JWT_SECRET` environment variable.

## Environment Variables

Create a local `.env` file based on `.env.example`:

```env

MONGO_ATLAS_URI=

JWT_SECRET=

NODE_ENV=development

```

**Never commit your `.env` file or real credentials to the repository.**

## Getting Started

### 1. Clone the repository

```bash

git clone https://github.com/bassant-hh/Node-Group-Project.git

cd Node-Group-Project

```

### 2. Install dependencies

```bash

npm install

```

### 3. Configure environment variables

Create `.env` and provide your MongoDB connection string and JWT secret.

### 4. Start the server

```bash

npm start

```

The API starts on:

```text

http://localhost:3000

```

## Testing JWT Authentication

The project includes a small utility for generating and verifying a JWT using the configured local secret:

```bash

node test-token.js

```

The generated token can be used with API clients such as Postman or Insomnia when testing protected endpoints.

## Architecture

The backend follows a modular structure separating the main responsibilities:

```text

Routes

     ↓

Middleware

     ↓

Controllers

     ↓

Services

     ↓

Models

     ↓

MongoDB

```
* **Routes** define API endpoints and middleware chains.
* **Middleware** handles authentication, authorization, validation, pagination, sorting, and errors.
* **Controllers** handle HTTP requests and responses.
* **Services** contain reusable business logic for supported resources.
* **Models** define MongoDB/Mongoose schemas.
* **Config** contains database connection configuration.

## Development Notes

This repository represents a team training project developed as part of an ITI software development program.

The codebase contains several features and implementation experiments developed throughout the project lifecycle. Some legacy or experimental files and branches are intentionally preserved as part of the original Git history.

The repository is primarily intended for **learning, portfolio demonstration, and code review** rather than production deployment.

## License

This project is provided for educational and portfolio purposes.
