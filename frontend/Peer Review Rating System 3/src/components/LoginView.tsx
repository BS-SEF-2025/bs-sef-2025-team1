import { useState } from "react";
import { User } from "../App";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { api, ApiError } from "../utils/api";
import { toast } from "sonner@2.0.3";

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("נא למלא את כל השדות");
      return;
    }

    setLoading(true);
    try {
      const { user } = await api.auth.login(email, password);
      toast.success(`ברוך הבא, ${user.name}!`);
      onLogin(user);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          toast.error("אימייל או סיסמה שגויים");
        } else if (error.status === 404) {
          toast.error("משתמש לא קיים");
        } else {
          toast.error(`שגיאה: ${error.message}`);
        }
      } else {
        toast.error("שגיאת חיבור לשרת. אנא בדוק שה-backend רץ.");
      }
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
          <h1 className="text-3xl text-gray-900 mb-2">
            ברוכים הבאים
          </h1>
          <p className="text-gray-600">AmiTeam - מערכת ניהול נושאים ומשוב</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              htmlFor="email"
              className="block text-sm text-gray-700 mb-2"
            >
              כתובת אימייל
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@university.ac.il"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              dir="ltr"
            />
          </div>

          <div>
            <label 
              htmlFor="password"
              className="block text-sm text-gray-700 mb-2"
            >
              סיסמה
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>מתחבר...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>התחבר למערכת</span>
              </>
            )}
          </button>
        </form>

        {/* Connection Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm text-blue-900 mb-2">
            <strong>הערה:</strong>
          </h3>
          <p className="text-sm text-blue-700">
            וודא שה-backend רץ בכתובת{" "}
            <code className="bg-blue-100 px-1 py-0.5 rounded">
              http://localhost:5000
            </code>
          </p>
          <p className="text-sm text-blue-700 mt-2">
            ניתן להגדיר כתובת שונה באמצעות משתנה הסביבה{" "}
            <code className="bg-blue-100 px-1 py-0.5 rounded">
              VITE_API_URL
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
