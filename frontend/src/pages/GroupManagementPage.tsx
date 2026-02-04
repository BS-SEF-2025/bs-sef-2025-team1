import { useState } from "react";
import { UserRole, type Group } from "@/types";

import GroupsHeader from "@/components/groups/GroupsHeader";
import GroupsGrid from "@/components/groups/GroupsGrid";
import useCourses from "@/hooks/api/courses/useCourses";
import useGroups from "@/hooks/api/groups/useGroups";
import ErrorScreen from "@/components/status/ErrorScreen";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import LoadingScreen from "@/components/status/LoadingScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";
import useUsers from "@/hooks/api/users/useUsers";
import { isAxiosError, HttpStatusCode } from "axios";
import GroupFormDialog from "@/components/groups/GroupFormDialog";
import StudentsDialog from "@/components/common/StudentsDialog";
import useMe from "@/hooks/api/useMe";

const GroupManagement = () => {
  const { data: user } = useMe();

  const {
    data: groups = [],
    isLoading: isGroupsLoading,
    isError: isGroupsError,
    error: groupsError,
  } = useGroups();
  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    error: coursesError,
  } = useCourses();
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useUsers();

  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);

  if (user?.role != UserRole.STAFF) {
    return <ForbiddenScreen />;
  }

  if (isCoursesLoading || isUsersLoading || isGroupsLoading) {
    return <LoadingScreen />;
  }

  if (isGroupsError || isUsersError || isCoursesError) {
    const error = groupsError || usersError || coursesError;
    if (isAxiosError(error)) {
      if (error.response?.status === HttpStatusCode.Unauthorized) {
        return <UnauthorizedScreen />;
      }

      if (error.response?.status === HttpStatusCode.Forbidden) {
        return <ForbiddenScreen />;
      }
    }

    return <ErrorScreen />;
  }

  return (
    <div className="space-y-8">
      <GroupsHeader onCreate={() => setEditingGroup({} as Group)} />

      <GroupsGrid
        groups={groups}
        courses={courses}
        onEdit={setEditingGroup}
        onView={setViewingGroup}
      />

      <GroupFormDialog
        key={editingGroup?.id ?? "new-group"}
        group={editingGroup}
        onClose={() => setEditingGroup(null)}
        courses={courses}
        groups={groups}
        users={users}
      />

      <StudentsDialog
        open={Boolean(viewingGroup)}
        title="חברי הקבוצה"
        subtitle={viewingGroup?.name ?? ""}
        users={users!}
        onClose={() => setViewingGroup(null)}
        studentIds={viewingGroup?.members}
      />
    </div>
  );
};

export default GroupManagement;
