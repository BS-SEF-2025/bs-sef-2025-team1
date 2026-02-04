import { useQuery } from "@tanstack/react-query";
import * as auth from "@/api/auth";
import type { User } from "@/types";

const useMe = () => {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: auth.me,
  });
};

export default useMe;
