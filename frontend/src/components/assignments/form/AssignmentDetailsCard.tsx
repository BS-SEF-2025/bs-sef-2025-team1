import type { AssignmentFormReturn } from "@/types/hooks";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import DateTimePicker from "@/components/common/DateTimePicker";

interface Props {
  form: AssignmentFormReturn;
  courses: { id: string; name: string }[];
}

export default function AssignmentDetailsCard({ form, courses }: Props) {
  const { state, actions } = form;

  return (
    <Card className="p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10 p-0">
        {/* Left column */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">
              כותרת המשימה
            </label>
            <Input
              value={state.title}
              onChange={(e) => actions.setTitle(e.target.value)}
              placeholder="לדוגמה: פרויקט סוף סמסטר"
              className={cn(
                "p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl",
                "font-bold focus-visible:ring-0 focus-visible:border-indigo-500",
              )}
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">
              קורס משויך
            </label>
            <Select
              dir="rtl"
              value={state.courseId}
              onValueChange={actions.setCourseId}
            >
              <SelectTrigger
                className={cn(
                  "p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl w-full",
                  "font-bold focus:ring-0 focus:border-indigo-500 cursor-pointer",
                )}
              >
                <SelectValue placeholder="בחר קורס..." />
              </SelectTrigger>

              <SelectContent>
                {courses.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                    className="cursor-pointer"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">
              דדליין להגשת ביקורת
            </label>
            <DateTimePicker
              value={
                form.state.deadline ? new Date(form.state.deadline) : undefined
              }
              onChange={(d) => form.actions.setDeadline(d?.toISOString() ?? "")}
              className={cn(
                "p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl",
                "font-bold focus-visible:ring-0 focus-visible:border-indigo-500 cursor-pointer",
              )}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">
              תיאור והנחיות לסטודנטים
            </label>
            <Textarea
              value={state.description}
              onChange={(e) => actions.setDescription(e.target.value)}
              placeholder="מה הסטודנטים צריכים לבחון בעבודת חבריהם?"
              className={cn(
                "p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl",
                "font-medium h-57.5 resize-none",
                "focus-visible:ring-0 focus-visible:border-indigo-500",
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
