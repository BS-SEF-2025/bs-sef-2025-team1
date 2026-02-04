import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UnauthorizedScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center space-y-6 max-w-md">
        <ShieldX className="w-14 h-14 text-amber-500 mx-auto" />

        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">אין הרשאה</h1>
          <p className="text-slate-500 font-medium">
            אין לך הרשאה לצפות בדף זה.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="rounded-xl cursor-pointer"
        >
          חזרה לדף הבית
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedScreen;
