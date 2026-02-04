import { useEffect, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { useNavigate, useSearchParams } from "react-router-dom";

import LoginCard from "@/components/login/LoginCard";
import useAuthState from "@/hooks/contexts/useAuthState";
import { toast } from "sonner";

const LoginView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get("assignment");

  const { user, loading } = useAuthState();

  const [isLoading, setIsLoading] = useState(false);

  // ✅ If already logged in → redirect
  useEffect(() => {
    if (user) {
      if (assignmentId) {
        navigate(`/submit/${assignmentId}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, assignmentId, navigate]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      toast.error("אירעה שגיאה בתהליך ההתחברות. נסה שוב מאוחר יותר.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <LoginCard
          assignmentId={assignmentId}
          isLoading={loading || isLoading}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
    </div>
  );
};

export default LoginView;
