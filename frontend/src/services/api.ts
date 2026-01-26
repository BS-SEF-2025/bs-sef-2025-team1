
import type { User, Course, Assignment, Submission, Group } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

// �������� ��� ������
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options?.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}

export const api = {
    // Authentication
    login: (credentials: { email: string; password: string }) => request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    register: (userData: { name: string; email: string; password: string; role: 'staff' | 'student'; groupId?: string }) => request<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    getCurrentUser: () => request<User>('/auth/me'),

    // Users
    getUsers: () => request<User[]>('/users'),

    // ������
    getCourses: () => request<Course[]>('/courses'),
    createCourse: (course: Partial<Course>) => request<Course>('/courses', {
        method: 'POST',
        body: JSON.stringify(course)
    }),

    // �����
    getAssignments: () => request<Assignment[]>('/assignments'),
    createAssignment: (assignment: Partial<Assignment>) => request<Assignment>('/assignments', {
        method: 'POST',
        body: JSON.stringify(assignment)
    }),

    // �����
    getSubmissions: () => request<Submission[]>('/submissions'),
    submitAssignment: (submission: Partial<Submission>) => request<Submission>('/submissions', {
        method: 'POST',
        body: JSON.stringify(submission)
    }),

    // ������
    getGroups: () => request<Group[]>('/groups'),
};