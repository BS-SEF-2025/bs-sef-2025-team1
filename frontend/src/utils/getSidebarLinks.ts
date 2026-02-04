import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  FileText,
  BarChart3,
} from "lucide-react";
import { UserRole, type Link } from "@/types";

export const getSidebarLinks = (role: UserRole) => {
  const common: Link[] = [
    {
      to: "/dashboard",
      label: "לוח בקרה",
      icon: LayoutDashboard,
    },
    {
      to: "/results",
      label: "סיכומים וציונים",
      icon: BarChart3,
    },
  ];

  if (role === UserRole.STAFF) {
    return [
      ...common,
      {
        to: "/courses",
        label: "ניהול קורסים",
        icon: BookOpen,
      },
      {
        to: "/groups",
        label: "ניהול קבוצות",
        icon: Users,
      },
      {
        to: "/assignments",
        label: "משימות וביקורות",
        icon: ClipboardList,
      },
      {
        to: "/users",
        label: "ניהול משתמשים",
        icon: Users,
      },
    ];
  }

  return [
    ...common,
    {
      to: "/submit",
      label: "הגשת ביקורת",
      icon: FileText,
    },
  ];
};
