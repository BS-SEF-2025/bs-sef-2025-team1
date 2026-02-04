import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Assignment, GroupResult } from "@/types";

interface Props {
  assignments: Assignment[];
  selected: string;
  onChange: (v: string) => void;
  isStaff: boolean;
  groupResults: GroupResult[];
  activeAssignment?: Assignment;
}

export default function AssignmentSelector({
  assignments,
  selected,
  onChange,
  isStaff,
  groupResults,
  activeAssignment,
}: Props) {
  const exportToCsv = () => {
    if (!activeAssignment) return;

    let csv = "קבוצה,מספר ביקורות,ציון ממוצע\n";
    groupResults.forEach((r) => {
      csv += `${r.group.name},${r.count},${r.avg}\n`;
    });

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `report_${activeAssignment.title}.csv`;
    link.click();
  };

  return (
    <div className="flex gap-3 items-center">
      <Select value={selected} onValueChange={onChange} dir="rtl">
        <SelectTrigger className="w-64 bg-slate-50 font-bold rounded-2xl">
          <SelectValue placeholder="בחר משימה" />
        </SelectTrigger>
        <SelectContent>
          {assignments.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isStaff && (
        <Button
          onClick={exportToCsv}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          ייצוא CSV
        </Button>
      )}
    </div>
  );
}
