import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FieldType,
  type Assignment,
  type Course,
  type Group,
  type SubmissionAnswer,
  type User,
} from "@/types";

import SubmissionHeader from "./SubmissionHeader";
import GroupSelectorCard from "./GroupSelectorCard";
import FieldsReviewCard from "./FieldsReviewCard";
import SuccessState from "./SuccessState";
import { Button } from "@/components/ui/button";
import useSubmissionMutations from "@/hooks/api/submissions/useSubmissionsMutations";

interface Props {
  user: User;
  assignment: Assignment;
  groups: Group[];
  courses: Course[];
  onComplete?: () => void;
}

const SubmissionForm = ({
  user,
  assignment,
  groups,
  courses,
  onComplete,
}: Props) => {
  const navigate = useNavigate();

  const [reviewedGroupId, setReviewedGroupId] = useState("");
  const [answers, setAnswers] = useState<SubmissionAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const { createSubmission } = useSubmissionMutations();

  const deadlinePassed = new Date(assignment.deadline) < new Date();

  const courseGroups = useMemo(
    () => groups.filter((g) => g.courseId === assignment.courseId),
    [assignment.courseId, groups],
  );

  const myGroup = useMemo(
    () => courseGroups.find((g) => g.members.includes(user.id)),
    [courseGroups, user.id],
  );

  const reviewableGroups = useMemo(
    () => courseGroups.filter((g) => g.id !== myGroup?.id),
    [courseGroups, myGroup?.id],
  );

  useEffect(() => {
    if (assignment) {
      const initialAnswers: SubmissionAnswer[] = assignment.fields.map(
        (field) => ({
          fieldId: field.id,
          value: field.type == FieldType.TEXT ? "" : field.scaleMin!,
        }),
      );

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(initialAnswers);
    }
  }, [assignment]);

  const handleBack = onComplete ? onComplete : () => navigate("/submit");

  if (!assignment) return <Navigate to="submit" />;

  if (submitted) return <SuccessState onBack={handleBack} />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (deadlinePassed) return;

        createSubmission(assignment.id, reviewedGroupId, answers);
        setSubmitted(true);
      }}
      className="max-w-4xl mx-auto space-y-10 pb-20"
    >
      <SubmissionHeader assignment={assignment} courses={courses} />

      <GroupSelectorCard
        reviewedGroupId={reviewedGroupId}
        setReviewedGroupId={setReviewedGroupId}
        reviewableGroups={reviewableGroups}
        myGroup={myGroup!}
      />

      <FieldsReviewCard
        assignment={assignment}
        answers={answers}
        setAnswers={setAnswers}
      />

      <Button
        type="submit"
        disabled={deadlinePassed || !reviewedGroupId}
        className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] text-xl font-black shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0 cursor-pointer"
      >
        שליחת ביקורת סופית
      </Button>
    </form>
  );
};

export default SubmissionForm;
