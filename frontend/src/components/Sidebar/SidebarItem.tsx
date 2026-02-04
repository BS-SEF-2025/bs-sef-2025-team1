import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Link } from "@/types";

const SidebarItem = ({ to, label, icon }: Link) => {
  const Icon = icon;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 px-5 py-3 rounded-2xl text-sm font-bold transition-all select-none",
          isActive
            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 translate-x-1"
            : "text-slate-400 hover:text-white hover:bg-slate-800/80 hover:translate-x-1",
        )
      }
    >
      <Icon className="w-5 h-5" />
      {label}
    </NavLink>
  );
};

export default SidebarItem;
