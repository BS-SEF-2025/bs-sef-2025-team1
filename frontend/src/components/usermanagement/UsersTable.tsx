import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { User } from "@/types";
import UserRow from "./UserRow";

interface Props {
  users: User[];
  currentUserId: string;
}

const UsersTable = ({ users, currentUserId }: Props) => {
  return (
    <div
      dir="rtl"
      className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-5 text-center">משתמש</TableHead>
            <TableHead className="py-5 text-center">אימייל</TableHead>
            <TableHead className="py-5 text-center">תפקיד</TableHead>
            <TableHead className="py-5 text-center">פעולות</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((u) => (
            <UserRow key={u.id} user={u} isSelf={u.id === currentUserId} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
