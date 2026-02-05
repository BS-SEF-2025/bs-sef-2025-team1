import { useNavigate } from "react-router-dom";
import { useAssignmentForm } from "@/hooks/useAssignmentForm";
import AssignmentHeader from "@/components/assignments/form/AssignmentHeader";
import AssignmentDetailsCard from "@/components/assignments/form/AssignmentDetailsCard";
import FieldsBuilderCard from "@/components/assignments/form/FieldsBuilderCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import ErrorScreen from "@/components/status/ErrorScreen";
import ForbiddenScreen from "@/components/status/ForbiddenScreen";
import LoadingScreen from "@/components/status/LoadingScreen";
import UnauthorizedScreen from "@/components/status/UnauthorizedScreen";

import useCourses from "@/hooks/api/courses/useCourses";
import { isAxiosError, HttpStatusCode } from "axios";
import { formStateValidation } from "@/utils/validation";
import useAssignmentMutations from "@/hooks/api/assignments/useAssignmentMutations";

export default function AssignmentCreatePage() {
  const navigate = useNavigate();
  const form = useAssignmentForm();

  const { data: courses, isLoading, isError, error } = useCourses();

  const { createAssignment } = useAssignmentMutations();

  if (isLoading) return <LoadingScreen />;

  if (isError) {
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

  const handleSubmit = () => {
    const { title, description, courseId, deadline, fields } = form.state;

    createAssignment(title, description, courseId, deadline, fields);
    navigate("/assignments");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="max-w-7xl space-y-8 pb-4"
    >
      <AssignmentHeader mode="create" />

      <AssignmentDetailsCard form={form} courses={courses!} />

      <FieldsBuilderCard form={form} />

      <div className="flex gap-4 mt-10 border-slate-100">
        <Button
          type="submit"
          disabled={!formStateValidation(form.state)}
          className={cn(
            "flex-1 py-8 rounded-2xl text-xl font-black",
            "bg-indigo-600 hover:bg-indigo-700 text-white",
            "shadow-xl shadow-indigo-100 cursor-pointer",
          )}
        >
          יצירת המשימה
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/assignments")}
          className="px-10 py-8 rounded-2xl text-xl font-black cursor-pointer"
        >
          ביטול
        </Button>
      </div>
    </form>
  );
}
