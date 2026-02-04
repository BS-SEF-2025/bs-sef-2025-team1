import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye } from "lucide-react";
import type { Course } from "@/types";
import ConfirmDeleteDialog from "@/components/common/ConfirmDeleteDialog";
import useCourseMutations from "@/hooks/api/courses/useCourseMutations";

const CourseCard = ({
  course,
  onEdit,
  onView,
}: {
  course: Course;
  onEdit: () => void;
  onView: () => void;
}) => {
  const { deleteCourse } = useCourseMutations();

  return (
    <Card className="rounded-[2.5rem] border border-slate-100">
      <CardContent className="px-8 py-4 flex flex-col gap-4 space-y-8">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-black">{course.name}</h3>
            <p className="text-sm text-slate-500">
              {course.enrolledStudents.length} סטודנטים רשומים
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="icon"
              className="cursor-pointer"
              variant="ghost"
              onClick={onEdit}
            >
              <Pencil className="w-4 h-4 text-amber-500" />
            </Button>
            <ConfirmDeleteDialog
              title="למחוק את הקורס?"
              description={`פעולה זו תמחק את הקורס "${course.name}" לצמיתות ולא ניתן יהיה לשחזר אותו.`}
              confirmText="מחק קורס"
              onConfirm={() => deleteCourse(course.id)}
              trigger={
                <Button size="icon" variant="ghost" className="cursor-pointer">
                  <Trash className="w-4 h-4 text-rose-500" />
                </Button>
              }
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onView}
          className="rounded-xl w-fit px-4 py-2 text-indigo-600 hover:text-indigo-600/75 bg-indigo-50/50 hover:bg-indigo-50 transition-all cursor-pointer"
        >
          <Eye className="w-4 h-4 mr-2" />
          צפייה ברשימה
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
