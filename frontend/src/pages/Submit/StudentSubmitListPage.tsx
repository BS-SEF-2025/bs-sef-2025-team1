import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useCourses from "@/hooks/api/courses/useCourses";
import useMe from "@/hooks/api/useMe";
import useAssignments from "@/hooks/api/assignments/useAssignments";
import useSubmissions from "@/hooks/api/submissions/useSubmissions";
import { HttpStatusCode, isAxiosError } from "axios";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";
import LoadingScreen from "@/components/status/LoadingScreen";
import ErrorScreen from "@/components/status/ErrorScreen";
import { useCallback, useMemo } from "react";
import type { Assignment } from "@/types";

export default function StudentSubmitList() {
  const navigate = useNavigate();

  const { data: user } = useMe();

  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    error: coursesError,
  } = useCourses();
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

  const mySubmissions = useMemo(
    () => submissions.filter((s) => s.studentId === user!.id),
    [submissions, user],
  );

  const availableAssignments = useMemo(
    () =>
      assignments.filter((a) => {
        const course = courses!.find((c) => c.id === a.courseId);
        return course?.enrolledStudents.includes(user!.id);
      }),
    [assignments, courses, user],
  );

  const getSubmitedCount = useCallback(
    (a: Assignment) =>
      mySubmissions.filter((s) => s.assignmentId === a.id).length,
    [mySubmissions],
  );

  const getCourseName = useCallback(
    (courseId: string) => courses!.find((c) => c.id === courseId)?.name,
    [courses],
  );

  if (
    isCoursesLoading ||
    isAssignmentsLoading ||
    isSubmissionsLoading ||
    !courses ||
    !submissions
  ) {
    return <LoadingScreen />;
  }

  if (isCoursesError || isAssignmentsError || isSubmissionsError) {
    const error = coursesError || assignmentsError || submissionsError;
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
      {/* Header */}
      <Card className="p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          הגשת ביקורות
        </h2>
        <p className="text-slate-500">בחר משימה כדי להעריך את עבודת עמיתיך</p>
      </Card>

      {/* List */}
      <div className="grid gap-4">
        {availableAssignments.map((a) => {
          const deadlinePassed = new Date(a.deadline) < new Date();
          const submittedCount = getSubmitedCount(a);
          const courseName = getCourseName(a.courseId);

          return (
            <Card
              key={a.id}
              className="p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                    {courseName}
                  </span>

                  {submittedCount > 0 && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      {submittedCount} הגשות
                    </span>
                  )}
                </div>

                <h3 className="font-black text-xl text-slate-900 mb-1">
                  {a.title}
                </h3>

                <div className="text-xs font-semibold text-slate-400">
                  דדליין: {new Date(a.deadline).toLocaleString("he-IL")}
                </div>
              </div>

              {/* Action */}
              <Button
                className={cn(
                  "px-10 py-4 rounded-2xl font-black ",
                  deadlinePassed
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white shadow-lg shadow-indigo-200",
                )}
                onClick={() => navigate(`/submit/${a.id}`)}
                disabled={deadlinePassed}
              >
                {deadlinePassed
                  ? "המשימה נסגרה"
                  : submittedCount > 0
                    ? "הוסף ביקורת"
                    : "התחל ביקורת"}
              </Button>
            </Card>
          );
        })}

        {availableAssignments.length === 0 && (
          <Card className="py-24 rounded-[3rem] border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
            <div className="text-7xl mb-6">🏜️</div>
            <p className="text-xl font-bold">אין משימות פתוחות כרגע</p>
          </Card>
        )}
      </div>
    </div>
  );
}
