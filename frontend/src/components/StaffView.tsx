import { useState } from 'react';
import type { Assignment, Submission, Course, Group, User } from '../types';
import { BookOpen, Users as UsersIcon, BarChart3, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { AssignmentForm } from './AssignmentForm';
import { CourseManagement } from './CourseManagement';
import { GroupManagement } from './GroupManagement';

interface StaffViewProps {
    assignments: Assignment[];
    setAssignments: (assignments: Assignment[]) => void;
    submissions: Submission[];
    setSubmissions: (submissions: Submission[]) => void;
    courses: Course[];
    setCourses: (courses: Course[]) => void;
    groups: Group[];
    setGroups: (groups: Group[]) => void;
    users: User[];
    currentUser: User;
}

export function StaffView({
    assignments,
    setAssignments,
    submissions,
    setSubmissions,
    courses,
    setCourses,
    groups,
    setGroups,
    users
}: StaffViewProps) {
    const [viewMode, setViewMode] = useState<'assignments' | 'courses' | 'groups' | 'summary'>('assignments');
    const [assignmentMode, setAssignmentMode] = useState<'list' | 'create' | 'edit'>('list');
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<string>('');

    // ========== ASSIGNMENT FUNCTIONS ==========

    const createAssignment = (data: Partial<Assignment>) => {
        const newId = `a${Date.now()}`;
        const newAssignment: Assignment = {
            id: newId,
            title: data.title!,
            description: data.description!,
            courseId: data.courseId!,
            deadline: data.deadline!,
            shareableLink: `${window.location.origin}${window.location.pathname}?assignment=${newId}`,
            createdAt: new Date(),
            fields: data.fields!
        };

        setAssignments([...assignments, newAssignment]);
    };

    const updateAssignment = (data: Partial<Assignment>) => {
        if (!editingAssignment) return;

        const updated: Assignment = {
            ...editingAssignment,
            ...data
        };

        setAssignments(assignments.map(a => a.id === editingAssignment.id ? updated : a));
    };

    const deleteAssignment = (id: string) => {
        if (confirm('האם אתה בטוח שברצונך למחוק את הנושא? פעולה זו תמחק גם את כל ההגשות המשויכות.')) {
            setAssignments(assignments.filter(a => a.id !== id));
            setSubmissions(submissions.filter(s => s.assignmentId !== id));
        }
    };

    const startEditAssignment = (assignment: Assignment) => {
        setEditingAssignment(assignment);
        setAssignmentMode('edit');
    };

    // ========== COURSE FUNCTIONS ==========

    const createCourse = (data: Omit<Course, 'id' | 'createdAt'>) => {
        const newCourse: Course = {
            id: `c${Date.now()}`,
            ...data,
            createdAt: new Date()
        };
        setCourses([...courses, newCourse]);
    };

    const updateCourse = (id: string, updates: Partial<Course>) => {
        setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteCourse = (id: string) => {
        const relatedAssignments = assignments.filter(a => a.courseId === id);
        const relatedGroups = groups.filter(g => g.courseId === id);

        if (relatedAssignments.length > 0 || relatedGroups.length > 0) {
            if (!confirm(`קורס זה מכיל ${relatedAssignments.length} נושאים ו-${relatedGroups.length} קבוצות. האם אתה בטוח שברצונך למחוק?`)) {
                return;
            }
        }

        setCourses(courses.filter(c => c.id !== id));
        setAssignments(assignments.filter(a => a.courseId !== id));
        setGroups(groups.filter(g => g.courseId !== id));
    };

    // ========== GROUP FUNCTIONS ==========

    const createGroup = (data: Omit<Group, 'id' | 'createdAt'>) => {
        const newGroup: Group = {
            id: `g${Date.now()}`,
            ...data,
            createdAt: new Date()
        };
        setGroups([...groups, newGroup]);
    };

    const updateGroup = (id: string, updates: Partial<Group>) => {
        setGroups(groups.map(g => g.id === id ? { ...g, ...updates } : g));
    };

    const deleteGroup = (id: string) => {
        if (confirm('האם אתה בטוח שברצונך למחוק את הקבוצה?')) {
            setGroups(groups.filter(g => g.id !== id));
        }
    };

    // ========== HELPER FUNCTIONS ==========

    const getUserById = (userId: string) => users.find(u => u.id === userId);
    const getGroupById = (groupId: string) => groups.find(g => g.id === groupId);

    // ========== EXPORT TO EXCEL ==========

    const exportToExcel = () => {
        if (!selectedAssignment) {
            alert('נא לבחור נושא לייצוא');
            return;
        }

        const assignment = assignments.find(a => a.id === selectedAssignment);
        if (!assignment) return;

        const assignmentSubs = submissions.filter(s => s.assignmentId === selectedAssignment);

        const data = assignmentSubs.map(sub => {
            const student = getUserById(sub.studentId);
            const reviewedGroup = getGroupById(sub.reviewedGroupId);

            const row: any = {
                'שם סטודנט': student?.name || '',
                'אימייל': student?.email || '',
                'קבוצה מבוקרת': reviewedGroup?.name || '',
                'תאריך הגשה': new Date(sub.submittedAt).toLocaleString('he-IL'),
                'ציון': Math.round(sub.calculatedScore)
            };

            // Add field answers
            sub.answers.forEach(answer => {
                const field = assignment.fields.find(f => f.id === answer.fieldId);
                if (field) {
                    row[field.name] = answer.value;
                }
            });

            return row;
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'הגשות');

        XLSX.writeFile(wb, `${assignment.title}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="space-y-6">
            {/* Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setViewMode('assignments');
                            setAssignmentMode('list');
                        }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${viewMode === 'assignments'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <BarChart3 size={20} />
                        ניהול נושאים
                    </button>
                    <button
                        onClick={() => setViewMode('courses')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${viewMode === 'courses'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <BookOpen size={20} />
                        ניהול קורסים
                    </button>
                    <button
                        onClick={() => setViewMode('groups')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${viewMode === 'groups'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <UsersIcon size={20} />
                        ניהול קבוצות
                    </button>
                    <button
                        onClick={() => setViewMode('summary')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${viewMode === 'summary'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <BarChart3 size={20} />
                        סיכום והגשות
                    </button>
                </div>
            </div>

            {/* ========== ASSIGNMENTS VIEW ========== */}
            {viewMode === 'assignments' && (
                <>
                    {assignmentMode === 'list' ? (
                        <AssignmentsList
                            assignments={assignments}
                            courses={courses}
                            submissions={submissions}
                            onEdit={startEditAssignment}
                            onDelete={deleteAssignment}
                            onCreate={() => setAssignmentMode('create')}
                        />
                    ) : (
                        <AssignmentForm
                            assignment={editingAssignment}
                            courses={courses}
                            onSave={(data) => {
                                if (assignmentMode === 'create') {
                                    createAssignment(data);
                                } else {
                                    updateAssignment(data);
                                }
                                setAssignmentMode('list');
                                setEditingAssignment(null);
                            }}
                            onCancel={() => {
                                setAssignmentMode('list');
                                setEditingAssignment(null);
                            }}
                        />
                    )}
                </>
            )}

            {/* ========== COURSES VIEW ========== */}
            {viewMode === 'courses' && (
                <CourseManagement
                    courses={courses}
                    users={users}
                    onCreateCourse={createCourse}
                    onUpdateCourse={updateCourse}
                    onDeleteCourse={deleteCourse}
                />
            )}

            {/* ========== GROUPS VIEW ========== */}
            {viewMode === 'groups' && (
                <GroupManagement
                    groups={groups}
                    courses={courses}
                    users={users}
                    onCreateGroup={createGroup}
                    onUpdateGroup={updateGroup}
                    onDeleteGroup={deleteGroup}
                />
            )}

            {/* ========== SUMMARY VIEW ========== */}
            {viewMode === 'summary' && (
                <SummaryView
                    assignments={assignments}
                    submissions={submissions}
                    groups={groups}
                    users={users}
                    selectedAssignment={selectedAssignment}
                    setSelectedAssignment={setSelectedAssignment}
                    onExport={exportToExcel}
                />
            )}
        </div>
    );
}

// ========== ASSIGNMENTS LIST COMPONENT ==========
interface AssignmentsListProps {
    assignments: Assignment[];
    courses: Course[];
    submissions: Submission[];
    onEdit: (assignment: Assignment) => void;
    onDelete: (id: string) => void;
    onCreate: () => void;
}

function AssignmentsList({ assignments, courses, submissions, onEdit, onDelete, onCreate }: AssignmentsListProps) {
    const getStats = (assignmentId: string) => {
        const subs = submissions.filter(s => s.assignmentId === assignmentId);
        if (subs.length === 0) return { avg: 0, min: 0, max: 0, count: 0 };
        const scores = subs.map(s => s.calculatedScore);
        return {
            avg: scores.reduce((a, b) => a + b, 0) / scores.length,
            min: Math.min(...scores),
            max: Math.max(...scores),
            count: subs.length
        };
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-900">נושאים</h2>
                <button
                    onClick={onCreate}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <span>+</span>
                    יצירת נושא חדש
                </button>
            </div>

            {assignments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-gray-500 mb-4">אין נושאים עדיין</p>
                    <button
                        onClick={onCreate}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        צור נושא ראשון
                    </button>
                </div>
            ) : (
                assignments.map(assignment => {
                    const stats = getStats(assignment.id);
                    const isOverdue = new Date(assignment.deadline) < new Date();
                    const course = courses.find(c => c.id === assignment.courseId);

                    return (
                        <div key={assignment.id} className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">{assignment.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-gray-600">📚 {course?.name || 'לא משויך'}</span>
                                        <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                            📅 {new Date(assignment.deadline).toLocaleDateString('he-IL')}
                                            {isOverdue && ' (פג תוקף)'}
                                        </span>
                                        <span className="text-gray-600">{assignment.fields.length} שדות</span>
                                        <span className="font-medium text-indigo-600">{stats.count} הגשות</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(assignment)}
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    >
                                        ✏️ עריכה
                                    </button>
                                    <button
                                        onClick={() => onDelete(assignment.id)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        🗑️ מחיקה
                                    </button>
                                </div>
                            </div>

                            {stats.count > 0 && (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-xs text-blue-600">ממוצע</p>
                                        <p className="text-xl font-bold text-blue-900">{Math.round(stats.avg)}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-xs text-green-600">מקסימום</p>
                                        <p className="text-xl font-bold text-green-900">{Math.round(stats.max)}</p>
                                    </div>
                                    <div className="bg-orange-50 p-3 rounded-lg">
                                        <p className="text-xs text-orange-600">מינימום</p>
                                        <p className="text-xl font-bold text-orange-900">{Math.round(stats.min)}</p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <p className="text-xs text-purple-600">הגשות</p>
                                        <p className="text-xl font-bold text-purple-900">{stats.count}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}

// ========== SUMMARY VIEW COMPONENT ==========
interface SummaryViewProps {
    assignments: Assignment[];
    submissions: Submission[];
    groups: Group[];
    users: User[];
    selectedAssignment: string;
    setSelectedAssignment: (id: string) => void;
    onExport: () => void;
}

function SummaryView({ assignments, submissions, groups, users, selectedAssignment, setSelectedAssignment, onExport }: SummaryViewProps) {
    const assignment = assignments.find(a => a.id === selectedAssignment);
    const assignmentSubs = assignment ? submissions.filter(s => s.assignmentId === selectedAssignment) : [];
    const courseGroups = assignment ? groups.filter(g => g.courseId === assignment.courseId) : [];

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">סיכום הגשות</h2>

            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">בחר נושא</label>
                    <select
                        value={selectedAssignment}
                        onChange={(e) => setSelectedAssignment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">-- בחר נושא --</option>
                        {assignments.map(a => (
                            <option key={a.id} value={a.id}>{a.title}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={onExport}
                        disabled={!selectedAssignment}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Download size={20} />
                        ייצוא ל-Excel
                    </button>
                </div>
            </div>

            {selectedAssignment && assignment && (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-600 mb-1">סה"כ הגשות</p>
                            <p className="text-2xl font-bold text-blue-900">{assignmentSubs.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-600 mb-1">ממוצע ציונים</p>
                            <p className="text-2xl font-bold text-green-900">
                                {assignmentSubs.length > 0
                                    ? Math.round(assignmentSubs.reduce((sum, s) => sum + s.calculatedScore, 0) / assignmentSubs.length)
                                    : 0}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-purple-600 mb-1">ציון מקסימלי</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {assignmentSubs.length > 0 ? Math.round(Math.max(...assignmentSubs.map(s => s.calculatedScore))) : 0}
                            </p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <p className="text-sm text-orange-600 mb-1">ציון מינימלי</p>
                            <p className="text-2xl font-bold text-orange-900">
                                {assignmentSubs.length > 0 ? Math.round(Math.min(...assignmentSubs.map(s => s.calculatedScore))) : 0}
                            </p>
                        </div>
                    </div>

                    {/* Submissions by Group */}
                    {assignmentSubs.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">אין הגשות עדיין למשלוח זה</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {courseGroups.map(group => {
                                const groupSubs = assignmentSubs.filter(s => s.reviewedGroupId === group.id);
                                const avgScore = groupSubs.length > 0
                                    ? groupSubs.reduce((sum, s) => sum + s.calculatedScore, 0) / groupSubs.length
                                    : 0;

                                return (
                                    <div key={group.id} className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-medium text-indigo-900">{group.name}</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-sm text-indigo-600">הגשות</p>
                                                    <p className="text-2xl font-bold text-indigo-900">{groupSubs.length}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm text-indigo-600">ממוצע</p>
                                                    <p className="text-2xl font-bold text-indigo-900">{Math.round(avgScore)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {groupSubs.length === 0 ? (
                                            <p className="text-indigo-700 text-sm">אין הגשות לקבוצה זו</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {groupSubs.map(submission => {
                                                    const student = users.find(u => u.id === submission.studentId);
                                                    return (
                                                        <div key={submission.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div>
                                                                    <h4 className="font-medium text-gray-900">{student?.name}</h4>
                                                                    <p className="text-sm text-gray-600">{student?.email}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        הוגש ב: {new Date(submission.submittedAt).toLocaleString('he-IL')}
                                                                    </p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-3xl font-bold text-indigo-600">{Math.round(submission.calculatedScore)}</p>
                                                                    <p className="text-xs text-gray-600">ציון</p>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                {submission.answers.map(answer => {
                                                                    const field = assignment.fields.find(f => f.id === answer.fieldId);
                                                                    if (!field) return null;

                                                                    return (
                                                                        <div key={answer.fieldId} className="bg-gray-50 p-2 rounded">
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <span className="text-sm font-medium text-gray-700">{field.name}</span>
                                                                                {field.weight > 0 && (
                                                                                    <span className="text-xs text-purple-600">משקל: {field.weight}%</span>
                                                                                )}
                                                                            </div>
                                                                            {field.type === 'scale' ? (
                                                                                <p className="text-lg font-medium text-indigo-600">
                                                                                    {answer.value} / {field.scaleMax}
                                                                                </p>
                                                                            ) : (
                                                                                <p className="text-sm text-gray-800">{answer.value}</p>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
