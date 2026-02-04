import { useEffect, useMemo, useState } from "react";
import { UserRole } from "../types";

import ResultsHeader from "@/components/results/ResultsHeader";
import AssignmentSelector from "@/components/results/AssignmentSelector";
import GroupAnalyticsTable from "@/components/results/GroupAnalyticsTable";
import SubmissionsList from "@/components/results/SubmissionsList";
import useMe from "@/hooks/api/useMe";
import useGroups from "@/hooks/api/groups/useGroups";
import useUsers from "@/hooks/api/users/useUsers";
import LoadingScreen from "@/components/status/LoadingScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";
import { HttpStatusCode, isAxiosError } from "axios";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import ErrorScreen from "@/components/status/ErrorScreen";
import useAssignments from "@/hooks/api/assignments/useAssignments";
import useSubmissions from "@/hooks/api/submissions/useSubmissions";

export default function ResultsView() {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");

  const { data: user } = useMe();

  const {
    data: groups = [],
    isLoading: isGroupsLoading,
    isError: isGroupsError,
    error: groupsError,
  } = useGroups();
  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useUsers();
  const {
    data: assignments = [],
    isLoading: isAssignmentsLoading,
    isError: isAssignmentsError,
    error: assignmentsError,
  } = useAssignments();
  const {
    data: submissions = [],
    isLoading: isSubmissionsLoading,
    isError: isSubmissionsError,
    error: submissionsError,
  } = useSubmissions();

  const activeAssignment = assignments.find(
    (a) => a.id === selectedAssignmentId,
  );

  useEffect(() => {
    if (selectedAssignmentId == "" && assignments.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAssignmentId(assignments[0].id);
    }
  }, [assignments, selectedAssignmentId]);

  const relevantSubmissions = useMemo(() => {
    if (user!.role === UserRole.STAFF) {
      return submissions.filter((s) => s.assignmentId === selectedAssignmentId);
    }

    return submissions.filter((s) => {
      const assignment = assignments.find((a) => a.id === s.assignmentId);
      const myGroup = groups.find(
        (g) =>
          g.members.includes(user!.id) && g.courseId === assignment?.courseId,
      );
      return (
        s.assignmentId === selectedAssignmentId &&
        s.reviewedGroupId === myGroup?.id
      );
    });
  }, [assignments, groups, selectedAssignmentId, submissions, user]);

  const groupResults = useMemo(() => {
    return groups
      .filter((g) => g.courseId === activeAssignment?.courseId)
      .map((g) => {
        const groupSubs = submissions.filter(
          (s) =>
            s.assignmentId === selectedAssignmentId &&
            s.reviewedGroupId === g.id,
        );
        const avg =
          groupSubs.length > 0
            ? groupSubs.reduce((sum, s) => sum + s.calculatedScore, 0) /
              groupSubs.length
            : 0;

        return {
          group: g,
          avg: Math.round(avg * 100) / 100,
          count: groupSubs.length,
        };
      });
  }, [groups, activeAssignment?.courseId, submissions, selectedAssignmentId]);

  if (
    isAssignmentsLoading ||
    isUsersLoading ||
    isGroupsLoading ||
    isSubmissionsLoading
  ) {
    return <LoadingScreen />;
  }

  if (
    isGroupsError ||
    isUsersError ||
    isAssignmentsError ||
    isSubmissionsError
  ) {
    const error =
      groupsError || usersError || assignmentsError || submissionsError;
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
    <div className="space-y-10">
      <ResultsHeader>
        <AssignmentSelector
          assignments={assignments!}
          selected={selectedAssignmentId}
          onChange={setSelectedAssignmentId}
          groupResults={groupResults}
          activeAssignment={activeAssignment}
          isStaff={user!.role === UserRole.STAFF}
        />
      </ResultsHeader>

      {user!.role === UserRole.STAFF && (
        <GroupAnalyticsTable rows={groupResults} />
      )}

      <SubmissionsList
        submissions={relevantSubmissions}
        users={users!}
        groups={groups!}
        assignments={assignments!}
        isStaff={user!.role === UserRole.STAFF}
      />
    </div>
  );
}
