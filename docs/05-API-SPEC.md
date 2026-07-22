# API Specification v1.0

**Base URL:** `http://localhost:3000/api` (Dev)
**Authentication:** Bearer Token (JWT) required for protected endpoints.

---
## Authentication

| Method | Endpoint         | Access        | Description                              |
| ------ | ---------------- | ------------- | ---------------------------------------- |
| POST   | `/auth/register` | Public        | Register a new member account.           |
| POST   | `/auth/login`    | Public        | Authenticate user and return JWT token.  |
| GET    | `/auth/me`       | Authenticated | Return currently logged-in user details. |

---

## Courses 


| Method | Endpoint       | Access             | Description                                 |
| ------ | -------------- | ------------------ | ------------------------------------------- |
| GET    | `/courses`     | Public             | List all active courses and related blocks. |
| GET    | `/courses/:id` | Public             | Get details for a specific course.          |
| POST   | `/courses`     | Admin / Instructor | Create a new course.                        |
| PATCH  | `/courses/:id` | Admin / Instructor | Update course details.                      |
| DELETE | `/courses/:id` | Admin / Instructor | Soft delete or deactivate a course.         |

---

## Bookings

| Method | Endpoint                   | Access             | Description                          |
| ------ | -------------------------- | ------------------ | ------------------------------------ |
| POST   | `/bookings/:blockId`       | Member             | Create a booking for a course block. |
| GET    | `/bookings/me`             | Member             | View current user bookings.          |
| DELETE | `/bookings/:blockId`       | Member             | Cancel a booking for a block.        |
| GET    | `/bookings/block/:blockId` | Admin / Instructor | View bookings for a specific block.  |

---

## Blocks

| Method | Endpoint                   | Access             | Description                                 |
| ------ | -------------------------- | ------------------ | ------------------------------------------- |
| GET    | `/blocks`                  | Public             | List all active course blocks.              |
| GET    | `/blocks/:id`              | Public             | Get details for a specific block.           |
| GET    | `/blocks/course/:courseId` | Public             | List blocks belonging to a specific course. |
| POST   | `/blocks`                  | Admin / Instructor | Create a new scheduled block.               |
| PATCH  | `/blocks/:id`              | Admin / Instructor | Update block schedule or details.           |
| DELETE | `/blocks/:id`              | Admin / Instructor | Soft delete or deactivate a block.          |

---

## Users

| Method | Endpoint            | Access | Description                     |
| ------ | ------------------- | ------ | ------------------------------- |
| GET    | `/users`            | Admin  | List all users.                 |
| PATCH  | `/users/:id/role`   | Admin  | Update a user role.             |
| PATCH  | `/users/:id/credit` | Admin  | Add credit to a member account. |


---

## Payments

| Method | Endpoint                        | Access | Description                                              |
| ------ | ------------------------------- | ------ | -------------------------------------------------------- |
| POST   | `/payments/checkout/:bookingId` | Member | Create a Stripe checkout session.                        |
| POST   | `/payments/webhook`             | Stripe | Receive Stripe webhook events and update booking status. |

---

## Status Codes
* **200 OK:** Success.
* **201 Created:** Resource successfully created.
* **400 Bad Request:** Missing fields or validation error.
* **401 Unauthorized:** Missing or invalid JWT.
* **403 Forbidden:** User does not have the required Role.
