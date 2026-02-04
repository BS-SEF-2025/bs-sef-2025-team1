import { UserStar } from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "@/firebase";

import SidebarItem from "./SidebarItem";
import { getSidebarLinks } from "@/utils/getSidebarLinks";
import SidebarUser from "./SidebarUser";
import useMe from "@/hooks/api/useMe";
import useAuthState from "@/hooks/contexts/useAuthState";
import { useQueryClient } from "@tanstack/react-query";

const Sidebar = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { user: authUser } = useAuthState();
  const { data: user } = useMe();

  const handleLogout = async () => {
    await signOut(auth);
    queryClient.clear();
    navigate("/login");
  };

  const sidebarLinks = user?.role ? getSidebarLinks(user!.role) : [];

  return (
    <aside className="w-1/6 bg-slate-900 text-white p-6 flex flex-col sticky top-0 h-screen select-none">
      <div className="mb-12 flex items-center gap-3">
        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20">
          <UserStar className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
          AmiTeam
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarLinks.map((link) => (
          <SidebarItem key={link.to} {...link} />
        ))}
      </nav>

      <SidebarUser
        name={user?.name ?? authUser?.displayName ?? "משתמש"}
        email={authUser?.email ?? "לא זמין"}
        role={user?.role}
        onLogout={handleLogout}
      />
    </aside>
  );
};

export default Sidebar;
