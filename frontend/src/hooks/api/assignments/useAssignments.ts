import { useQuery } from "@tanstack/react-query";
import * as assignments from "@/api/assignments";
import type { Assignment } from "@/types";

const useAssignments = () => {
  return useQuery<Assignment[]>({
    queryKey: ["assignments"],
    queryFn: assignments.assignments,
  });
};

export default useAssignments;
