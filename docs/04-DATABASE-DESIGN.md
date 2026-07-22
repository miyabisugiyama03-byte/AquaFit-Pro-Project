# Database Design

## Overview

AquaFit Pro uses a relational database structure implemented using PostgreSQL and Prisma ORM. The main entities within the system are User, Course, Block, and Booking. These entities are connected through foreign key relationships to support authentication, scheduling, bookings, payments, and role-based access control.

--- 

## User Table

Stores registered users, authentication details, user roles, and member credit balances.

| Field              | Type     | Description                         |
| ------------------ | -------- | ----------------------------------- |
| id                 | Integer  | Primary key                         |
| email              | String   | Unique user email address           |
| passwordHash       | String   | Securely hashed password            |
| role               | Enum     | MEMBER, INSTRUCTOR, ADMIN           |
| creditBalanceCents | Integer  | User credit balance stored in cents |
| createdAt          | DateTime | Account creation timestamp          |

---

## Course Table

Stores core course information.

| Field        | Type     | Description                |
| ------------ | -------- | -------------------------- |
| id           | Integer  | Primary key                |
| title        | String   | Course title               |
| description  | String   | Course description         |
| capacity     | Integer  | Maximum booking capacity   |
| instructorId | Integer  | Foreign key linked to User |
| isActive     | Boolean  | Used for soft deletion     |
| createdAt    | DateTime | Course creation timestamp  |

---

## Block Table

Stores scheduled course blocks and session details.

| Field           | Type     | Description                               |
| --------------- | -------- | ----------------------------------------- |
| id              | Integer  | Primary key                               |
| courseId        | Integer  | Foreign key linked to Course              |
| startDate       | DateTime | Block start date                          |
| endDate         | DateTime | Block end date                            |
| dayOfWeek       | String   | Scheduled day                             |
| time            | String   | Scheduled time                            |
| skillLevel      | Enum     | BEGINNER, IMPROVER, DEVELOPMENT, ADVANCED |
| sessionsPerWeek | Enum     | ONE or TWO                                |
| isActive        | Boolean  | Used for soft deletion                    |

---

## Booking Table

Stores user bookings for scheduled blocks.

| Field     | Type     | Description                 |
| --------- | -------- | --------------------------- |
| id        | Integer  | Primary key                 |
| userId    | Integer  | Foreign key linked to User  |
| blockId   | Integer  | Foreign key linked to Block |
| status    | Enum     | PENDING, PAID, CANCELLED    |
| createdAt | DateTime | Booking creation timestamp  |

---

## Main Relationships

| Relationship      | Description                            |
| ----------------- | -------------------------------------- |
| User → Courses    | One instructor can manage many courses |
| Course → Blocks   | One course can contain many blocks     |
| User → Bookings   | One member can create many bookings    |
| Block → Bookings  | One block can contain many bookings    |
| Booking → Payment | A booking is paid through Stripe       |

---

## Enums

**Role**
* MEMBER
* INSTRUCTOR
* ADMIN

**BookingStatus**
* PENDING
* PAID
* CANCELLED

**SkillLevel**
* BEGINNER
* IMPROVER
* DEVELOPMENT
* ADVANCED

**SessionsPerWeek**
* ONE
* TWO



