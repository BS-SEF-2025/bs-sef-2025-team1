
import type { User, Course, Assignment, Submission, Group } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// פונקציית עזר לבקשות
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            // כאן תוסיף בעתיד טוקן אימות (JWT)
            // 'Authorization': `Bearer ${token}` 
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}

export const api = {
    // משתמשים
    getUsers: () => request<User[]>('/users'),

    // קורסים
    getCourses: () => request<Course[]>('/courses'),
    createCourse: (course: Partial<Course>) => request<Course>('/courses', {
        method: 'POST',
        body: JSON.stringify(course)
    }),

    // מטלות
    getAssignments: () => request<Assignment[]>('/assignments'),
    createAssignment: (assignment: Partial<Assignment>) => request<Assignment>('/assignments', {
        method: 'POST',
        body: JSON.stringify(assignment)
    }),

    // הגשות
    getSubmissions: () => request<Submission[]>('/submissions'),
    submitAssignment: (submission: Partial<Submission>) => request<Submission>('/submissions', {
        method: 'POST',
        body: JSON.stringify(submission)
    }),

    // קבוצות
    getGroups: () => request<Group[]>('/groups'),
};