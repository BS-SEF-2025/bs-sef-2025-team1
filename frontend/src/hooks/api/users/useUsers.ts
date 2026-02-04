import { useQuery } from "@tanstack/react-query";
import * as users from "@/api/users";
import type { User } from "@/types";

const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: users.users,
  });
};

export default useUsers;
