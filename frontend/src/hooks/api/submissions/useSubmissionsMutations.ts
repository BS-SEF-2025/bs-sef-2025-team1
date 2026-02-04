import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as submissions from "@/api/submissions";
import { toast } from "sonner";
import type { SubmissionAnswer } from "@/types";

const useSubmissionMutations = () => {
  const queryClient = useQueryClient();

  const createSubmissionMutation = useMutation({
    mutationFn: ({
      assignmentId,
      reviewedGroupId,
      answers,
    }: {
      assignmentId: string;
      reviewedGroupId: string;
      answers: SubmissionAnswer[];
    }) => submissions.createSubmission(assignmentId, reviewedGroupId, answers),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("הביקורת הוגשה בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת הגשת הביקורת");
    },
  });

  return {
    createSubmission: (
      assignmentId: string,
      reviewedGroupId: string,
      answers: SubmissionAnswer[],
    ) =>
      createSubmissionMutation.mutate({
        assignmentId,
        reviewedGroupId,
        answers,
      }),
  };
};

export default useSubmissionMutations;
