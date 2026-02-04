import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as courses from "@/api/courses";
import { toast } from "sonner";

const useCourseMutations = () => {
  const queryClient = useQueryClient();

  const createCourseMutation = useMutation({
    mutationFn: ({
      name,
      studentIds,
    }: {
      name: string;
      studentIds: string[];
    }) => courses.createCourse({ name, studentIds }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("הקורס נוצר בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת יצירת הקורס");
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({
      courseId,
      name,
      studentIds,
    }: {
      courseId: string;
      name: string;
      studentIds: string[];
    }) => courses.updateCourse({ courseId, name, studentIds }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("הקורס עודכן בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת עדכון הקורס");
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => courses.deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("הקורס נמחק בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת מחיקת הקורס");
    },
  });

  return {
    createCourse: (name: string, studentIds: string[]) =>
      createCourseMutation.mutate({ name, studentIds }),
    updateCourse: (courseId: string, name: string, studentIds: string[]) =>
      updateCourseMutation.mutate({ courseId, name, studentIds }),
    deleteCourse: (courseId: string) => deleteCourseMutation.mutate(courseId),
  };
};

export default useCourseMutations;
