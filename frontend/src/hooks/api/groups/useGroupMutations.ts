import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as groups from "@/api/groups";
import { toast } from "sonner";

const useGroupMutations = () => {
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: ({
      name,
      courseId,
      members,
    }: {
      name: string;
      courseId: string;
      members: string[];
    }) => groups.createGroup({ name, courseId, members }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("הקבוצה נוצרה בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת יצירת הקבוצה");
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({
      groupId,
      name,
      members,
    }: {
      groupId: string;
      name: string;
      members: string[];
    }) => groups.updateGroup({ groupId, name, members }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("הקבוצה עודכנה בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת עדכון הקבוצה");
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: string) => groups.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("הקורס נמחק בהצלחה");
    },
    onError: () => {
      toast.error("אירעה שגיאה בעת מחיקת הקורס");
    },
  });

  return {
    createGroup: (name: string, courseId: string, members: string[]) =>
      createGroupMutation.mutate({ name, courseId, members }),
    updateGroup: (groupId: string, name: string, members: string[]) =>
      updateGroupMutation.mutate({ groupId, name, members }),
    deleteGroup: (groupId: string) => deleteGroupMutation.mutate(groupId),
  };
};

export default useGroupMutations;
