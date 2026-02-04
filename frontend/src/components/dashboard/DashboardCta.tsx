import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import useMe from "@/hooks/api/useMe";

const DashboardCta = () => {
  const { data: user } = useMe();
  if (!user) return null;

  const actions =
    user.role === UserRole.STAFF
      ? [
          {
            label: "יצירת משימה",
            to: "/assignments/create",
            className:
              "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20",
          },
          {
            label: "ניהול קורסים",
            to: "/courses",
            className: "bg-slate-800 hover:bg-slate-700 text-white",
          },
        ]
      : [
          {
            label: "הגשת ביקורת עכשיו",
            to: "/submit",
            className:
              "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20",
          },
          {
            label: "צפייה בציונים",
            to: "/results",
            className: "bg-slate-800 hover:bg-slate-700 text-white",
          },
        ];

  return (
    <Card className="rounded-[2.5rem] bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20">
      <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-right">
          <h3 className="text-xl font-black mb-1">רוצה להתחיל לעבוד?</h3>
          <p className="text-slate-400 font-medium text-sm">
            הקיצורים המהירים שלך מחכים ממש כאן.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {actions.map((action) => (
            <Button
              key={action.to}
              asChild
              className={cn(
                "px-6 py-3 rounded-xl font-black text-sm transition-all",
                action.className,
              )}
            >
              <Link to={action.to}>{action.label}</Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCta;
