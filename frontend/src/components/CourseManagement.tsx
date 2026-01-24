import { useState } from 'react';
import type { Course, User } from '../types';
import { Plus, Trash2, Save, X, Edit2, Users as UsersIcon } from 'lucide-react';

interface CourseManagementProps {
    courses: Course[];
    users: User[];
    onCreateCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
    onUpdateCourse: (id: string, updates: Partial<Course>) => void;
    onDeleteCourse: (id: string) => void;
}

export function CourseManagement({ courses, users, onCreateCourse, onUpdateCourse, onDeleteCourse }: CourseManagementProps) {
    const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseName, setCourseName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    const studentUsers = users.filter(u => u.role === 'student');

    const handleCreate = () => {
        if (!courseName) {
            alert('נא להזין שם קורס');
            return;
        }

        onCreateCourse({
            name: courseName,
            enrolledStudents: selectedStudents
        });

        resetForm();
        setMode('list');
    };

    const handleUpdate = () => {
        if (!editingCourse || !courseName) {
            alert('נא להזין שם קורס');
            return;
        }

        onUpdateCourse(editingCourse.id, {
            name: courseName,
            enrolledStudents: selectedStudents
        });

        resetForm();
        setMode('list');
    };

    const startEdit = (course: Course) => {
        setEditingCourse(course);
        setCourseName(course.name);
        setSelectedStudents(course.enrolledStudents);
        setMode('edit');
    };

    const resetForm = () => {
        setCourseName('');
        setSelectedStudents([]);
        setEditingCourse(null);
    };

    const toggleStudent = (studentId: string) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    if (mode === 'create' || mode === 'edit') {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-6">
                    {mode === 'create' ? 'יצירת קורס חדש' : 'עריכת קורס'}
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            שם הקורס <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="לדוגמה: פיתוח אפליקציות Web"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            סטודנטים רשומים
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                            {studentUsers.map(student => (
                                <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => toggleStudent(student.id)}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.email}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {selectedStudents.length} סטודנטים נבחרו
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={mode === 'create' ? handleCreate : handleUpdate}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Save size={20} />
                            {mode === 'create' ? 'צור קורס' : 'עדכן קורס'}
                        </button>
                        <button
                            onClick={() => {
                                resetForm();
                                setMode('list');
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            <X size={20} />
                            ביטול
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-medium text-gray-900">קורסים</h2>
                <button
                    onClick={() => setMode('create')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    יצירת קורס חדש
                </button>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-gray-500 mb-4">אין קורסים עדיין</p>
                    <button
                        onClick={() => setMode('create')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        צור קורס ראשון
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">{course.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <UsersIcon size={16} />
                                        <span>{course.enrolledStudents.length} סטודנטים רשומים</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => startEdit(course)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600"
                                        title="עריכה"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteCourse(course.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                                        title="מחיקה"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-2">סטודנטים רשומים:</p>
                                <div className="flex flex-wrap gap-2">
                                    {course.enrolledStudents.slice(0, 5).map(studentId => {
                                        const student = users.find(u => u.id === studentId);
                                        return student ? (
                                            <span key={studentId} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                                {student.name}
                                            </span>
                                        ) : null;
                                    })}
                                    {course.enrolledStudents.length > 5 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                            +{course.enrolledStudents.length - 5} נוספים
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
