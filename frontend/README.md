# Frontend -- React + TypeScript + Vite

## Overview

This project is the Frontend application of the system, built using:

- React 19
- TypeScript
- Vite
- React Router
- TanStack React Query
- Axios
- Firebase (Client SDK)
- TailwindCSS + Radix UI

The application provides a full management interface for:

- Assignments
- Courses
- Groups
- Submissions
- Users
- Statistics Dashboard
- Authentication (Google Login)

The system communicates with the backend REST API using Axios and
manages server state using React Query.

---

# Main Technologies

- React 19
- TypeScript
- Vite
- React Router v7
- TanStack React Query
- Axios
- Firebase (for authentication)
- TailwindCSS
- Radix UI
- Sonner (notifications)
- Lucide React (icons)

---

# Project Structure

    src/
    │
    ├── api/                → API communication layer (Axios-based)
    ├── components/         → Reusable UI components grouped by domain
    ├── contexts/           → React Contexts (e.g., AuthContext)
    ├── firebase.ts         → Firebase client initialization
    ├── hooks/              → Custom hooks (API + state logic)
    ├── layouts/            → Layout components
    ├── pages/              → Route-based pages
    ├── providers/          → Application providers (AuthProvider)
    ├── types/              → TypeScript definitions
    ├── utils/              → Utility functions
    ├── App.tsx             → Main app component
    ├── main.tsx            → Entry point
    └── index.css           → Global styles

---

# Key Architectural Concepts

## 1. API Layer

All HTTP communication is centralized inside `src/api/` using Axios. An
Axios instance is configured in:

    src/api/axiosInstance.ts

Each domain has its own API file:

- assignments.ts
- courses.ts
- groups.ts
- submissions.ts
- users.ts
- statistics.ts
- auth.ts

---

## 2. State Management

The project uses **TanStack React Query** for:

- Server state management
- Caching
- Background refetching
- Optimistic updates

Custom hooks are located under:

    src/hooks/api/

Examples:

- useAssignments
- useCourses
- useGroups
- useSubmissions
- useUsers
- useStatistics

---

## 3. Authentication

Authentication is handled using:

- Firebase Client SDK
- AuthContext
- AuthProvider
- Protected routes

Relevant files:

    src/contexts/AuthContext.ts
    src/providers/AuthProvider.tsx
    src/hooks/contexts/useAuthState.ts

---

## 4. UI Structure

The UI is component-driven and organized by domain:

- assignments/
- courses/
- groups/
- submissions/
- dashboard/
- login/
- results/
- usermanagement/
- common/
- status/

Reusable UI primitives are located in:

    src/components/ui/

These are based on Radix UI + TailwindCSS.

---

# Installation

```bash
npm install
```

---

# Running the Project

## Development

```bash
npm run dev
```

The app will run on:

    http://localhost:5173

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

# Routing

Routing is handled using React Router v7.

Pages are located under:

    src/pages/

Examples:

- DashboardPage
- LoginPage
- AssignmentManagementPage
- CourseManagementPage
- GroupManagementPage
- ResultsPage
- UserManagementPage

---

# Styling

- TailwindCSS v4
- Utility-first styling
- Radix UI primitives
- tw-merge for class merging
- Sonner for toast notifications

---

# Error Handling

The system includes dedicated screens:

- ErrorScreen
- UnauthorizedScreen
- ForbiddenScreen
- LoadingScreen

Located in:

    src/components/status/

---

# Design Principles

- Component-based architecture
- Domain-driven UI grouping
- Centralized API communication
- Strong typing with TypeScript
- Separation between server state and UI state
- Reusable UI primitives

---

# Author

(Add your name here)
