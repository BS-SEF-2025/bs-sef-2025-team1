import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { UserRole } from "@/types";
import type { Course, User } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import StudentCheckbox from "@/components/common/StudentCheckbox";
import useCourseMutations from "@/hooks/api/courses/useCourseMutations";

interface Props {
  users: User[];
  course: Course | null;
  onClose: () => void;
}

const CourseFormDialog = ({ users, course, onClose }: Props) => {
  const initialName = course?.name ?? "";
  const initialStudents = course?.enrolledStudents ?? [];

  const isOpen = Boolean(course);

  const isEditing = Boolean(course?.id);

  const [courseName, setCourseName] = useState(initialName);
  const [selectedStudents, setSelectedStudents] = useState(initialStudents);

  const { createCourse, updateCourse } = useCourseMutations();

  const students = useMemo(
    () => users.filter((u) => u.role === UserRole.STUDENT),
    [users],
  );

  const toggleStudent = (studentId: string, checked: boolean) => {
    setSelectedStudents((prev) =>
      checked ? [...prev, studentId] : prev.filter((id) => id !== studentId),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = courseName.trim();
    if (!trimmed) return;

    if (isEditing && course?.id) {
      updateCourse(course.id, trimmed, selectedStudents);
    } else {
      createCourse(trimmed, selectedStudents);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden select-none"
      >
        <DialogHeader className="p-8 pb-6">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-black text-slate-900">
              {isEditing ? "עריכת קורס" : "הוספת קורס חדש"}
            </DialogTitle>

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">
              שם הקורס
            </label>
            <Input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="לדוגמה: מבוא למערכות הפעלה"
              className="rounded-xl"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              בחירת סטודנטים
            </label>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {students.length === 0 ? (
                <p className="text-center text-slate-400 py-6 text-sm font-bold">
                  אין סטודנטים זמינים במערכת
                </p>
              ) : (
                <ScrollArea className="max-h-64 pr-2">
                  <div
                    dir="rtl"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {students.map((s: User) => (
                      <StudentCheckbox
                        key={s.id}
                        student={s}
                        checked={selectedStudents.includes(s.id)}
                        toggleStudent={toggleStudent}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold cursor-pointer"
            >
              {isEditing ? "עדכן קורס" : "צור קורס"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="rounded-xl font-bold cursor-pointer"
              onClick={onClose}
            >
              ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormDialog;
