# Frontend Setup Guide

## Prerequisites
- Node.js 16+ installed
- Backend server running on `http://localhost:5000`

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if your backend runs on a different URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## API Integration

The frontend connects to the backend using the API utility located at `/utils/api.ts`.

### API Configuration

- **Default URL:** `http://localhost:5000/api`
- **Custom URL:** Set `VITE_API_URL` in `.env`

### Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Token is stored in `localStorage`
4. Token is included in all subsequent API requests
5. On app reload, token is validated to restore session

### API Modules

The API utility provides the following modules:

#### `api.auth`
- `login(email, password)` - Authenticate user
- `register(userData)` - Register new user
- `getCurrentUser()` - Get current user info
- `logout()` - Clear authentication

#### `api.courses`
- `getAll()` - Get all courses
- `getById(id)` - Get course by ID
- `create(courseData)` - Create new course
- `update(id, courseData)` - Update course
- `delete(id)` - Delete course

#### `api.groups`
- `getAll(courseId?)` - Get all groups (optional filter by course)
- `getById(id)` - Get group by ID
- `create(groupData)` - Create new group
- `update(id, groupData)` - Update group
- `delete(id)` - Delete group

#### `api.assignments`
- `getAll(courseId?)` - Get all assignments (optional filter by course)
- `getById(id)` - Get assignment by ID
- `create(assignmentData)` - Create new assignment
- `update(id, assignmentData)` - Update assignment
- `delete(id)` - Delete assignment

#### `api.submissions`
- `getAll(filters?)` - Get all submissions with optional filters
- `getById(id)` - Get submission by ID
- `create(submissionData)` - Create new submission
- `update(id, submissionData)` - Update submission
- `delete(id)` - Delete submission

### Error Handling

The API utility includes a custom `ApiError` class:

```typescript
try {
  await api.auth.login(email, password);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}:`, error.message);
  }
}
```

### Token Management

```typescript
import { getAuthToken, setAuthToken, removeAuthToken } from './utils/api';

// Get current token
const token = getAuthToken();

// Set token manually (usually done automatically on login)
setAuthToken('your-jwt-token');

// Remove token (logout)
removeAuthToken();
```

## Mock Data Removal

All mock data has been removed from the frontend. The application now relies entirely on the backend API for data.

### Before (Mock Data):
```typescript
const [users] = useState<User[]>([
  { id: "u1", name: "...", ... },
  // ...
]);
```

### After (API Integration):
```typescript
const [users, setUsers] = useState<User[]>([]);

useEffect(() => {
  const loadData = async () => {
    const data = await api.users.getAll(); // If endpoint exists
    setUsers(data);
  };
  loadData();
}, []);
```

## Development Tips

### Backend Connection Issues

If you see "שגיאת חיבור לשרת" (Server connection error):

1. Check backend is running:
   ```bash
   cd backend
   npm run dev
   ```

2. Verify backend URL in `.env`

3. Check browser console for CORS errors

### Authentication Issues

If you can't log in:

1. Verify user exists in backend database
2. Check email/password are correct
3. Check backend logs for errors
4. Clear localStorage and try again:
   ```javascript
   localStorage.clear()
   ```

## Building for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

Make sure to set the correct production API URL:
```
VITE_API_URL=https://your-production-api.com/api
```
