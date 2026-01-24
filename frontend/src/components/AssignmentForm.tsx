import { useState } from 'react';
import type { Assignment, Field, Course } from '../types';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface AssignmentFormProps {
    assignment: Assignment | null;
    courses: Course[];
    onSave: (data: Partial<Assignment>) => void;
    onCancel: () => void;
}

export function AssignmentForm({ assignment, courses, onSave, onCancel }: AssignmentFormProps) {
    const [title, setTitle] = useState(assignment?.title || '');
    const [description, setDescription] = useState(assignment?.description || '');
    const [courseId, setCourseId] = useState(assignment?.courseId || '');
    const [deadline, setDeadline] = useState(
        assignment?.deadline
            ? new Date(assignment.deadline).toISOString().split('T')[0]
            : ''
    );
    const [fields, setFields] = useState<Field[]>(assignment?.fields || []);

    const addField = (type: 'text' | 'scale', isCriteria: boolean = false) => {
        const newField: Field = {
            id: `f${Date.now()}`,
            name: '',
            type,
            required: true,
            weight: isCriteria ? 10 : 0,
            scaleMin: type === 'scale' ? 1 : undefined,
            scaleMax: type === 'scale' ? 10 : undefined,
            description: ''
        };
        setFields([...fields, newField]);
    };

    const updateField = (id: string, updates: Partial<Field>) => {
        setFields(fields.map(f => {
            if (f.id === id) {
                const updated = { ...f, ...updates };
                if (updates.type === 'text') {
                    updated.weight = 0;
                }
                // Criteria (weight > 0) must always be required
                if (updated.weight > 0) {
                    updated.required = true;
                }
                return updated;
            }
            return f;
        }));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const calculateTotalWeight = () => {
        return fields.reduce((sum, f) => sum + f.weight, 0);
    };

    const handleSubmit = () => {
        if (!title || !courseId || !deadline || fields.length === 0) {
            alert('נא למלא את כל השדות הנדרשים');
            return;
        }

        const criteriaWeight = fields.filter(f => f.weight > 0).reduce((sum, f) => sum + f.weight, 0);
        if (criteriaWeight !== 100 && criteriaWeight !== 0) {
            alert('סכום משקלות הקריטריונים צריך להיות 100%');
            return;
        }

        onSave({
            title,
            description,
            courseId,
            deadline: new Date(deadline),
            fields
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
                {assignment ? 'עריכת נושא' : 'יצירת נושא חדש'}
            </h2>

            <div className="space-y-6">
                {/* Basic Info */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        כותרת הנושא <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="לדוגמה: ביקורת פרויקט גמר"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        תיאור
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        rows={3}
                        placeholder="תיאור קצר של הנושא..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        קורס <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        תאריך אחרון להגשה <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Fields */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700">
                            שדות הנושא
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => addField('scale', true)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                                + קריטריון (סקאלה)
                            </button>
                            <button
                                onClick={() => addField('text', false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                            >
                                + פידבק (טקסט)
                            </button>
                            <button
                                onClick={() => addField('scale', false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                + פידבק (סקאלה)
                            </button>
                        </div>
                    </div>

                    {fields.length > 0 && (
                        <div className="space-y-4 mb-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-600">שדה #{index + 1}</span>
                                            {field.weight > 0 ? (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                                    קריטריון
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                    פידבק
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeField(field.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">שם השדה *</label>
                                            <input
                                                type="text"
                                                value={field.name}
                                                onChange={(e) => updateField(field.id, { name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                                                placeholder="לדוגמה: איכות קוד"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">תיאור</label>
                                            <input
                                                type="text"
                                                value={field.description}
                                                onChange={(e) => updateField(field.id, { description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                                                placeholder="תיאור קצר..."
                                            />
                                        </div>

                                        {field.type === 'scale' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">מינימום</label>
                                                    <input
                                                        type="number"
                                                        value={field.scaleMin}
                                                        onChange={(e) => updateField(field.id, { scaleMin: parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">מקסימום</label>
                                                    <input
                                                        type="number"
                                                        value={field.scaleMax}
                                                        onChange={(e) => updateField(field.id, { scaleMax: parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Show weight only for criteria (weight > 0) */}
                                        {field.weight > 0 && (
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">משקל (%)</label>
                                                <input
                                                    type="number"
                                                    value={field.weight}
                                                    onChange={(e) => updateField(field.id, { weight: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                                                    min="0"
                                                    max="100"
                                                />
                                            </div>
                                        )}

                                        {/* Show required checkbox only for feedback (weight === 0) */}
                                        {field.weight === 0 && (
                                            <div className="flex items-center">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                        className="w-4 h-4 text-indigo-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">שדה חובה</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {fields.length > 0 && (
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <p className="text-sm text-indigo-900">
                                סה"כ משקלות: <strong>{calculateTotalWeight()}%</strong>
                                {calculateTotalWeight() !== 100 && fields.some(f => f.weight > 0) && (
                                    <span className="text-red-600 mr-2">(צריך להיות 100%)</span>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Save size={20} />
                        {assignment ? 'עדכן נושא' : 'שמור נושא'}
                    </button>
                    <button
                        onClick={onCancel}
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