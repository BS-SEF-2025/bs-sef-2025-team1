import { useState } from "react";
import type { Course } from "@/types";

import CoursesHeader from "@/components/courses/CoursesHeader";
import CoursesGrid from "@/components/courses/CoursesGrid";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import CourseStudentsDialog from "@/components/courses/CourseStudentsDialog";

import ErrorScreen from "@/components/status/ErrorScreen";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import LoadingScreen from "@/components/status/LoadingScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";
import useCourses from "@/hooks/api/courses/useCourses";
import { isAxiosError, HttpStatusCode } from "axios";
import useUsers from "@/hooks/api/users/useUsers";

const CourseManagementPage = () => {
  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesErrorData,
  } = useCourses();
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErrorData,
  } = useUsers();

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  if (coursesLoading || usersLoading) {
    return <LoadingScreen />;
  }

  if (coursesError || usersError) {
    const error = coursesErrorData || usersErrorData;
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
      <CoursesHeader onCreate={() => setEditingCourse({} as Course)} />

      <CoursesGrid
        courses={courses!}
        onEdit={setEditingCourse}
        onView={setViewingCourse}
      />

      <CourseFormDialog
        key={editingCourse?.id ?? "new-course"}
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        users={users!}
      />

      <CourseStudentsDialog
        course={viewingCourse}
        onClose={() => setViewingCourse(null)}
        users={users!}
      />
    </div>
  );
};

export default CourseManagementPage;
