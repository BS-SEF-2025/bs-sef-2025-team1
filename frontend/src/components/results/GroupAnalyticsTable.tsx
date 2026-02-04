import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { GroupResult } from "@/types";

export default function GroupAnalyticsTable({ rows }: { rows: GroupResult[] }) {
  return (
    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50">
        <h3 className="font-black text-xl text-slate-900">ניתוח לפי קבוצות</h3>
      </div>

      <Table dir="rtl">
        <TableHeader className="bg-slate-50/50 text-slate-400 text-[11px] uppercase font-black tracking-widest">
          <TableRow>
            <TableHead className="px-8 py-5">שם הקבוצה</TableHead>
            <TableHead className="px-8 py-5">כמות ביקורות</TableHead>
            <TableHead className="px-8 py-5">ציון ממוצע</TableHead>
            <TableHead className="px-8 py-5">מדד מהימנות</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-50">
          {rows.map((row) => (
            <TableRow
              key={row.group.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="px-8 py-6 font-black text-slate-900">
                {row.group.name}
              </TableCell>

              <TableCell className="px-8 py-6 font-bold text-slate-500">
                {row.count} ביקורות
              </TableCell>

              <TableCell className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full min-w-30 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        row.avg > 80
                          ? "bg-emerald-500"
                          : row.avg > 60
                            ? "bg-indigo-500"
                            : "bg-amber-500",
                      )}
                      style={{ width: `${row.avg}%` }}
                    />
                  </div>
                  <span className="font-black text-slate-900">{row.avg}%</span>
                </div>
              </TableCell>

              <TableCell className="px-8 py-6">
                <span
                  className={cn(
                    "text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider",
                    row.count >= 3
                      ? "bg-emerald-50 text-emerald-600"
                      : row.count > 0
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-400",
                  )}
                >
                  {row.count >= 3
                    ? "מהימנות גבוהה"
                    : row.count > 0
                      ? "דרושות ביקורות"
                      : "אין נתונים"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
