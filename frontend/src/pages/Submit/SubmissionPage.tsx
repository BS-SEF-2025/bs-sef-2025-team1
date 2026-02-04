import { useParams } from "react-router-dom";

import SubmissionForm from "@/components/submissions/SubmissionForm";

import useMe from "@/hooks/api/useMe";
import useGroups from "@/hooks/api/groups/useGroups";
import useCourses from "@/hooks/api/courses/useCourses";

import LoadingScreen from "@/components/status/LoadingScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import ErrorScreen from "@/components/status/ErrorScreen";

import { isAxiosError, HttpStatusCode } from "axios";
import useAssignment from "@/hooks/api/assignments/useAssignment";

export default function SubmissionPage() {
  const { assignment: assignmentId } = useParams<{ assignment: string }>();

  const { data: user } = useMe();

  const {
    data: groups = [],
    isLoading: groupsLoading,
    isError: groupsError,
    error: groupsErrorData,
  } = useGroups();

  const {
    data: assignment,
    isLoading: assignmentLoading,
    isError: assignmentError,
    error: assignmentErrorData,
  } = useAssignment(assignmentId!);
  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesErrorData,
  } = useCourses();

  if (groupsLoading || assignmentLoading || coursesLoading) {
    return <LoadingScreen />;
  }

  if (groupsError || assignmentError || coursesError) {
    const error = groupsErrorData || assignmentErrorData || coursesErrorData;

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
    <SubmissionForm
      user={user!}
      groups={groups!}
      assignment={assignment!}
      courses={courses!}
    />
  );
}
