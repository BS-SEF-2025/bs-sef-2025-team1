/**
 * In-Memory Database for Development/Demo
 * 
 * For production, replace this with:
 * - PostgreSQL + Prisma
 * - MongoDB + Mongoose
 * - Or any other database solution
 */

import { User, Course, Group, Assignment, Submission } from '../types';

export class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private courses: Map<string, Course> = new Map();
  private groups: Map<string, Group> = new Map();
  private assignments: Map<string, Assignment> = new Map();
  private submissions: Map<string, Submission> = new Map();

  constructor() {
    this.seedData();
  }

  // User operations
  async createUser(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Course operations
  async createCourse(course: Course): Promise<Course> {
    this.courses.set(course.id, course);
    return course;
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesByStaff(staffId: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(c => c.createdBy === staffId);
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    const updated = { ...course, ...data, updatedAt: new Date() };
    this.courses.set(id, updated);
    return updated;
  }

  async deleteCourse(id: string): Promise<boolean> {
    // Delete related groups, assignments, and submissions
    const groups = Array.from(this.groups.values()).filter(g => g.courseId === id);
    groups.forEach(g => this.groups.delete(g.id));

    const assignments = Array.from(this.assignments.values()).filter(a => a.courseId === id);
    assignments.forEach(a => {
      // Delete submissions for this assignment
      const submissions = Array.from(this.submissions.values()).filter(s => s.assignmentId === a.id);
      submissions.forEach(s => this.submissions.delete(s.id));
      this.assignments.delete(a.id);
    });

    return this.courses.delete(id);
  }

  // Group operations
  async createGroup(group: Group): Promise<Group> {
    this.groups.set(group.id, group);
    return group;
  }

  async getGroupById(id: string): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async getAllGroups(): Promise<Group[]> {
    return Array.from(this.groups.values());
  }

  async getGroupsByCourse(courseId: string): Promise<Group[]> {
    return Array.from(this.groups.values()).filter(g => g.courseId === courseId);
  }

  async updateGroup(id: string, data: Partial<Group>): Promise<Group | undefined> {
    const group = this.groups.get(id);
    if (!group) return undefined;
    const updated = { ...group, ...data, updatedAt: new Date() };
    this.groups.set(id, updated);
    return updated;
  }

  async deleteGroup(id: string): Promise<boolean> {
    // Delete related submissions
    const submissions = Array.from(this.submissions.values()).filter(
      s => s.reviewedGroupId === id
    );
    submissions.forEach(s => this.submissions.delete(s.id));

    return this.groups.delete(id);
  }

  // Assignment operations
  async createAssignment(assignment: Assignment): Promise<Assignment> {
    this.assignments.set(assignment.id, assignment);
    return assignment;
  }

  async getAssignmentById(id: string): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async getAllAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }

  async getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(a => a.courseId === courseId);
  }

  async getAssignmentsByStaff(staffId: string): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(a => a.createdBy === staffId);
  }

  async updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment | undefined> {
    const assignment = this.assignments.get(id);
    if (!assignment) return undefined;
    const updated = { ...assignment, ...data, updatedAt: new Date() };
    this.assignments.set(id, updated);
    return updated;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    // Delete related submissions
    const submissions = Array.from(this.submissions.values()).filter(
      s => s.assignmentId === id
    );
    submissions.forEach(s => this.submissions.delete(s.id));

    return this.assignments.delete(id);
  }

  // Submission operations
  async createSubmission(submission: Submission): Promise<Submission> {
    this.submissions.set(submission.id, submission);
    return submission;
  }

  async getSubmissionById(id: string): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values());
  }

  async getSubmissions(filters: {
    assignmentId?: string;
    studentId?: string;
    reviewedGroupId?: string;
  }): Promise<Submission[]> {
    let submissions = Array.from(this.submissions.values());

    if (filters.assignmentId) {
      submissions = submissions.filter(s => s.assignmentId === filters.assignmentId);
    }
    if (filters.studentId) {
      submissions = submissions.filter(s => s.studentId === filters.studentId);
    }
    if (filters.reviewedGroupId) {
      submissions = submissions.filter(s => s.reviewedGroupId === filters.reviewedGroupId);
    }

    return submissions;
  }

  async deleteSubmission(id: string): Promise<boolean> {
    return this.submissions.delete(id);
  }

  // Seed initial data
  private seedData() {
    // Create demo users (passwords are 'password123' hashed with bcrypt)
    const demoUsers: User[] = [
      // Staff members
      {
        id: 'u1',
        name: 'ד"ר מיכל כהן',
        email: 'michal.cohen@university.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu', // password123
        role: 'staff',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u2',
        name: 'פרופ׳ דוד לוי',
        email: 'david.levi@university.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'staff',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      // Students
      {
        id: 'u3',
        name: 'יוסי אברהם',
        email: 'yossi.a@student.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'student',
        groupId: 'g1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u4',
        name: 'שרה כהן',
        email: 'sara.c@student.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'student',
        groupId: 'g1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u5',
        name: 'דני לוי',
        email: 'dani.l@student.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'student',
        groupId: 'g2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u6',
        name: 'רונית מזרחי',
        email: 'ronit.m@student.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'student',
        groupId: 'g2',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u7',
        name: 'עומר ישראלי',
        email: 'omer.i@student.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'student',
        groupId: 'g3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u8',
        name: 'נועה ברק',
        email: 'noa.b@student.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'student',
        groupId: 'g3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u9',
        name: 'אורי גולן',
        email: 'uri.g@student.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'student',
        groupId: 'g4',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u10',
        name: 'תמר שפירא',
        email: 'tamar.s@student.ac.il',
        password: '$2a$10$rBV2kHq.0lXZ9A6IqH5WMeYlvGvK1JpI8r3KVxB8T0YuLWz6H.Zlu',
        role: 'student',
        groupId: 'g4',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));

    // Create demo courses
    const demoCourses: Course[] = [
      {
        id: 'c1',
        name: 'פיתוח אפליקציות Web',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-01'),
        enrolledStudents: ['u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10'],
        createdBy: 'u1',
      },
      {
        id: 'c2',
        name: 'מבני נתונים ואלגוריתמים',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-01'),
        enrolledStudents: ['u3', 'u4', 'u5', 'u6'],
        createdBy: 'u1',
      },
    ];

    demoCourses.forEach(course => this.courses.set(course.id, course));

    // Create demo groups
    const demoGroups: Group[] = [
      {
        id: 'g1',
        name: 'קבוצה 1',
        courseId: 'c1',
        members: ['u3', 'u4'],
        createdAt: new Date('2024-09-05'),
        updatedAt: new Date('2024-09-05'),
      },
      {
        id: 'g2',
        name: 'קבוצה 2',
        courseId: 'c1',
        members: ['u5', 'u6'],
        createdAt: new Date('2024-09-05'),
        updatedAt: new Date('2024-09-05'),
      },
      {
        id: 'g3',
        name: 'קבוצה 3',
        courseId: 'c1',
        members: ['u7', 'u8'],
        createdAt: new Date('2024-09-05'),
        updatedAt: new Date('2024-09-05'),
      },
      {
        id: 'g4',
        name: 'קבוצה 4',
        courseId: 'c1',
        members: ['u9', 'u10'],
        createdAt: new Date('2024-09-05'),
        updatedAt: new Date('2024-09-05'),
      },
    ];

    demoGroups.forEach(group => this.groups.set(group.id, group));

    // Create demo assignment
    const now = Date.now();
    const demoAssignments: Assignment[] = [
      {
        id: 'a1',
        title: 'ביקורת פרויקט גמר',
        description: 'הערכה של פרויקטי גמר של קבוצות אחרות',
        courseId: 'c1',
        deadline: new Date(now + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        shareableLink: 'http://localhost:3000?assignment=a1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'u1',
        fields: [
          {
            id: 'f1',
            name: 'איכות קוד',
            type: 'scale',
            required: true,
            weight: 30,
            scaleMin: 1,
            scaleMax: 10,
            description: 'הערכת איכות הקוד והארגון',
          },
          {
            id: 'f2',
            name: 'עיצוב ממשק',
            type: 'scale',
            required: true,
            weight: 30,
            scaleMin: 1,
            scaleMax: 10,
            description: 'הערכת העיצוב וחוויית המשתמש',
          },
          {
            id: 'f3',
            name: 'חדשנות',
            type: 'scale',
            required: true,
            weight: 40,
            scaleMin: 1,
            scaleMax: 10,
            description: 'רמת החדשנות והיצירתיות',
          },
          {
            id: 'f4',
            name: 'פידבק והערות',
            type: 'text',
            required: true,
            weight: 0,
            description: 'הערות והצעות לשיפור',
          },
        ],
      },
    ];

    demoAssignments.forEach(assignment => this.assignments.set(assignment.id, assignment));

    // Create demo submissions
    const demoSubmissions: Submission[] = [
      {
        id: 's1',
        assignmentId: 'a1',
        studentId: 'u3',
        reviewedGroupId: 'g2',
        submittedAt: new Date(now - 2 * 24 * 60 * 60 * 1000),
        calculatedScore: 85,
        answers: [
          { fieldId: 'f1', value: 8 },
          { fieldId: 'f2', value: 9 },
          { fieldId: 'f3', value: 8 },
          { fieldId: 'f4', value: 'עבודה מצוינת! ממליץ להוסיף עוד תכונות נגישות.' },
        ],
      },
      {
        id: 's2',
        assignmentId: 'a1',
        studentId: 'u5',
        reviewedGroupId: 'g1',
        submittedAt: new Date(now - 1 * 24 * 60 * 60 * 1000),
        calculatedScore: 92,
        answers: [
          { fieldId: 'f1', value: 9 },
          { fieldId: 'f2', value: 10 },
          { fieldId: 'f3', value: 9 },
          { fieldId: 'f4', value: 'פרויקט יוצא דופן עם תשומת לב לפרטים!' },
        ],
      },
      {
        id: 's3',
        assignmentId: 'a1',
        studentId: 'u7',
        reviewedGroupId: 'g1',
        submittedAt: new Date(now - 3 * 24 * 60 * 60 * 1000),
        calculatedScore: 78,
        answers: [
          { fieldId: 'f1', value: 7 },
          { fieldId: 'f2', value: 8 },
          { fieldId: 'f3', value: 8 },
          { fieldId: 'f4', value: 'יפה מאוד, אבל יש מקום לשיפורים בביצועים.' },
        ],
      },
      {
        id: 's4',
        assignmentId: 'a1',
        studentId: 'u9',
        reviewedGroupId: 'g3',
        submittedAt: new Date(now - 4 * 24 * 60 * 60 * 1000),
        calculatedScore: 88,
        answers: [
          { fieldId: 'f1', value: 9 },
          { fieldId: 'f2', value: 9 },
          { fieldId: 'f3', value: 8 },
          { fieldId: 'f4', value: 'פתרון יצירתי ומעניין. כל הכבוד!' },
        ],
      },
    ];

    demoSubmissions.forEach(submission => this.submissions.set(submission.id, submission));
  }
}

// Export singleton instance
export const db = new InMemoryDatabase();
