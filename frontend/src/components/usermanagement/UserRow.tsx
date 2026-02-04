import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUsersMutations from "@/hooks/api/users/useUsersMutations";
import { UserRole } from "@/types";
// import { store } from "@/store";

import type { User } from "@/types";

interface Props {
  user: User;
  isSelf: boolean;
}

const UserRow = ({ user, isSelf }: Props) => {
  const { updateUserRole } = useUsersMutations();

  const roleColor =
    user.role === UserRole.STAFF ? "bg-indigo-600" : "bg-sky-500";

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-8 py-6 flex justify-center">
        <div className="flex items-center gap-3 ">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black ${roleColor}`}
          >
            {user.name.charAt(0)}
          </div>
          <span className="font-black text-slate-900">{user.name}</span>
        </div>
      </td>

      <td className="px-8 py-6 text-sm text-center font-bold text-slate-500">
        {user.email}
      </td>

      <td className="px-8 py-6 text-center">
        <Badge
          className={
            user.role === UserRole.STAFF
              ? "bg-indigo-100 text-indigo-700"
              : "bg-sky-100 text-sky-700"
          }
        >
          {user.role === UserRole.STAFF ? "סגל" : "סטודנט"}
        </Badge>
      </td>

      <td className="px-8 py-6 flex justify-center">
        <div className="flex items-center gap-2">
          <Select
            dir="rtl"
            value={user.role}
            disabled={isSelf}
            onValueChange={(value) =>
              updateUserRole(user.id, value as UserRole)
            }
          >
            <SelectTrigger className="w-40 rounded-xl cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-pointer" value={UserRole.STUDENT}>
                הפוך לסטודנט
              </SelectItem>
              <SelectItem className="cursor-pointer" value={UserRole.STAFF}>
                הפוך לסגל
              </SelectItem>
            </SelectContent>
          </Select>

          {isSelf && (
            <span className="text-[10px] font-bold text-amber-500">
              לא ניתן לערוך את עצמך
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
