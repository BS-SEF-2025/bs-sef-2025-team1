import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface Props {
  student: User;
  checked: boolean;
  toggleStudent: (studentId: string, checked: boolean) => void;
}

const StudentCheckbox = ({ student, checked, toggleStudent }: Props) => {
  return (
    <label
      key={student.id}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer",
        "bg-white border border-slate-100",
        "hover:border-indigo-300 transition-colors",
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => toggleStudent(student.id, Boolean(v))}
      />
      <span className="text-sm font-semibold text-slate-700">
        {student.name}
      </span>
    </label>
  );
};

export default StudentCheckbox;
