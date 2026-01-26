
import type { User, Course, Assignment, Submission, Group } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api';

// �������� ��� ������
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Try to parse error message from response
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.statusText}`);
        } catch (parseError) {
            // If we can't parse JSON, use the status text
            throw new Error(`API Error: ${response.statusText}`);
        }
    }
    return response.json();
}

export const api = {
    // Authentication
    login: async (credentials: { email: string; password: string }) => {
        const response = await request<{ success: boolean; data: { user: User; token: string } }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        return response.data;
    },
    register: (userData: { name: string; email: string; password: string; role: 'staff' | 'student'; groupId?: string }) => request<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    getCurrentUser: async () => {
        const response = await request<{ success: boolean; data: User }>('/auth/me');
        return response.data;
    },

    // Users
    getUsers: async () => {
        const response = await request<{ success: boolean; data: User[] }>('/users');
        return response.data;
    },

    // ������
    getCourses: async () => {
        const response = await request<{ success: boolean; data: Course[] }>('/courses');
        return response.data;
    },
    createCourse: async (course: Partial<Course>) => {
        const response = await request<{ success: boolean; data: Course }>('/courses', {
            method: 'POST',
            body: JSON.stringify(course)
        });
        return response.data;
    },

    // �����
    getAssignments: async () => {
        const response = await request<{ success: boolean; data: Assignment[] }>('/assignments');
        return response.data;
    },
    createAssignment: async (assignment: Partial<Assignment>) => {
        const response = await request<{ success: boolean; data: Assignment }>('/assignments', {
            method: 'POST',
            body: JSON.stringify(assignment)
        });
        return response.data;
    },

    // �����
    getSubmissions: async () => {
        const response = await request<{ success: boolean; data: Submission[] }>('/submissions');
        return response.data;
    },
    submitAssignment: async (submission: Partial<Submission>) => {
        const response = await request<{ success: boolean; data: Submission }>('/submissions', {
            method: 'POST',
            body: JSON.stringify(submission)
        });
        return response.data;
    },

    // ������
    getGroups: async () => {
        const response = await request<{ success: boolean; data: Group[] }>('/groups');
        return response.data;
    },
};