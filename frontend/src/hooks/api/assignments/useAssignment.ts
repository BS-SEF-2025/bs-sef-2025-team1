import { useQuery } from "@tanstack/react-query";
import * as assignments from "@/api/assignments";
import type { Assignment } from "@/types";

const useAssignment = (assignmentId: string) => {
  return useQuery<Assignment>({
    queryKey: ["assignment", assignmentId],
    queryFn: () => assignments.assignment(assignmentId),
  });
};

export default useAssignment;
