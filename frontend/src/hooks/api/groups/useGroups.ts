import { useQuery } from "@tanstack/react-query";
import * as groups from "@/api/groups";
import type { Group } from "@/types";

const useGroups = () => {
  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: groups.groups,
  });
};

export default useGroups;
