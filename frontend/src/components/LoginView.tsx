import { useState } from "react";
import type { User } from "../types";
import { Users, User as UserIcon, LogIn } from "lucide-react";

interface LoginViewProps {
    users: User[];
    onLogin: (user: User) => void;
}

export function LoginView({ users, onLogin }: LoginViewProps) {
    const [selectedUserId, setSelectedUserId] =
        useState<string>("");

    const staffUsers = users.filter((u) => u.role === "staff");
    const studentUsers = users.filter(
        (u) => u.role === "student",
    );

    const handleLogin = () => {
        const user = users.find((u) => u.id === selectedUserId);
        if (user) {
            onLogin(user);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                        <LogIn size={32} className="text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        ברוכים הבאים
                    </h1>
                    <p className="text-gray-600">AmiTeam</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            בחר משתמש להתחברות
                        </label>
                        <select
                            value={selectedUserId}
                            onChange={(e) =>
                                setSelectedUserId(e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">-- בחר משתמש --</option>

                            <optgroup label="סגל">
                                {staffUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </optgroup>

                            <optgroup label="סטודנטים">
                                {studentUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={!selectedUserId}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <LogIn size={20} />
                        <span>התחבר למערכת</span>
                    </button>

                    {/* Demo Users Info */}
                    <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <h3 className="text-sm font-medium text-indigo-900 mb-2">
                            משתמשים לדוגמה:
                        </h3>
                        <div className="space-y-2 text-sm text-indigo-700">
                            <div className="flex items-center gap-2">
                                <Users size={16} />
                                <span>
                                    <strong>סגל:</strong> {staffUsers.length} חברי
                                    סגל
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UserIcon size={16} />
                                <span>
                                    <strong>סטודנטים:</strong>{" "}
                                    {studentUsers.length} סטודנטים מחולקים ל-4
                                    קבוצות
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}