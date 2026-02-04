import { useQuery } from "@tanstack/react-query";
import * as statistics from "@/api/statistics";
import type { Statistics } from "@/types";

const useStatistics = () => {
  return useQuery<Statistics>({
    queryKey: ["statistics"],
    queryFn: statistics.statistics,
  });
};

export default useStatistics;
