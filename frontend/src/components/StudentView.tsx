import { useState } from 'react';
import type { Assignment, Submission, SubmissionAnswer, Course, Group, User } from '../types';
import { Send, CheckCircle, Clock, FileText, Eye } from 'lucide-react';

interface StudentViewProps {
    assignments: Assignment[];
    submissions: Submission[];
    setSubmissions: (submissions: Submission[]) => void;
    courses: Course[];
    groups: Group[];
    users: User[];
    currentUser: User;
}

export function StudentView({
    assignments,
    submissions,
    setSubmissions,
    courses,
    groups,
    users,
    currentUser
}: StudentViewProps) {
    // Check URL parameters for pre-selected assignment
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedAssignment = urlParams.get('assignment') || '';

    const [viewMode, setViewMode] = useState<'available' | 'mySubmissions' | 'aboutMe'>('available');
    const [selectedAssignment, setSelectedAssignment] = useState<string>(preSelectedAssignment);
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [answers, setAnswers] = useState<Record<string, string | number>>({});

    const currentAssignment = assignments.find(a => a.id === selectedAssignment);
    const assignmentCourse = currentAssignment ? courses.find(c => c.id === currentAssignment.courseId) : null;
    const availableGroups = assignmentCourse ? groups.filter(g => g.courseId === assignmentCourse.id) : [];

    // Get student's group
    const myGroup = groups.find(g => g.members.includes(currentUser.id));

    // My submissions
    const mySubmissions = submissions.filter(s => s.studentId === currentUser.id);

    // Reviews about my group
    const reviewsAboutMe = myGroup ? submissions.filter(s => s.reviewedGroupId === myGroup.id) : [];

    const calculateScore = (assignment: Assignment, answers: Record<string, string | number>): number => {
        let totalScore = 0;
        let totalWeight = 0;

        assignment.fields.forEach(field => {
            if (field.weight > 0 && field.type === 'scale') {
                const value = Number(answers[field.id]) || 0;
                const max = field.scaleMax || 10;
                const normalized = (value / max) * 100;
                totalScore += normalized * (field.weight / 100);
                totalWeight += field.weight;
            }
        });

        return totalWeight > 0 ? totalScore : 0;
    };

    const handleSubmit = () => {
        if (!currentAssignment || !selectedGroup) {
            alert('נא לבחור קבוצה לביקורת');
            return;
        }

        // Check if deadline passed
        if (new Date(currentAssignment.deadline) < new Date()) {
            alert('תאריך ההגשה עבר');
            return;
        }

        // Validate all required fields
        const missingFields = currentAssignment.fields.filter(
            field => field.required && !answers[field.id]
        );

        if (missingFields.length > 0) {
            alert('נא למלא את כל שדות החובה');
            return;
        }

        // Validate scale values
        for (const field of currentAssignment.fields) {
            if (field.type === 'scale' && answers[field.id]) {
                const value = Number(answers[field.id]);
                if (value < (field.scaleMin || 0) || value > (field.scaleMax || 10)) {
                    alert(`הערך עבור "${field.name}" חייב להיות בין ${field.scaleMin} ל-${field.scaleMax}`);
                    return;
                }
            }
        }

        const submissionAnswers: SubmissionAnswer[] = currentAssignment.fields.map(field => ({
            fieldId: field.id,
            value: answers[field.id] || ''
        }));

        const calculatedScore = calculateScore(currentAssignment, answers);

        const newSubmission: Submission = {
            id: `s${Date.now()}`,
            assignmentId: currentAssignment.id,
            studentId: currentUser.id,
            reviewedGroupId: selectedGroup,
            answers: submissionAnswers,
            calculatedScore,
            submittedAt: new Date()
        };

        setSubmissions([...submissions, newSubmission]);
        setAnswers({});
        setSelectedGroup('');
        setSelectedAssignment('');
        alert('ההגשה נשלחה בהצלחה!');
    };

    return (
        <div className="space-y-6">
            {/* Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex gap-4">
                    <button
                        onClick={() => setViewMode('available')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${viewMode === 'available'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <FileText size={20} />
                        נושאים זמינים
                    </button>
                    <button
                        onClick={() => setViewMode('mySubmissions')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${viewMode === 'mySubmissions'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <CheckCircle size={20} />
                        ההגשות שלי ({mySubmissions.length})
                    </button>
                    <button
                        onClick={() => setViewMode('aboutMe')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${viewMode === 'aboutMe'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Eye size={20} />
                        ביקורות על ה��בוצה שלי ({reviewsAboutMe.length})
                    </button>
                </div>
            </div>

            {/* Available Assignments View */}
            {viewMode === 'available' && (
                <div className="space-y-6">
                    {!selectedAssignment ? (
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-medium text-gray-900 mb-6">נושאים זמינים</h2>

                            {assignments.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">אין נושאים זמינים כרגע</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {assignments.map(assignment => {
                                        const course = courses.find(c => c.id === assignment.courseId);
                                        const isOverdue = new Date(assignment.deadline) < new Date();
                                        const mySubmission = mySubmissions.find(s => s.assignmentId === assignment.id);

                                        return (
                                            <div key={assignment.id} className={`border-2 rounded-lg p-6 ${isOverdue ? 'border-gray-300 bg-gray-50' : 'border-indigo-300 bg-white'
                                                }`}>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-medium text-gray-900 mb-2">{assignment.title}</h3>
                                                        <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-gray-600">📚 {course?.name}</span>
                                                            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                                                📅 {new Date(assignment.deadline).toLocaleDateString('he-IL')}
                                                                {isOverdue && ' (פג תוקף)'}
                                                            </span>
                                                            {mySubmission && (
                                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                                    ✓ הוגש
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!isOverdue && (
                                                        <button
                                                            onClick={() => setSelectedAssignment(assignment.id)}
                                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                                        >
                                                            הגש ביקורת
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-medium text-gray-900">{currentAssignment?.title}</h2>
                                <button
                                    onClick={() => {
                                        setSelectedAssignment('');
                                        setSelectedGroup('');
                                        setAnswers({});
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    חזרה לרשימה
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Group Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        בחר קבוצה לביקורת <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedGroup}
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">-- בחר קבוצה --</option>
                                        {availableGroups.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.name} ({group.members.length} חברים)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Fields */}
                                {currentAssignment?.fields.map(field => (
                                    <div key={field.id}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.name}
                                            {field.required && <span className="text-red-500">*</span>}
                                            {field.weight > 0 && (
                                                <span className="text-xs text-purple-600 mr-2">(משקל: {field.weight}%)</span>
                                            )}
                                        </label>
                                        {field.description && (
                                            <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                                        )}

                                        {field.type === 'scale' ? (
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    min={field.scaleMin}
                                                    max={field.scaleMax}
                                                    value={answers[field.id] || field.scaleMin}
                                                    onChange={(e) => setAnswers({ ...answers, [field.id]: Number(e.target.value) })}
                                                    className="flex-1"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min={field.scaleMin}
                                                        max={field.scaleMax}
                                                        value={answers[field.id] || ''}
                                                        onChange={(e) => setAnswers({ ...answers, [field.id]: Number(e.target.value) })}
                                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                                                    />
                                                    <span className="text-sm text-gray-600">/ {field.scaleMax}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <textarea
                                                value={answers[field.id] || ''}
                                                onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                                rows={4}
                                                placeholder="הזן את תשובתך כאן..."
                                            />
                                        )}
                                    </div>
                                ))}

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Send size={20} />
                                    שלח הגשה
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* My Submissions View */}
            {viewMode === 'mySubmissions' && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-medium text-gray-900 mb-6">ההגשות שלי</h2>

                    {mySubmissions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">טרם הגשת ביקורות</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {mySubmissions.map(submission => {
                                const assignment = assignments.find(a => a.id === submission.assignmentId);
                                const reviewedGroup = groups.find(g => g.id === submission.reviewedGroupId);
                                const course = assignment ? courses.find(c => c.id === assignment.courseId) : null;

                                return (
                                    <div key={submission.id} className="border-2 border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-medium text-gray-900 mb-2">{assignment?.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>📚 {course?.name}</span>
                                                    <span>👥 קבוצה מבוקרת: {reviewedGroup?.name}</span>
                                                    <span>📅 {new Date(submission.submittedAt).toLocaleDateString('he-IL')}</span>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-indigo-600">{Math.round(submission.calculatedScore)}</p>
                                                <p className="text-xs text-gray-600">ציון</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {submission.answers.map(answer => {
                                                const field = assignment?.fields.find(f => f.id === answer.fieldId);
                                                if (!field) return null;

                                                return (
                                                    <div key={answer.fieldId} className="bg-gray-50 p-3 rounded">
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
            )}

            {/* Reviews About Me View */}
            {viewMode === 'aboutMe' && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-medium text-gray-900 mb-6">
                        ביקורות על הקבוצה שלי{myGroup && ` - ${myGroup.name}`}
                    </h2>

                    {!myGroup ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">אינך משויך לקבוצה כרגע</p>
                        </div>
                    ) : reviewsAboutMe.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">עדיין לא התקבלו ביקורות על הקבוצה שלך</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviewsAboutMe.map(submission => {
                                const assignment = assignments.find(a => a.id === submission.assignmentId);
                                const reviewer = users.find(u => u.id === submission.studentId);
                                const course = assignment ? courses.find(c => c.id === assignment.courseId) : null;

                                return (
                                    <div key={submission.id} className="border-2 border-indigo-200 rounded-lg p-6 bg-indigo-50">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-medium text-gray-900 mb-2">{assignment?.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>📚 {course?.name}</span>
                                                    <span>👤 ממבקר: {reviewer?.name}</span>
                                                    <span>📅 {new Date(submission.submittedAt).toLocaleDateString('he-IL')}</span>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-indigo-600">{Math.round(submission.calculatedScore)}</p>
                                                <p className="text-xs text-gray-600">ציון</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {submission.answers.map(answer => {
                                                const field = assignment?.fields.find(f => f.id === answer.fieldId);
                                                if (!field) return null;

                                                return (
                                                    <div key={answer.fieldId} className="bg-white p-3 rounded">
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
            )}
        </div>
    );
}
