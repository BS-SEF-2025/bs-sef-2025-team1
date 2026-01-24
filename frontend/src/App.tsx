import { useState } from 'react';
import { StaffView } from './components/StaffView';
import { StudentView } from './components/StudentView';
import { LoginView } from './components/LoginView';
import { ClipboardList, LogOut } from 'lucide-react';
// התיקון החשוב: ייבוא מקובץ הטיפוסים החיצוני
import type { User, Course, Group, Assignment, Submission } from './types';

// נתונים התחלתיים (מחוץ לקומפוננטה כדי למנוע שגיאות רינדור)
const INITIAL_USERS: User[] = [
    { id: 'u1', name: 'ד"ר מיכל כהן', email: 'michal.cohen@university.ac.il', role: 'staff' },
    { id: 'u2', name: 'פרופ׳ דוד לוי', email: 'david.levi@university.ac.il', role: 'staff' },
    { id: 'u3', name: 'יוסי אברהם', email: 'yossi.a@student.ac.il', role: 'student', groupId: 'g1' },
    { id: 'u4', name: 'שרה כהן', email: 'sara.c@student.ac.il', role: 'student', groupId: 'g1' },
    { id: 'u5', name: 'דני לוי', email: 'dani.l@student.ac.il', role: 'student', groupId: 'g2' },
    { id: 'u6', name: 'רונית מזרחי', email: 'ronit.m@student.ac.il', role: 'student', groupId: 'g2' },
    { id: 'u7', name: 'עומר ישראלי', email: 'omer.i@student.ac.il', role: 'student', groupId: 'g3' },
    { id: 'u8', name: 'נועה ברק', email: 'noa.b@student.ac.il', role: 'student', groupId: 'g3' },
    { id: 'u9', name: 'אורי גולן', email: 'uri.g@student.ac.il', role: 'student', groupId: 'g4' },
    { id: 'u10', name: 'תמר שפירא', email: 'tamar.s@student.ac.il', role: 'student', groupId: 'g4' },
];

const INITIAL_COURSES: Course[] = [
    { id: 'c1', name: 'פיתוח אפליקציות Web', createdAt: new Date(2024, 8, 1), enrolledStudents: ['u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'u10'] },
    { id: 'c2', name: 'מבני נתונים ואלגוריתמים', createdAt: new Date(2024, 8, 1), enrolledStudents: ['u3', 'u4', 'u5', 'u6'] }
];

const INITIAL_GROUPS: Group[] = [
    { id: 'g1', name: 'קבוצה 1', courseId: 'c1', members: ['u3', 'u4'], createdAt: new Date(2024, 8, 5) },
    { id: 'g2', name: 'קבוצה 2', courseId: 'c1', members: ['u5', 'u6'], createdAt: new Date(2024, 8, 5) },
    { id: 'g3', name: 'קבוצה 3', courseId: 'c1', members: ['u7', 'u8'], createdAt: new Date(2024, 8, 5) },
    { id: 'g4', name: 'קבוצה 4', courseId: 'c1', members: ['u9', 'u10'], createdAt: new Date(2024, 8, 5) },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
    {
        id: 'a1',
        title: 'ביקורת פרויקט גמר',
        description: 'הערכה של פרויקטי גמר של קבוצות אחרות',
        courseId: 'c1',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        shareableLink: `${window.location.origin}${window.location.pathname}?assignment=a1`,
        createdAt: new Date(),
        fields: [
            { id: 'f1', name: 'איכות קוד', type: 'scale', required: true, weight: 30, scaleMin: 1, scaleMax: 10, description: 'הערכת איכות הקוד והארגון' },
            { id: 'f2', name: 'עיצוב ממשק', type: 'scale', required: true, weight: 30, scaleMin: 1, scaleMax: 10, description: 'הערכת העיצוב וחוויית המשתמש' },
            { id: 'f3', name: 'חדשנות', type: 'scale', required: true, weight: 40, scaleMin: 1, scaleMax: 10, description: 'רמת החדשנות והיצירתיות' },
            { id: 'f4', name: 'פידבק והערות', type: 'text', required: true, weight: 0, description: 'הערות והצעות לשיפור' }
        ]
    }
];

const INITIAL_SUBMISSIONS: Submission[] = [
    {
        id: 's1',
        assignmentId: 'a1',
        studentId: 'u3',
        reviewedGroupId: 'g2',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        calculatedScore: 85,
        answers: [
            { fieldId: 'f1', value: 8 },
            { fieldId: 'f2', value: 9 },
            { fieldId: 'f3', value: 8 },
            { fieldId: 'f4', value: 'עבודה מצוינת! ממליץ להוסיף עוד תכונות נגישות.' }
        ]
    },
    {
        id: 's2',
        assignmentId: 'a1',
        studentId: 'u5',
        reviewedGroupId: 'g1',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        calculatedScore: 92,
        answers: [
            { fieldId: 'f1', value: 9 },
            { fieldId: 'f2', value: 10 },
            { fieldId: 'f3', value: 9 },
            { fieldId: 'f4', value: 'פרויקט יוצא דופן עם תשומת לב לפרטים!' }
        ]
    }
];

function App() {
    const [users] = useState<User[]>(INITIAL_USERS);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
    const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
    const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
    const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);

    const handleLogout = () => {
        setCurrentUser(null);
    };

    if (!currentUser) {
        return <LoginView users={users} onLogin={setCurrentUser} />;
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
                                    {currentUser.role === 'staff' ? 'תצוגת סגל' : 'תצוגת סטודנט'}
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
                {currentUser.role === 'staff' ? (
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