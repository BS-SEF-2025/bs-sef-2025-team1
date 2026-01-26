import { useState, useEffect } from "react";
import { StaffView } from "./components/StaffView";
import { StudentView } from "./components/StudentView";
import { LoginView } from "./components/LoginView";
import { ClipboardList, LogOut, Loader2 } from "lucide-react";
import { api, getAuthToken } from "./utils/api";
import { Toaster, toast } from "sonner@2.0.3";

// User types
export type UserRole = "staff" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  groupId?: string; // For students - which group they belong to
}

// Field types
export type FieldType = "text" | "scale";

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  weight: number; // 0 for feedback, >0 for criteria
  scaleMin?: number; // for scale type
  scaleMax?: number; // for scale type
  description?: string;
}

// Course and Group models
export interface Course {
  id: string;
  name: string;
  createdAt: Date;
  enrolledStudents: string[]; // User IDs
}

export interface Group {
  id: string;
  name: string;
  courseId: string;
  members: string[]; // User IDs
  createdAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string; // Linked to a course
  deadline: Date;
  fields: Field[];
  shareableLink: string;
  createdAt: Date;
}

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
  calculatedScore: number;
  submittedAt: Date;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Check for existing auth token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const user = await api.auth.getCurrentUser();
          setCurrentUser(user);
        } catch (error) {
          // Token is invalid, clear it
          api.auth.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Load data when user logs in
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      // Load all data in parallel
      const [coursesData, groupsData, assignmentsData, submissionsData] = await Promise.all([
        api.courses.getAll(),
        api.groups.getAll(),
        api.assignments.getAll(),
        api.submissions.getAll(),
      ]);

      setCourses(coursesData.map(c => ({
        ...c,
        createdAt: new Date(c.createdAt)
      })));
      
      setGroups(groupsData.map(g => ({
        ...g,
        createdAt: new Date(g.createdAt)
      })));
      
      setAssignments(assignmentsData.map(a => ({
        ...a,
        createdAt: new Date(a.createdAt),
        deadline: new Date(a.deadline)
      })));
      
      setSubmissions(submissionsData.map(s => ({
        ...s,
        submittedAt: new Date(s.submittedAt)
      })));
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("שגיאה בטעינת נתונים");
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    api.auth.logout();
    setCurrentUser(null);
    setCourses([]);
    setGroups([]);
    setAssignments([]);
    setSubmissions([]);
    setUsers([]);
  };

  // Show loading spinner on initial load
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // Login view
  if (!currentUser) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <LoginView onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ClipboardList size={32} />
                <div>
                  <h1 className="text-2xl">AmiTeam</h1>
                  <p className="text-sm text-indigo-100">
                    {currentUser.role === "staff"
                      ? "תצוגת סגל"
                      : "תצוגת סטודנט"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <p className="font-medium">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-indigo-100">
                    {currentUser.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span>התנתק</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          {currentUser.role === "staff" ? (
            <StaffView
              assignments={assignments}
              setAssignments={setAssignments}
              submissions={submissions}
              setSubmissions={setSubmissions}
              courses={courses}
              setCourses={setCourses}
              groups={groups}
              setGroups={setGroups}
              users={users}
              currentUser={currentUser}
            />
          ) : (
            <StudentView
              assignments={assignments}
              submissions={submissions}
              setSubmissions={setSubmissions}
              courses={courses}
              groups={groups}
              users={users}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default App;
