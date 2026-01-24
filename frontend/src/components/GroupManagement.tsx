import { useState } from 'react';
import type { Course, Group, User } from '../types';
import { Plus, Trash2, Save, X, Edit2, Users as UsersIcon, BookOpen } from 'lucide-react';

interface GroupManagementProps {
    groups: Group[];
    courses: Course[];
    users: User[];
    onCreateGroup: (group: Omit<Group, 'id' | 'createdAt'>) => void;
    onUpdateGroup: (id: string, updates: Partial<Group>) => void;
    onDeleteGroup: (id: string) => void;
}

export function GroupManagement({ groups, courses, users, onCreateGroup, onUpdateGroup, onDeleteGroup }: GroupManagementProps) {
    const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [groupName, setGroupName] = useState('');
    const [groupCourseId, setGroupCourseId] = useState('');
    const [groupMembers, setGroupMembers] = useState<string[]>([]);

    const handleCreate = () => {
        if (!groupName || !groupCourseId) {
            alert('נא להזין שם קבוצה ולבחור קורס');
            return;
        }

        const course = courses.find(c => c.id === groupCourseId);
        if (!course) return;

        const invalidMembers = groupMembers.filter(m => !course.enrolledStudents.includes(m));
        if (invalidMembers.length > 0) {
            alert('כל חברי הקבוצה חייבים להיות רשומים לקורס');
            return;
        }

        onCreateGroup({
            name: groupName,
            courseId: groupCourseId,
            members: groupMembers
        });

        resetForm();
        setMode('list');
    };

    const handleUpdate = () => {
        if (!editingGroup || !groupName || !groupCourseId) {
            alert('נא להזין שם קבוצה ולבחור קורס');
            return;
        }

        const course = courses.find(c => c.id === groupCourseId);
        if (!course) return;

        const invalidMembers = groupMembers.filter(m => !course.enrolledStudents.includes(m));
        if (invalidMembers.length > 0) {
            alert('כל חברי הקבוצה חייבים להיות רשומים לקורס');
            return;
        }

        onUpdateGroup(editingGroup.id, {
            name: groupName,
            courseId: groupCourseId,
            members: groupMembers
        });

        resetForm();
        setMode('list');
    };

    const startEdit = (group: Group) => {
        setEditingGroup(group);
        setGroupName(group.name);
        setGroupCourseId(group.courseId);
        setGroupMembers(group.members);
        setMode('edit');
    };

    const resetForm = () => {
        setGroupName('');
        setGroupCourseId('');
        setGroupMembers([]);
        setEditingGroup(null);
    };

    const toggleMember = (studentId: string) => {
        if (groupMembers.includes(studentId)) {
            setGroupMembers(groupMembers.filter(id => id !== studentId));
        } else {
            setGroupMembers([...groupMembers, studentId]);
        }
    };

    const selectedCourse = courses.find(c => c.id === groupCourseId);
    const availableStudents = selectedCourse
        ? users.filter(u => u.role === 'student' && selectedCourse.enrolledStudents.includes(u.id))
        : [];

    if (mode === 'create' || mode === 'edit') {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-medium text-gray-900 mb-6">
                    {mode === 'create' ? 'יצירת קבוצה חדשה' : 'עריכת קבוצה'}
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            שם הקבוצה <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="לדוגמה: קבוצה 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            קורס <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={groupCourseId}
                            onChange={(e) => {
                                setGroupCourseId(e.target.value);
                                setGroupMembers([]);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">-- בחר קורס --</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {groupCourseId && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                חברי הקבוצה
                            </label>
                            {availableStudents.length === 0 ? (
                                <p className="text-sm text-gray-500">אין סטודנטים רשומים בקורס זה</p>
                            ) : (
                                <>
                                    <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                                        {availableStudents.map(student => (
                                            <label key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={groupMembers.includes(student.id)}
                                                    onChange={() => toggleMember(student.id)}
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
                                        {groupMembers.length} חברים נבחרו
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={mode === 'create' ? handleCreate : handleUpdate}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Save size={20} />
                            {mode === 'create' ? 'צור קבוצה' : 'עדכן קבוצה'}
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
                <h2 className="text-2xl font-medium text-gray-900">קבוצות</h2>
                <button
                    onClick={() => setMode('create')}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} />
                    יצירת קבוצה חדשה
                </button>
            </div>

            {groups.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-gray-500 mb-4">אין קבוצות עדיין</p>
                    <button
                        onClick={() => setMode('create')}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        צור קבוצה ראשונה
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map(group => {
                        const course = courses.find(c => c.id === group.courseId);
                        return (
                            <div key={group.id} className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-medium text-gray-900 mb-2">{group.name}</h3>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <BookOpen size={16} />
                                                <span>{course?.name || 'לא משויך'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <UsersIcon size={16} />
                                                <span>{group.members.length} חברים</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => startEdit(group)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600"
                                            title="עריכה"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteGroup(group.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                                            title="מחיקה"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-2">חברי הקבוצה:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {group.members.map(memberId => {
                                            const member = users.find(u => u.id === memberId);
                                            return member ? (
                                                <span key={memberId} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                                    {member.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
