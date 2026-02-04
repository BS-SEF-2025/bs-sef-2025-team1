import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as users from "@/api/users";
import type { UserRole } from "@/types";
import { toast } from "sonner";

const useUsersMutations = () => {
  const queryClient = useQueryClient();

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      users.updateUserRole(userId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("תפקיד המשתמש עודכן בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת עדכון תפקיד המשתמש");
    },
  });

  return {
    updateUserRole: (userId: string, role: UserRole) =>
      roleMutation.mutate({ userId, role }),
  };
};

export default useUsersMutations;
