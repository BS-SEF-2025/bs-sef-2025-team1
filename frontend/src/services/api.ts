
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
        const response = await request('/users');
        // Handle both nested format {success: true, data: users} and direct array format
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response.data;
        }
        // If it's already an array, return it directly
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    },

    // ������
    getCourses: async () => {
        const response = await request('/courses');
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response.data;
        }
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    },
    createCourse: async (course: Partial<Course>) => {
        const response = await request('/courses', {
            method: 'POST',
            body: JSON.stringify(course)
        });
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response.data;
        }
        return response;
    },

    // �����
    getAssignments: async () => {
        const response = await request('/assignments');
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response.data;
        }
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    },
    createAssignment: async (assignment: Partial<Assignment>) => {
        const response = await request('/assignments', {
            method: 'POST',
            body: JSON.stringify(assignment)
        });
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response.data;
        }
        return response;
    },

    // �����
    getSubmissions: async () => {
        const response = await request('/submissions');
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response.data;
        }
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    },
    submitAssignment: async (submission: Partial<Submission>) => {
        const response = await request('/submissions', {
            method: 'POST',
            body: JSON.stringify(submission)
        });
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response.data;
        }
        return response;
    },

    // ������
    getGroups: async () => {
        const response = await request('/groups');
        if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
            return response.data;
        }
        if (Array.isArray(response)) {
            return response;
        }
        return [];
    },
};