// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new ApiError(response.status, errorData.message || errorData.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: { token: string; user: any } 
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string; role: 'staff' | 'student' }) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: { token: string; user: any } 
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>('/auth/me');
    return response.data;
  },

  logout: () => {
    removeAuthToken();
  },
};

// Courses API
export const coursesApi = {
  getAll: async () => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any[] 
    }>('/courses');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>(`/courses/${id}`);
    return response.data;
  },

  create: async (courseData: { name: string; enrolledStudents?: string[] }) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
    return response.data;
  },

  update: async (id: string, courseData: Partial<{ name: string; enrolledStudents: string[] }>) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      message: string 
    }>(`/courses/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// Groups API
export const groupsApi = {
  getAll: async (courseId?: string) => {
    const query = courseId ? `?courseId=${courseId}` : '';
    const response = await apiRequest<{ 
      success: boolean; 
      data: any[] 
    }>(`/groups${query}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>(`/groups/${id}`);
    return response.data;
  },

  create: async (groupData: { name: string; courseId: string; members?: string[] }) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
    return response.data;
  },

  update: async (id: string, groupData: Partial<{ name: string; members: string[] }>) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      message: string 
    }>(`/groups/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// Assignments API
export const assignmentsApi = {
  getAll: async (courseId?: string) => {
    const query = courseId ? `?courseId=${courseId}` : '';
    const response = await apiRequest<{ 
      success: boolean; 
      data: any[] 
    }>(`/assignments${query}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>(`/assignments/${id}`);
    return response.data;
  },

  create: async (assignmentData: {
    title: string;
    description: string;
    courseId: string;
    deadline: Date | string;
    fields: any[];
  }) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
    return response.data;
  },

  update: async (id: string, assignmentData: Partial<{
    title: string;
    description: string;
    deadline: Date | string;
    fields: any[];
  }>) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      message: string 
    }>(`/assignments/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// Submissions API
export const submissionsApi = {
  getAll: async (filters?: {
    assignmentId?: string;
    studentId?: string;
    reviewedGroupId?: string;
    courseId?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    
    const response = await apiRequest<{ 
      success: boolean; 
      data: any[] 
    }>(`/submissions${query}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>(`/submissions/${id}`);
    return response.data;
  },

  create: async (submissionData: {
    assignmentId: string;
    reviewedGroupId: string;
    answers: Array<{ fieldId: string; value: string | number }>;
  }) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>('/submissions', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
    return response.data;
  },

  update: async (id: string, submissionData: {
    answers: Array<{ fieldId: string; value: string | number }>;
  }) => {
    const response = await apiRequest<{ 
      success: boolean; 
      data: any 
    }>(`/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(submissionData),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiRequest<{ 
      success: boolean; 
      message: string 
    }>(`/submissions/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

// Export all APIs as a single object
export const api = {
  auth: authApi,
  courses: coursesApi,
  groups: groupsApi,
  assignments: assignmentsApi,
  submissions: submissionsApi,
};

export default api;
