import { useQuery } from "@tanstack/react-query";
import * as submissions from "@/api/submissions";
import type { Submission } from "@/types";

const useSubmissions = () => {
  return useQuery<Submission[]>({
    queryKey: ["submissions"],
    queryFn: submissions.submissions,
  });
};

export default useSubmissions;
