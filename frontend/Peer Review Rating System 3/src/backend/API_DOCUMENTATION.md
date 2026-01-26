# AmiTeam Complete API Documentation

Complete API reference with TypeScript types for the AmiTeam system.

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Type Definitions](#type-definitions)
3. [Authentication](#authentication)
4. [Courses API](#courses-api)
5. [Groups API](#groups-api)
6. [Assignments API](#assignments-api)
7. [Submissions API](#submissions-api)
8. [Error Handling](#error-handling)
9. [Usage Examples](#usage-examples)

---

## Base Configuration

### URLs

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP address
- **Response on exceed:** 429 Too Many Requests

---

## Type Definitions

### Core Types

```typescript
// User Types
export type UserRole = 'staff' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed (not returned in responses)
  role: UserRole;
  groupId?: string; // For students - which group they belong to
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  groupId?: string;
}

// Field Types
export type FieldType = 'text' | 'scale';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  weight: number; // 0 for feedback, >0 for criteria (total must equal 100)
  scaleMin?: number; // for scale type (default: 1)
  scaleMax?: number; // for scale type (default: 10)
  description?: string;
}

// Course Model
export interface Course {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  enrolledStudents: string[]; // User IDs
  createdBy: string; // Staff user ID
}

// Group Model
export interface Group {
  id: string;
  name: string;
  courseId: string;
  members: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

// Assignment Model
export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  deadline: Date;
  fields: Field[];
  shareableLink: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Staff user ID
}

// Submission Models
export interface SubmissionAnswer {
  fieldId: string;
  value: string | number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string; // User ID of submitter
  reviewedGroupId: string; // The group being reviewed
  answers: SubmissionAnswer[];
  calculatedScore: number; // Automatically calculated based on weights
  submittedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Query Parameter Types
export interface SubmissionQuery {
  assignmentId?: string;
  studentId?: string;
  reviewedGroupId?: string;
  courseId?: string;
}

export interface AssignmentQuery {
  courseId?: string;
  createdBy?: string;
}
```

---

## Authentication

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`  
**Access:** Public

**Request Body:**
```typescript
{
  name: string;
  email: string;
  password: string;
  role: UserRole; // 'staff' | 'student'
  groupId?: string; // Required for students
}
```

**Example Request:**
```json
{
  "name": "יוסי אברהם",
  "email": "yossi@student.ac.il",
  "password": "password123",
  "role": "student",
  "groupId": "g1"
}
```

**Response:** `201 Created`
```typescript
ApiResponse<{
  user: UserResponse;
  token: string;
}>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "יוסי אברהם",
      "email": "yossi@student.ac.il",
      "role": "student",
      "groupId": "g1"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- `name`: Required, string, 2-100 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- `role`: Required, must be 'staff' or 'student'
- `groupId`: Optional for staff, recommended for students

**Errors:**
- `400` - Validation error
- `409` - Email already exists

---

### Login User

Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`  
**Access:** Public

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Example Request:**
```json
{
  "email": "michal.cohen@university.ac.il",
  "password": "password123"
}
```

**Response:** `200 OK`
```typescript
ApiResponse<{
  user: UserResponse;
  token: string;
}>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "u1",
      "name": "ד\"ר מיכל כהן",
      "email": "michal.cohen@university.ac.il",
      "role": "staff",
      "groupId": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Invalid email or password
- `404` - User not found

---

### Get Current User

Get authenticated user's information.

**Endpoint:** `GET /api/auth/me`  
**Access:** Private (requires JWT token)

**Headers:**
```http
Authorization: Bearer <jwt-token>
```

**Response:** `200 OK`
```typescript
ApiResponse<UserResponse>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "u1",
    "name": "ד\"ר מיכל כהן",
    "email": "michal.cohen@university.ac.il",
    "role": "staff",
    "groupId": null
  }
}
```

**Errors:**
- `401` - Invalid or expired token
- `404` - User not found

---

## Courses API

### Create Course

Create a new course.

**Endpoint:** `POST /api/courses`  
**Access:** Staff only

**Request Body:**
```typescript
{
  name: string;
  enrolledStudents?: string[]; // Array of user IDs
}
```

**Example Request:**
```json
{
  "name": "פיתוח אפליקציות Web",
  "enrolledStudents": ["u3", "u4", "u5"]
}
```

**Response:** `201 Created`
```typescript
ApiResponse<Course>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "c1",
    "name": "פיתוח אפליקציות Web",
    "enrolledStudents": ["u3", "u4", "u5"],
    "createdBy": "u1",
    "createdAt": "2024-01-24T10:00:00.000Z",
    "updatedAt": "2024-01-24T10:00:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: Required, string, 2-200 characters
- `enrolledStudents`: Optional, array of valid user IDs

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Must be staff member

---

### Get All Courses

Get all courses based on user role.

**Endpoint:** `GET /api/courses`  
**Access:** Private

**Query Parameters:** None

**Response:** `200 OK`
```typescript
ApiResponse<Course[]>
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "c1",
      "name": "פיתוח אפליקציות Web",
      "enrolledStudents": ["u3", "u4", "u5"],
      "createdBy": "u1",
      "createdAt": "2024-01-24T10:00:00.000Z",
      "updatedAt": "2024-01-24T10:00:00.000Z"
    }
  ]
}
```

**Access Control:**
- Staff: See all courses they created
- Students: See courses they're enrolled in

---

### Get Course by ID

Get a specific course.

**Endpoint:** `GET /api/courses/:id`  
**Access:** Private

**URL Parameters:**
- `id` - Course ID

**Response:** `200 OK`
```typescript
ApiResponse<Course>
```

**Errors:**
- `401` - Unauthorized
- `403` - No access to this course
- `404` - Course not found

---

### Update Course

Update course details.

**Endpoint:** `PUT /api/courses/:id`  
**Access:** Staff only (creator)

**URL Parameters:**
- `id` - Course ID

**Request Body:**
```typescript
{
  name?: string;
  enrolledStudents?: string[];
}
```

**Example Request:**
```json
{
  "name": "פיתוח אפליקציות Web מתקדם",
  "enrolledStudents": ["u3", "u4", "u5", "u6"]
}
```

**Response:** `200 OK`
```typescript
ApiResponse<Course>
```

**Errors:**
- `401` - Unauthorized
- `403` - Only course creator can update
- `404` - Course not found

---

### Delete Course

Delete a course (cascades to groups, assignments, submissions).

**Endpoint:** `DELETE /api/courses/:id`  
**Access:** Staff only (creator)

**URL Parameters:**
- `id` - Course ID

**Response:** `204 No Content`

**Errors:**
- `401` - Unauthorized
- `403` - Only course creator can delete
- `404` - Course not found

---

## Groups API

### Create Group

Create a new group in a course.

**Endpoint:** `POST /api/groups`  
**Access:** Staff only

**Request Body:**
```typescript
{
  name: string;
  courseId: string;
  members?: string[]; // Array of user IDs
}
```

**Example Request:**
```json
{
  "name": "קבוצה 1",
  "courseId": "c1",
  "members": ["u3", "u4"]
}
```

**Response:** `201 Created`
```typescript
ApiResponse<Group>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "g1",
    "name": "קבוצה 1",
    "courseId": "c1",
    "members": ["u3", "u4"],
    "createdAt": "2024-01-24T10:00:00.000Z",
    "updatedAt": "2024-01-24T10:00:00.000Z"
  }
}
```

**Validation Rules:**
- `name`: Required, string, 2-100 characters
- `courseId`: Required, valid course ID
- `members`: Optional, array of valid user IDs

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Must be staff member
- `404` - Course not found

---

### Get All Groups

Get groups, optionally filtered by course.

**Endpoint:** `GET /api/groups`  
**Access:** Private

**Query Parameters:**
```typescript
{
  courseId?: string; // Optional filter by course
}
```

**Example Request:**
```
GET /api/groups?courseId=c1
```

**Response:** `200 OK`
```typescript
ApiResponse<Group[]>
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "g1",
      "name": "קבוצה 1",
      "courseId": "c1",
      "members": ["u3", "u4"],
      "createdAt": "2024-01-24T10:00:00.000Z",
      "updatedAt": "2024-01-24T10:00:00.000Z"
    }
  ]
}
```

---

### Get Group by ID

Get a specific group.

**Endpoint:** `GET /api/groups/:id`  
**Access:** Private

**URL Parameters:**
- `id` - Group ID

**Response:** `200 OK`
```typescript
ApiResponse<Group>
```

**Errors:**
- `401` - Unauthorized
- `404` - Group not found

---

### Update Group

Update group details or members.

**Endpoint:** `PUT /api/groups/:id`  
**Access:** Staff only

**URL Parameters:**
- `id` - Group ID

**Request Body:**
```typescript
{
  name?: string;
  members?: string[];
}
```

**Example Request:**
```json
{
  "name": "קבוצה 1 - מעודכן",
  "members": ["u3", "u4", "u5"]
}
```

**Response:** `200 OK`
```typescript
ApiResponse<Group>
```

**Errors:**
- `401` - Unauthorized
- `403` - Must be staff member
- `404` - Group not found

---

### Delete Group

Delete a group (cascades to submissions).

**Endpoint:** `DELETE /api/groups/:id`  
**Access:** Staff only

**URL Parameters:**
- `id` - Group ID

**Response:** `204 No Content`

**Errors:**
- `401` - Unauthorized
- `403` - Must be staff member
- `404` - Group not found

---

## Assignments API

### Create Assignment

Create a new assignment with dynamic fields.

**Endpoint:** `POST /api/assignments`  
**Access:** Staff only

**Request Body:**
```typescript
{
  title: string;
  description: string;
  courseId: string;
  deadline: Date | string; // ISO 8601 format
  fields: Field[];
}
```

**Example Request:**
```json
{
  "title": "ביקורת פרויקט גמר",
  "description": "הערכה של פרויקטי גמר של קבוצות אחרות",
  "courseId": "c1",
  "deadline": "2024-02-01T23:59:59.000Z",
  "fields": [
    {
      "name": "איכות קוד",
      "type": "scale",
      "required": true,
      "weight": 30,
      "scaleMin": 1,
      "scaleMax": 10,
      "description": "הערכת איכות הקוד"
    },
    {
      "name": "עיצוב ממשק",
      "type": "scale",
      "required": true,
      "weight": 40,
      "scaleMin": 1,
      "scaleMax": 10
    },
    {
      "name": "חדשנות",
      "type": "scale",
      "required": true,
      "weight": 30,
      "scaleMin": 1,
      "scaleMax": 10
    },
    {
      "name": "הערות",
      "type": "text",
      "required": false,
      "weight": 0,
      "description": "הערות והצעות לשיפור"
    }
  ]
}
```

**Response:** `201 Created`
```typescript
ApiResponse<Assignment>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "a1",
    "title": "ביקורת פרויקט גמר",
    "description": "הערכה של פרויקטי גמר של קבוצות אחרות",
    "courseId": "c1",
    "deadline": "2024-02-01T23:59:59.000Z",
    "fields": [...],
    "shareableLink": "http://localhost:3000?assignment=a1",
    "createdBy": "u1",
    "createdAt": "2024-01-24T10:00:00.000Z",
    "updatedAt": "2024-01-24T10:00:00.000Z"
  }
}
```

**Validation Rules:**
- `title`: Required, string, 2-200 characters
- `description`: Required, string, minimum 10 characters
- `courseId`: Required, valid course ID
- `deadline`: Required, must be in the future
- `fields`: Required, array of Field objects
  - **At least one criterion** (weight > 0) required
  - **Sum of criterion weights must equal 100**
  - All criterions must be type "scale" and required=true
  - All feedback fields must have weight=0
  - Scale fields must have scaleMin and scaleMax

**Errors:**
- `400` - Validation error (e.g., weights don't sum to 100)
- `401` - Unauthorized
- `403` - Must be staff member
- `404` - Course not found

---

### Get All Assignments

Get assignments, optionally filtered by course.

**Endpoint:** `GET /api/assignments`  
**Access:** Private

**Query Parameters:**
```typescript
{
  courseId?: string; // Optional filter by course
}
```

**Example Request:**
```
GET /api/assignments?courseId=c1
```

**Response:** `200 OK`
```typescript
ApiResponse<Assignment[]>
```

**Access Control:**
- Staff: See assignments for their courses
- Students: See assignments for courses they're enrolled in

---

### Get Assignment by ID

Get a specific assignment.

**Endpoint:** `GET /api/assignments/:id`  
**Access:** Private (or Public via shareable link)

**URL Parameters:**
- `id` - Assignment ID

**Response:** `200 OK`
```typescript
ApiResponse<Assignment>
```

**Errors:**
- `401` - Unauthorized (if not using shareable link)
- `404` - Assignment not found

---

### Update Assignment

Update assignment details or fields.

**Endpoint:** `PUT /api/assignments/:id`  
**Access:** Staff only (creator)

**URL Parameters:**
- `id` - Assignment ID

**Request Body:**
```typescript
{
  title?: string;
  description?: string;
  deadline?: Date | string;
  fields?: Field[];
}
```

**Example Request:**
```json
{
  "deadline": "2024-02-15T23:59:59.000Z",
  "fields": [...]
}
```

**Response:** `200 OK`
```typescript
ApiResponse<Assignment>
```

**Validation Rules:**
- Same validation rules as Create Assignment
- Deadline must be in the future

**Errors:**
- `401` - Unauthorized
- `403` - Only assignment creator can update
- `404` - Assignment not found

---

### Delete Assignment

Delete an assignment (cascades to submissions).

**Endpoint:** `DELETE /api/assignments/:id`  
**Access:** Staff only (creator)

**URL Parameters:**
- `id` - Assignment ID

**Response:** `204 No Content`

**Errors:**
- `401` - Unauthorized
- `403` - Only assignment creator can delete
- `404` - Assignment not found

---

## Submissions API

### Create Submission

Submit a review for a group.

**Endpoint:** `POST /api/submissions`  
**Access:** Student only

**Request Body:**
```typescript
{
  assignmentId: string;
  reviewedGroupId: string;
  answers: SubmissionAnswer[]; // { fieldId: string; value: string | number }[]
}
```

**Example Request:**
```json
{
  "assignmentId": "a1",
  "reviewedGroupId": "g2",
  "answers": [
    { "fieldId": "f1", "value": 8 },
    { "fieldId": "f2", "value": 9 },
    { "fieldId": "f3", "value": 7 },
    { "fieldId": "f4", "value": "עבודה מצוינת!" }
  ]
}
```

**Response:** `201 Created`
```typescript
ApiResponse<Submission>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "s1",
    "assignmentId": "a1",
    "studentId": "u3",
    "reviewedGroupId": "g2",
    "answers": [...],
    "calculatedScore": 80,
    "submittedAt": "2024-01-24T10:00:00.000Z"
  }
}
```

**Business Rules Validated:**
- Assignment deadline has not passed
- Student is enrolled in the course
- Student is not reviewing their own group
- All required fields are filled
- Scale values are within min/max range
- Score is calculated automatically based on weights

**Score Calculation:**
```typescript
// Score = Σ(field.value × field.weight / field.scaleMax) for all criteria fields
// Example: (8 * 30 / 10) + (9 * 40 / 10) + (7 * 30 / 10) = 24 + 36 + 21 = 81
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Business rule violation (e.g., deadline passed, reviewing own group)
- `404` - Assignment or group not found

---

### Get All Submissions

Get submissions with optional filters.

**Endpoint:** `GET /api/submissions`  
**Access:** Private

**Query Parameters:**
```typescript
{
  assignmentId?: string;
  studentId?: string;
  reviewedGroupId?: string;
  courseId?: string;
}
```

**Example Request:**
```
GET /api/submissions?assignmentId=a1&studentId=u3
```

**Response:** `200 OK`
```typescript
ApiResponse<Submission[]>
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "s1",
      "assignmentId": "a1",
      "studentId": "u3",
      "reviewedGroupId": "g2",
      "answers": [...],
      "calculatedScore": 80,
      "submittedAt": "2024-01-24T10:00:00.000Z"
    }
  ]
}
```

**Access Control:**
- Students: Can see their own submissions and submissions reviewing their group
- Staff: Can see submissions for their courses

---

### Get Submission by ID

Get a specific submission.

**Endpoint:** `GET /api/submissions/:id`  
**Access:** Private (with access control)

**URL Parameters:**
- `id` - Submission ID

**Response:** `200 OK`
```typescript
ApiResponse<Submission>
```

**Errors:**
- `401` - Unauthorized
- `403` - No access to this submission
- `404` - Submission not found

---

### Get Submission Statistics

Get statistics for an assignment (staff only).

**Endpoint:** `GET /api/submissions/stats/:assignmentId`  
**Access:** Staff only

**URL Parameters:**
- `assignmentId` - Assignment ID

**Response:** `200 OK`
```typescript
ApiResponse<{
  totalSubmissions: number;
  averageScore: number;
  groupStats: Array<{
    groupId: string;
    count: number;
    totalScore: number;
    average: number;
  }>;
}>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalSubmissions": 15,
    "averageScore": 85.5,
    "groupStats": [
      {
        "groupId": "g1",
        "count": 5,
        "totalScore": 430,
        "average": 86
      },
      {
        "groupId": "g2",
        "count": 4,
        "totalScore": 340,
        "average": 85
      }
    ]
  }
}
```

**Errors:**
- `401` - Unauthorized
- `403` - Must be staff member
- `404` - Assignment not found

---

### Update Submission

Update submission answers.

**Endpoint:** `PUT /api/submissions/:id`  
**Access:** Student only (own submission, before deadline)

**URL Parameters:**
- `id` - Submission ID

**Request Body:**
```typescript
{
  answers: SubmissionAnswer[];
}
```

**Example Request:**
```json
{
  "answers": [
    { "fieldId": "f1", "value": 9 },
    { "fieldId": "f2", "value": 10 },
    { "fieldId": "f3", "value": 8 },
    { "fieldId": "f4", "value": "עבודה מעולה!" }
  ]
}
```

**Response:** `200 OK`
```typescript
ApiResponse<Submission>
```

**Business Rules:**
- Can only update own submission
- Deadline must not have passed
- Same validation rules as Create Submission

**Errors:**
- `401` - Unauthorized
- `403` - Deadline passed or not your submission
- `404` - Submission not found

---

### Delete Submission

Delete a submission.

**Endpoint:** `DELETE /api/submissions/:id`  
**Access:** Private (Student before deadline, or Staff)

**URL Parameters:**
- `id` - Submission ID

**Response:** `204 No Content`

**Business Rules:**
- Students: Can only delete their own submissions before deadline
- Staff: Can delete any submission in their courses

**Errors:**
- `401` - Unauthorized
- `403` - Cannot delete (deadline passed or not authorized)
- `404` - Submission not found

---

## Error Handling

### Error Response Format

All errors follow this format:

```typescript
interface ErrorResponse {
  success: false;
  error: string;
}
```

### HTTP Status Codes

| Code | Description | Example |
|------|-------------|---------|
| `400` | Bad Request | Validation error, invalid input |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Insufficient permissions, business rule violation |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |

### Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "error": "\"email\" must be a valid email"
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**Authorization Error (403):**
```json
{
  "success": false,
  "error": "Only the course creator can update it"
}
```

**Business Rule Error (403):**
```json
{
  "success": false,
  "error": "Assignment deadline has passed"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": "Course not found"
}
```

**Conflict (409):**
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

**Rate Limit (429):**
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Usage Examples

### TypeScript Frontend Integration

```typescript
import axios, { AxiosInstance } from 'axios';

// Create API client
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage Examples

// 1. Login
async function login(email: string, password: string) {
  const response = await apiClient.post<ApiResponse<{
    user: UserResponse;
    token: string;
  }>>('/auth/login', { email, password });
  
  localStorage.setItem('authToken', response.data.data.token);
  return response.data.data.user;
}

// 2. Get courses
async function getCourses(): Promise<Course[]> {
  const response = await apiClient.get<ApiResponse<Course[]>>('/courses');
  return response.data.data;
}

// 3. Create assignment
async function createAssignment(data: {
  title: string;
  description: string;
  courseId: string;
  deadline: Date;
  fields: Field[];
}): Promise<Assignment> {
  const response = await apiClient.post<ApiResponse<Assignment>>(
    '/assignments',
    data
  );
  return response.data.data;
}

// 4. Submit review
async function submitReview(data: {
  assignmentId: string;
  reviewedGroupId: string;
  answers: SubmissionAnswer[];
}): Promise<Submission> {
  const response = await apiClient.post<ApiResponse<Submission>>(
    '/submissions',
    data
  );
  return response.data.data;
}

// 5. Get submissions with filters
async function getSubmissions(filters: SubmissionQuery): Promise<Submission[]> {
  const response = await apiClient.get<ApiResponse<Submission[]>>(
    '/submissions',
    { params: filters }
  );
  return response.data.data;
}
```

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "michal.cohen@university.ac.il",
    "password": "password123"
  }'
```

**Create Assignment (with auth):**
```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "ביקורת פרויקט",
    "description": "תיאור המטלה",
    "courseId": "c1",
    "deadline": "2024-12-31T23:59:59.000Z",
    "fields": [
      {
        "name": "איכות",
        "type": "scale",
        "required": true,
        "weight": 100,
        "scaleMin": 1,
        "scaleMax": 10
      }
    ]
  }'
```

**Get Submissions:**
```bash
curl -X GET "http://localhost:5000/api/submissions?assignmentId=a1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### JavaScript/Node.js Examples

```javascript
// Using fetch API
async function loginUser(email, password) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error);
  }
  
  return data.data;
}

// With error handling
async function createCourse(name, enrolledStudents = []) {
  try {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, enrolledStudents }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error);
    }
    
    return data.data;
  } catch (error) {
    console.error('Failed to create course:', error);
    throw error;
  }
}
```

---

## Best Practices

### 1. Token Management

```typescript
// Store token securely
localStorage.setItem('authToken', token);

// Include in all requests
headers: {
  'Authorization': `Bearer ${token}`
}

// Clear on logout
localStorage.removeItem('authToken');
```

### 2. Error Handling

```typescript
try {
  const data = await api.call();
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  } else if (error.response?.status === 403) {
    // Show permission error
  } else {
    // Show general error
  }
}
```

### 3. Date Handling

```typescript
// Always send dates in ISO 8601 format
const deadline = new Date('2024-12-31T23:59:59Z');
const isoString = deadline.toISOString();

// Parse dates from API responses
const parsedDate = new Date(response.data.deadline);
```

### 4. Type Safety

```typescript
// Use TypeScript interfaces for type safety
interface CreateAssignmentDto {
  title: string;
  description: string;
  courseId: string;
  deadline: Date;
  fields: Field[];
}

// Validate data before sending
function validateAssignment(data: CreateAssignmentDto): boolean {
  const totalWeight = data.fields
    .filter(f => f.weight > 0)
    .reduce((sum, f) => sum + f.weight, 0);
  
  return totalWeight === 100;
}
```

---

## Changelog

### Version 1.0.0 (2024-01-24)

- Initial API release
- Authentication endpoints (register, login, get current user)
- CRUD operations for courses, groups, assignments, submissions
- Dynamic field validation
- Automatic score calculation
- Role-based access control
- Rate limiting
- Comprehensive error handling
