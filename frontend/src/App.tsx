import { useState, useEffect } from 'react';
import { StaffView } from './components/StaffView';
import { StudentView } from './components/StudentView';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { ClipboardList, LogOut } from 'lucide-react';
// התיקון החשוב: ייבוא מקובץ הטיפוסים החיצוני
import type { User, Course, Group, Assignment, Submission } from './types';
import { api } from './services/api';

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Check if user is already authenticated
                const token = localStorage.getItem('authToken');
                if (token) {
                    try {
                        const userResponse = await api.getCurrentUser();
                        setCurrentUser(userResponse);
                        setLoading(false);
                        return;
                    } catch {
                        // Token is invalid, remove it
                        localStorage.removeItem('authToken');
                    }
                }

                const [usersData, coursesData, groupsData, assignmentsData, submissionsData] = await Promise.all([
                    api.getUsers(),
                    api.getCourses(),
                    api.getGroups(),
                    api.getAssignments(),
                    api.getSubmissions()
                ]);

                setUsers(usersData);
                setCourses(coursesData);
                setGroups(groupsData);
                setAssignments(assignmentsData);
                setSubmissions(submissionsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                // For now, keep empty arrays if API fails
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('authToken');
    };

    // Show loading state while fetching initial data
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">טוען נתונים...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <LoginView onLogin={setCurrentUser} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <header className="bg-gradient-to-l from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ClipboardList size={32} />
                            <div>
                                <h1 className="text-2xl">AmiTeam</h1>
                                <p className="text-sm text-indigo-100">
                                    {currentUser.role === 'admin' ? 'תצוגת מנהל' :
                                     currentUser.role === 'staff' ? 'תצוגת סגל' : 'תצוגת סטודנט'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-left">
                                <p className="font-medium">{currentUser.name}</p>
                                <p className="text-sm text-indigo-100">{currentUser.email}</p>
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

            <main className="container mx-auto px-6 py-8">
                {currentUser.role === 'admin' ? (
                    <AdminView
                        users={users}
                        setUsers={setUsers}
                        currentUser={currentUser}
                    />
                ) : currentUser.role === 'staff' ? (
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
    );
}

export default App;