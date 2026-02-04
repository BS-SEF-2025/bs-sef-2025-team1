import { NavLink } from "react-router-dom";

import AssignmentCard from "@/components/assignments/AssignmentCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useCourses from "@/hooks/api/courses/useCourses";
import { HttpStatusCode, isAxiosError } from "axios";
import ErrorScreen from "@/components/status/ErrorScreen";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import LoadingScreen from "@/components/status/LoadingScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";
import useAssignments from "@/hooks/api/assignments/useAssignments";

const AssignmentManagement = () => {
  const {
    data: courses,
    isLoading: coursesLoading,
    isError: coursesError,
    error: coursesErrorData,
  } = useCourses();
  const {
    data: assignments,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
    error: assignmentsErrorData,
  } = useAssignments();

  if (coursesLoading || assignmentsLoading) {
    return <LoadingScreen />;
  }

  if (coursesError || assignmentsError) {
    const error = coursesErrorData || assignmentsErrorData;
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900">ניהול משימות</h2>
          <p className="text-slate-500 text-sm">
            צור שאלונים דינמיים ונהל את דדליין ההגשה
          </p>
        </div>

        <Button
          asChild
          className="rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700"
        >
          <NavLink to="/assignments/create" className="flex gap-2">
            <Plus className="w-5 h-5" />
            משימה חדשה
          </NavLink>
        </Button>
      </div>

      <div className="space-y-6">
        {assignments?.length === 0 ? (
          <div className="py-24 bg-white rounded-[3rem] border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
            <div className="text-7xl mb-6">📋</div>
            <p className="text-xl font-bold">לא נוצרו משימות עדיין</p>
          </div>
        ) : (
          assignments?.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              courseName={courses?.find((c) => c.id === a.courseId)?.name ?? ""}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AssignmentManagement;
