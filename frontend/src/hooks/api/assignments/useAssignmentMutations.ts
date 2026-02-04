import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as assignments from "@/api/assignments";
import { toast } from "sonner";
import type { Field } from "@/types";

const useAssignmentMutations = () => {
  const queryClient = useQueryClient();

  const createAssignmentMutation = useMutation({
    mutationFn: assignments.createAssignment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("המשימה נוצרה בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת יצירת המשימה");
    },
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: assignments.updateAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("המשימה עודכנה בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת עדכון המשימה");
    },
  });

  const deleteAssignmentMutation = useMutation({
    mutationFn: (assignmentId: string) =>
      assignments.deleteAssignment(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("המשימה נמחק בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת מחיקת המשימה");
    },
  });

  return {
    createAssignment: (
      title: string,
      description: string,
      courseId: string,
      deadline: string,
      fields: Field[],
    ) =>
      createAssignmentMutation.mutate({
        title,
        description,
        courseId,
        deadline,
        fields,
      }),
    updateAssignment: (
      assignmentId: string,
      title: string,
      description: string,
      deadline: string,
      fields: Field[],
    ) =>
      updateAssignmentMutation.mutate({
        assignmentId,
        title,
        description,
        deadline,
        fields,
      }),
    deleteAssignment: (assignmentId: string) =>
      deleteAssignmentMutation.mutate(assignmentId),
  };
};

export default useAssignmentMutations;
