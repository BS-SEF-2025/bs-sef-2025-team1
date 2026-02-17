# Backend System -- Node.js + TypeScript + Firebase

## Overview

This project is a RESTful Backend API built with **Node.js** and
**TypeScript**.\
It follows a modular, domain-driven layered architecture and uses
**Firebase Firestore** as the database.

The system includes:

- JWT-based Authentication & Authorization
- Secure password hashing (bcrypt)
- Structured validation using Zod
- Logging system (Winston)
- Domain-based entity modules
- Firebase Firestore integration
- Unit testing with Jest
- Firebase Emulator support

The project is designed for scalability, maintainability, and clean
separation of concerns.

---

# Architecture

The system follows a layered architecture:

Client\
│\
▼\
Express Router\
│\
▼\
Middleware (Auth / Validation)\
│\
▼\
Handlers (Business Logic)\
│\
▼\
Services\
│\
▼\
DAL (Data Access Layer)\
│\
▼\
Firebase Firestore

Each domain entity is self-contained with its own DAL, router, handler,
and schema.

---

# Main Technologies

- Node.js
- TypeScript
- Express 5
- Firebase Admin SDK (Firestore)
- JSON Web Token (JWT)
- bcryptjs
- Zod (Validation)
- Winston (Logging)
- Jest (Testing)
- Firebase Emulator

---

# Project Structure

    src/
    │
    ├── entities/
    │   ├── Assignment/
    │   │   ├── dal.ts
    │   │   ├── handlers.ts
    │   │   ├── router.ts
    │   │   └── schema.ts
    │   │
    │   ├── Course/
    │   │   ├── dal.ts
    │   │   ├── handlers.ts
    │   │   ├── router.ts
    │   │   └── schema.ts
    │   │
    │   ├── Group/
    │   │   ├── dal.ts
    │   │   ├── handlers.ts
    │   │   ├── router.ts
    │   │   └── schema.ts
    │   │
    │   ├── Submission/
    │   │   ├── dal.ts
    │   │   ├── handlers.ts
    │   │   ├── router.ts
    │   │   └── schema.ts
    │   │
    │   └── User/
    │       ├── dal.ts
    │       ├── handlers.ts
    │       ├── router.ts
    │       └── schema.ts
    │
    ├── services/
    │   ├── __tests__/
    │   │
    │   ├── auth/
    │   │   ├── AuthService.ts
    │   │   ├── handlers.ts
    │   │   ├── middleware.ts
    │   │   └── router.ts
    │   │
    │   ├── statistics/
    │   │   ├── handlers.ts
    │   │   ├── router.ts
    │   │   └── schema.ts
    │   │
    │   ├── firbase.ts
    │   ├── System.ts
    │   ├── server.ts
    │   └── types.ts
    │
    ├── utils/
    │   ├── errors/
    │   │   ├── client.ts
    │   │   ├── server.ts
    │   │   └── types.ts
    │   │
    │   ├── firestore.utils.ts
    │   ├── logger.ts
    │   ├── middlewares.ts
    │   ├── transformars.ts
    │   ├── types.ts
    │   └── validation.ts
    │
    ├── config.ts
    ├── index.ts
    └── firebase.json

---

# Structure Explanation

## entities/

Each domain entity (Assignment, Course, Group, Submission, User) follows
the same internal structure:

- **dal.ts** -- Handles Firestore database operations\
- **handlers.ts** -- Contains business logic\
- **router.ts** -- Defines API endpoints\
- **schema.ts** -- Zod validation schemas

This ensures modularity and consistency across domains.

## services/

- **auth/** -- Authentication module (JWT generation, password
  hashing, auth middleware)
- **statistics/** -- Statistics-related endpoints
- **System.ts** -- System-level coordination
- **server.ts** -- Express app initialization
- **firbase.ts** -- Firebase Admin initialization
- \***\*tests**/\*\* -- Unit and integration tests

## utils/

- **errors/** -- Centralized error definitions
- **firestore.utils.ts** -- Firestore helper utilities
- **logger.ts** -- Winston logger configuration
- **middlewares.ts** -- Global middlewares
- **transformars.ts** -- DTO ↔ Entity transformers
- **validation.ts** -- Validation helpers
- **types.ts** -- Shared type definitions

---

# Prerequisites

Before running the project, ensure you have:

- Node.js v18 or higher
- npm
- Firebase CLI installed
- A Firebase project created
- A Firebase service account JSON file

---

# Installation

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your_secret_key

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

# Running the Project

## Build

```bash
npm run build
```

## Start

```bash
npm run start
```

## Development Mode

```bash
npm run start:dev
```

---

# Running Tests (with Firebase Emulator)

```bash
npm run test:emulator
```

---

# Authentication & Authorization

- Passwords are hashed using bcrypt.
- JWT is used to generate access tokens.
- Protected routes require a valid Authorization header.
- Authentication logic is isolated inside `AuthService`.
- Authorization is enforced via middleware.

---

# Database

The system uses **Firebase Firestore**.

All database access is abstracted through the DAL layer to:

- Maintain clean architecture
- Improve testability
- Enable future database replacement

---

# Logging

Winston is used for:

- Error logging
- Informational logs
- Debug-level logging

---

# Validation

All incoming requests are validated using **Zod schemas** before
reaching business logic.

This ensures:

- Data integrity
- Type safety
- Early error detection

---

# Design Principles

- Separation of Concerns
- Modular Domain Design
- Layered Architecture
- Middleware Pattern
- DTO / Transformer Pattern
- Centralized Error Handling
