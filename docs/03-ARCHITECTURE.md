# System Architecture

## 1. High-Level Overview
AquaFit Pro follows a modular monolithic RESTful architecture designed to separate frontend presentation, backend business logic, and database management into clearly defined layers. The system uses a full-stack TypeScript and JavaScript-based architecture consisting of a React frontend, a NestJS backend, PostgreSQL database storage, and Stripe payment integration.

The frontend communicates with the backend through REST API endpoints, while the backend handles authentication, business logic, validation, booking management, and payment processing. PostgreSQL is used as the primary relational database and Prisma ORM manages database interaction and entity relationships.

This modular structure improves maintainability, scalability, and separation of concerns, allowing features to be developed and tested independently throughout the project lifecycle.

### Tech Stack

| Component      | Technology         | Reasoning                                                                                                           |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Frontend       | React + TypeScript | Component-based frontend framework supporting reusable UI development and dynamic state management.                 |
| Backend        | NestJS (Node.js)   | Provides a modular architecture using controllers, services, dependency injection, and RESTful API design patterns. |
| Database       | PostgreSQL         | Relational database system suitable for structured booking, course, and payment data.                               |
| ORM            | Prisma ORM         | Provides type-safe database queries and simplifies relational data management.                                      |
| Authentication | Passport.js + JWT  | Secure authentication and role-based access control using token-based sessions.                                     |
| Payments       | Stripe             | Secure third-party payment processing and webhook integration.                                                      |
| Styling        | Tailwind CSS       | Utility-first CSS framework used for responsive and reusable frontend styling.                                      |
| API Testing    | Swagger + Postman  | Used to validate API endpoints, request handling, and authentication behaviour.                                     |


---

## 2. System Context Overview

The AquaFit Pro system consists of three primary layers:

1. React Frontend
* Handles user interaction, dashboards, course browsing, booking workflows, and payment redirection.
2. NestJS Backend API
* Processes authentication, business logic, bookings, validation, role management, and payment handling.
3. PostgreSQL Database 
* Stores users, courses, blocks, bookings, and payment-related data using relational structures.

Stripe is integrated externally for secure payment processing and webhook-based payment confirmation.

## 3. Back end Architecture - NestJS

The backend follows a layered architecture using NestJS modules, controllers, services, and repositories. This structure separates request handling, business logic, and database operations to improve maintainability and scalability.

Each feature typically follows the flow below:

### Controller Layer
 Controllers handle incoming HTTP requests from the frontend and route them to the correct service methods.

 Responsibilities include:
 * Receiving API requests
 * Validating request data
 * Handling route protection using authentication guards
 * Returning API responses

Example:
A member submits a booking request through the frontend dashboard.

### Service Layer
Services contain the main business logic of the application.

Responsibilities include:
* Capacity Validation
* Booking lifecycle management
* Payment and credit calculations
* Authentication and role validation
* Error handling

Example:
The booking service verifies that a block has remaining capacity and checks whether the user already has an existing booking.

### Repository / Database Layer
The repository layer communicates directly with PostgreSQL through Prisma ORM.

Responsibilities include:
* Creating and updating records
* Fetching relational data
* Managing entity relationships
* Performing database queries

Example:
A successful booking request inserts a new booking record linked to both the user and the selected block.

---

### Project Modules
The backend is separated into modular feature areas to improve scalability and maintainability.

#### Auth Module
Handles:
* User Authentication
* JWT generation and validation
* Password hashing
* protected route access

#### Users Module
Handles:
* User management
* Role assignment
* Credit balance management
* Protected route access

#### Courses Module
Handles:
* Course creation and management
* Instructor assignment
* Course retrieval and updates

#### Blocks Module
Handles:
* Scheduled course blocks
* Skill levels
* Session frequency
* Capacity and pricing logic

#### Booking Module
Handles:
* Booking creation and cancellation
* Booking lifecycle states
* Duplicate booking prevention
* Capacity enforcement

#### Payments Module
Handles:
* Stripe checkout sessions
* Payment confirmation
* Webhook processing
* Booking payment updates


---

### Security & Access Control

AquaFit Pro implements JWT-based authentication and Role-Based Access Control (RBAC) to protect sensitive functionality and user data.

Access levels include:

| Access Level | Permissions                                             |
| ------------ | ------------------------------------------------------- |
| Public       | View courses and general information                    |
| Member       | Create bookings, manage payments, view dashboards       |
| Instructor   | Manage courses and view booking information             |
| Admin        | Manage users, courses, blocks, and system functionality |


### Design Decision: Why NestJS over Spring Boot?

While Spring Boot (Java) is a standard for enterprise backends, we selected **NestJS (Probably in TypeScript)** for this project.

- *1. Architectural Parity*

The project brief requires a "scalable system architecture" and "competence in full-stack development". NestJS is heavily inspired by Spring Boot. It enforces the exact same **Dependency Injection**, **Module-based structure**, and **Decorator patterns** that make Spring Boot robust.
* *Result:* We achieve the same enterprise-grade structure required for the assignment, but in a modern Technology, That is super popular at the moment. (I also really didn't want to use java)

- *2. Unified Language (TypeScript)*
Our frontend is built in **React**, which uses JavaScript/TypeScript.
* **With Spring Boot:** We would need to context-switch between Java (Backend) and TypeScript (Frontend). We would also have to manually duplicate data models (e.g., creating a `User` class in Java and a `User` interface in TypeScript).
* **With NestJS:** We use **TypeScript Or Javascript** across the entire stack. We can share "Type Interfaces" between backend and frontend.
* *Benefit:* This significantly reduces bugs where the backend sends data the frontend doesn't expect, speeding up development.

- *3. Rapid Development of RESTful Features*
NestJS is built specifically for RESTful architectures. Its ecosystem (Passport for Auth, TypeORM for Database) allows us to implement complex requirements like **Role-Based Access Control (RBAC)** and **Webhooks** more efficiently than the verbose configuration often required in Java/Spring.

## 4. Frontend Architecture (React)

The frontend follows a Component-Based Architecture using React. The goal is tos separate UI rendering, state management, and API communication, ensuring maintainability and scalability.
Structure Overview

The frontend is organised into logical layers:

1.  **Pages**

* Represent full screens (e.g., Schedule, Login, Dashboard).
* Responsible for layout and calling backend services.
* Connected to routes using React Router.

2.  **Components**

* Reusable UI elements (e.g., CourseCard, BookingButton, Navbar).
* Stateless where possible, receiving data via props.
* Promote consistency and reduce duplication.

3. **Services (API Layer)**

* Centralised functions for HTTP requests (e.g., /courses, /bookings, /auth).
* Automatically attach JWT tokens to secure requests.
* Keeps networking logic separate from UI logic.

4. **State Management**

* Local state (useState) for forms and UI controls.
* Global authentication state managed via Context.
* Server data fetched from the backend and updated after mutations (e.g., booking creation).



## 5. Key Workflows

This Section explains the life cycle of the most important features.
Use this to understand how the Frontend and backend communicate.

### Workflow A: Booking Workflow

1. Member selects a course block through the frontend
2. Frontend sends a booking request to the backend API
3. Backend validates
   - Blocks existence
   - Remaining capacity
   - Duplicate bookings
4. If validation success, a booking record is created 
5. Frontend updates dynamically with booking confirmation
  

### Workflow B: Course Creation

1. Instructor fills out the "add course" form. Name, date, capacity, whatever else
2. Frontend validates inputs (no funky symbols,capacity cant be negative, ect)
3. Frontend sends POST to '/courses'
4. Backend recieves the data (DTO)
5. Backend converts the date string into a real data object 
6. Backend saves the new course to the database 
7. The new course is immediately availible to be fetched by all users

### Workflow C: User Authentication

1. User enters Email and Password on the Login screen
2. Frontend sends POST to '/auth/login'
3. Backend looks up the user in the database 
4. Backend hashes the entered password and compares it to stored entries.
5. If match: backend generates a JWT 
6. backend sends the token back to the frontend
7. Frontend stores the token (in memory or cookies)
8. For all future requests, the frontend will attach the token to that user/session

### Workflow D: Payment Workflow
 
1. Member selects "Pay Now" for a pending booking
2. Backend creates a Stripe checkout session
3. User completes payment through Stripe
4. Stripe sends webhook confirmation to the backend
5. Backend updates booking status to PAID
6. Frontend refreshes booking information



