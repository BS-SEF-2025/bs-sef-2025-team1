import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ForbiddenScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center space-y-6 max-w-md">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />

        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            403 — גישה חסומה
          </h1>
          <p className="text-slate-500 font-medium">
            אין לך הרשאה לצפות בתוכן זה.
          </p>
        </div>

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => navigate("/")}
        >
          חזרה לדף הבית
        </Button>
      </div>
    </div>
  );
};

export default ForbiddenScreen;
