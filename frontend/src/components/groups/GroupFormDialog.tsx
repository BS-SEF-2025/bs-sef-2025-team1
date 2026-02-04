import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { UserRole } from "@/types";
import type { Group, User, Course } from "@/types";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import StudentCheckbox from "@/components/common/StudentCheckbox";
import useGroupMutations from "@/hooks/api/groups/useGroupMutations";

interface Props {
  courses: Course[];
  users: User[];
  groups: Group[];
  group: Group | null;
  onClose: () => void;
}

const GroupFormDialog = ({ courses, users, groups, group, onClose }: Props) => {
  const isOpen = Boolean(group);
  const isEditing = Boolean(group?.id);

  const initialName = group?.name ?? "";
  const initialCourseId = group?.courseId ?? "";
  const initialMembers = group?.members ?? [];

  const [name, setName] = useState(initialName);
  const [courseId, setCourseId] = useState(initialCourseId);
  const [selectedMembers, setSelectedMembers] =
    useState<string[]>(initialMembers);

  const { createGroup, updateGroup } = useGroupMutations();

  const students = useMemo(
    () => users.filter((u) => u.role === UserRole.STUDENT),
    [users],
  );

  const currentCourse = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courses, courseId],
  );

  const studentsAlreadyInAGroup = useMemo(() => {
    if (!courseId) return [];
    return groups
      .filter((g) => g.courseId === courseId && g.id !== group?.id)
      .flatMap((g) => g.members);
  }, [courseId, groups, group?.id]);

  const courseStudents = useMemo(() => {
    if (!courseId || !currentCourse) return [];

    return students.filter(
      (u) =>
        currentCourse.enrolledStudents.includes(u.id) &&
        !studentsAlreadyInAGroup.includes(u.id),
    );
  }, [students, currentCourse, courseId, studentsAlreadyInAGroup]);

  const toggleMember = (studentId: string, checked: boolean) => {
    setSelectedMembers((prev) =>
      checked ? [...prev, studentId] : prev.filter((id) => id !== studentId),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed || !courseId) return;

    if (selectedMembers.length === 0) return;

    if (isEditing && group?.id) {
      updateGroup(group.id, trimmed, selectedMembers);
    } else {
      createGroup(trimmed, courseId, selectedMembers);
    }

    onClose();
  };

  const onCourseChange = (value: string) => {
    setCourseId(value);
    // when switching courses, members must be re-picked
    setSelectedMembers([]);
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
              {isEditing ? "עריכת קבוצה" : "הוספת קבוצה חדשה"}
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
          <div className="grid grid-rows-1 md:grid-rows-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                שם הקבוצה
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="לדוגמה: צוות פיתוח אפליקציה"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2 w-full">
              <label className="block text-sm font-bold text-slate-700">
                קורס משויך
              </label>

              <Select dir="rtl" value={courseId} onValueChange={onCourseChange}>
                <SelectTrigger className="rounded-xl w-full cursor-pointer">
                  <SelectValue placeholder="בחר קורס..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c: Course) => (
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
          </div>

          {courseId && (
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">
                בחירת חברי קבוצה (סטודנטים ללא קבוצה בקורס זה)
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {courseStudents.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 font-bold">
                    לא נמצאו סטודנטים זמינים לקבוצה חדשה בקורס זה.
                  </div>
                ) : (
                  <ScrollArea className="max-h-64 pr-2">
                    <div
                      dir="rtl"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {courseStudents.map((s: User) => (
                        <StudentCheckbox
                          key={s.id}
                          student={s}
                          checked={selectedMembers.includes(s.id)}
                          toggleStudent={toggleMember}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              disabled={!courseId || selectedMembers.length === 0}
              className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 font-bold cursor-pointer"
            >
              {isEditing ? "עדכן קבוצה" : "שמור קבוצה"}
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

export default GroupFormDialog;
