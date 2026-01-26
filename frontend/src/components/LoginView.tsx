import { useState } from "react";
import type { User } from "../types";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { api } from "../services/api";

interface LoginViewProps {
    onLogin: (user: User) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("אנא מלא את כל השדות");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.login({ email, password });
            // Store the token (you might want to use localStorage or a state management solution)
            localStorage.setItem('authToken', response.token);
            onLogin(response.user);
        } catch (err: Error | unknown) {
            const errorMessage = err instanceof Error ? err.message : "שגיאה בהתחברות";
            setError(errorMessage || "שגיאה בהתחברות");
        } finally {
            setLoading(false);
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
                    <p className="text-gray-600">AmiTeam - מערכת ביקורת עמיתים</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            <AlertCircle size={16} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            אימייל
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="your.email@university.ac.il"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            סיסמה
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="הכנס סיסמה"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <LogIn size={20} />
                        )}
                        <span>{loading ? "מתחבר..." : "התחבר למערכת"}</span>
                    </button>
                </form>

                {/* Demo Credentials Info */}
                <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h3 className="text-sm font-medium text-indigo-900 mb-2">
                        אישורים לדוגמה:
                    </h3>
                    <div className="space-y-2 text-sm text-indigo-700">
                        <div>
                            <strong>סגל:</strong> staff@university.ac.il / password123
                        </div>
                        <div>
                            <strong>סטודנט:</strong> student@university.ac.il / password123
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}