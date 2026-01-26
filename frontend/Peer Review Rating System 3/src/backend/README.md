# AmiTeam Backend API

Backend API for AmiTeam - Academic Peer Review System built with Express.js and TypeScript.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (Staff & Students)
- 📚 Course Management
- 👫 Group Management
- 📝 Assignment Management with Dynamic Fields
- ✅ Submission Management with Score Calculation
- 📊 Statistics and Reporting
- ✨ Business Rules Validation
- 🛡️ Security (Helmet, CORS, Rate Limiting)
- 📝 Comprehensive Logging
- ✅ Unit Tests with Jest

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston, Morgan
- **Testing**: Jest, Supertest
- **Database**: In-Memory (Demo) - Ready for PostgreSQL/MongoDB

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

### Running the Server

**Development mode with auto-reload:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Courses
- `POST /api/courses` - Create course (Staff only)
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course (Staff only)
- `DELETE /api/courses/:id` - Delete course (Staff only)

### Groups
- `POST /api/groups` - Create group (Staff only)
- `GET /api/groups?courseId=xxx` - Get groups (optionally by course)
- `GET /api/groups/:id` - Get group by ID
- `PUT /api/groups/:id` - Update group (Staff only)
- `DELETE /api/groups/:id` - Delete group (Staff only)

### Assignments
- `POST /api/assignments` - Create assignment (Staff only)
- `GET /api/assignments?courseId=xxx` - Get assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `PUT /api/assignments/:id` - Update assignment (Staff only)
- `DELETE /api/assignments/:id` - Delete assignment (Staff only)

### Submissions
- `POST /api/submissions` - Create submission (Student only)
- `GET /api/submissions?assignmentId=xxx&studentId=yyy&reviewedGroupId=zzz` - Get submissions with filters
- `GET /api/submissions/stats/:assignmentId` - Get statistics (Staff only)
- `GET /api/submissions/:id` - Get submission by ID
- `DELETE /api/submissions/:id` - Delete submission

### Health Check
- `GET /api/health` - Health check endpoint

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Getting a Token

1. Register or login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "michal.cohen@university.ac.il",
    "password": "password123"
  }'
```

2. Use the returned token in subsequent requests.

## Business Rules

### Field Types
1. **Criterion** (קריטריון):
   - Always required (`required: true`)
   - Must be scale type (`type: 'scale'`)
   - Weight must be > 0
   - Has `scaleMin` and `scaleMax`

2. **Feedback** (פידבק):
   - Can be required or optional
   - Weight is always 0 (`weight: 0`)
   - Can be text or scale type

### Field Weight Rules
- At least one criterion is required per assignment
- Sum of all criterion weights must equal 100%
- Feedback fields don't contribute to the score

### Deadline Rules
- Submissions cannot be made after the deadline has passed
- Students can delete their own submissions only before the deadline

### Review Rules
- Students cannot review their own group
- Students can only review groups from the same course
- Only students enrolled in a course can submit reviews

## Project Structure

```
backend/
├── src/
│   ├── __tests__/          # Unit tests
│   ├── config/             # Configuration files
│   │   └── database.ts     # In-memory database (demo)
│   ├── controllers/        # Route controllers
│   │   ├── authController.ts
│   │   ├── courseController.ts
│   │   ├── groupController.ts
│   │   ├── assignmentController.ts
│   │   └── submissionController.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts         # JWT authentication
│   │   └── errorHandler.ts # Error handling
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── course.routes.ts
│   │   ├── group.routes.ts
│   │   ├── assignment.routes.ts
│   │   ├── submission.routes.ts
│   │   └── index.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── logger.ts       # Winston logger
│   │   └── validators.ts   # Joi schemas & validators
│   └── server.ts           # Express app entry point
├── .env.example            # Environment variables template
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Demo Users

The in-memory database is seeded with demo users:

### Staff
- Email: `michal.cohen@university.ac.il` | Password: `password123`
- Email: `david.levi@university.ac.il` | Password: `password123`

### Students
- Email: `yossi.a@student.ac.il` | Password: `password123`
- Email: `sara.c@student.ac.il` | Password: `password123`
- Email: `dani.l@student.ac.il` | Password: `password123`
- Email: `ronit.m@student.ac.il` | Password: `password123`
- Email: `omer.i@student.ac.il` | Password: `password123`
- Email: `noa.b@student.ac.il` | Password: `password123`
- Email: `uri.g@student.ac.il` | Password: `password123`
- Email: `tamar.s@student.ac.il` | Password: `password123`

## Migration to Real Database

The current implementation uses an in-memory database for demo purposes. To migrate to a real database:

### Option 1: PostgreSQL with Prisma

1. Install Prisma:
```bash
npm install @prisma/client
npm install -D prisma
```

2. Initialize Prisma:
```bash
npx prisma init
```

3. Define your schema in `prisma/schema.prisma`

4. Replace `src/config/database.ts` with Prisma client

### Option 2: MongoDB with Mongoose

1. Install Mongoose:
```bash
npm install mongoose
npm install -D @types/mongoose
```

2. Create models in `src/models/`

3. Replace `src/config/database.ts` with Mongoose connection

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Logging

Logs are written to:
- Console (all levels in development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

Log levels: `error`, `warn`, `info`, `debug`

## Security Features

- **Helmet**: Sets security HTTP headers
- **CORS**: Configured for specific origin
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT**: Token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schemas for all inputs

## Contributing

1. Follow TypeScript and ESLint rules
2. Write unit tests for new features
3. Update API documentation
4. Use conventional commits

## License

ISC
