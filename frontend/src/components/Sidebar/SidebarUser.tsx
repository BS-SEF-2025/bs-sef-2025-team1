import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

interface SidebarUserProps {
  name: string;
  email: string;
  role?: UserRole;
  onLogout: () => void;
}

const SidebarUser = ({ name, email, role, onLogout }: SidebarUserProps) => {
  const roleLabel = role === UserRole.STAFF ? "סגל אקדמי" : "סטודנט/ית";

  return (
    <div className="mt-auto pt-8 border-t border-slate-800 select-none">
      <div className="flex items-center gap-4 mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
        <div
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center",
            "bg-linear-to-br from-indigo-500 to-purple-600",
            "text-white font-black text-lg shadow-inner",
          )}
        >
          {name.charAt(0)}
        </div>

        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold truncate text-slate-100">{name}</p>

          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {role ? roleLabel : email}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={onLogout}
        className="w-full justify-center gap-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 font-bold cursor-pointer"
      >
        <LogOut className="w-5 h-5" />
        התנתקות מהמערכת
      </Button>
    </div>
  );
};

export default SidebarUser;
