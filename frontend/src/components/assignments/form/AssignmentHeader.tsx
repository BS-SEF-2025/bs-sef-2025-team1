import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AssignmentHeader() {
  const navigate = useNavigate();

  return (
    <Card className="flex items-center flex-row justify-between p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
      <div className="flex items-center gap-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate("/assignments")}
          className={cn(
            "p-3 bg-slate-50 text-slate-400 rounded-2xl",
            "hover:text-indigo-600 transition-all cursor-pointer scale-[125%]",
          )}
        >
          <ArrowRight />
        </Button>

        <div>
          <h2 className="text-3xl font-black text-slate-900">
            יצירת משימה חדשה
          </h2>
          <p className="text-slate-500 font-medium">
            הגדרת קריטריונים ופרמטרים לביקורת עמיתים
          </p>
        </div>
      </div>

      <div className="hidden md:flex w-16 h-16 bg-indigo-50 rounded-3xl items-center justify-center text-3xl shadow-inner">
        📝
      </div>
    </Card>
  );
}
